const express = require("express");
const jwt = require("jsonwebtoken");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const User = require("../models/User");

const router = express.Router();

/* ===============================
   Middleware: التحقق من التوكن
================================ */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ===============================
   POST: نشر سؤال الأسبوع (مشرف)
   /api/questions
================================ */
router.post("/", requireAuth, async (req, res) => {
  try {
    // 🔒 فقط الأدمن
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "غير مصرح" });
    }

    const { weekNumber, questionText, options, correctIndex } = req.body;

    if (
      weekNumber === undefined ||
      !questionText ||
      !Array.isArray(options) ||
      options.length < 2 ||
      correctIndex === undefined
    ) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    // 1️⃣ لو فيه سؤال قديم لنفس الأسبوع → نحذفه + نحذف إجاباته
    const oldQuestion = await Question.findOne({ weekNumber });

    if (oldQuestion) {
      await Answer.deleteMany({ questionId: oldQuestion._id });
      await Question.deleteOne({ _id: oldQuestion._id });
    }

    // 2️⃣ إنشاء سؤال جديد (إحصائيات = صفر)
    const question = await Question.create({
      weekNumber,
      questionText,
      options,
      correctIndex,
    });

    res.json({
      message: "✅ تم نشر سؤال الأسبوع بنجاح",
      questionId: question._id,
    });
  } catch (err) {
    console.error("Create question error:", err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

/* ===============================
   GET: جلب سؤال الأسبوع
   /api/questions/week/:week
================================ */
router.get("/week/:week", requireAuth, async (req, res) => {
  try {
    const weekNumber = Number(req.params.week);

    const question = await Question.findOne({ weekNumber }).lean();

    if (!question) {
      return res.status(404).json({ message: "لا يوجد سؤال لهذا الأسبوع" });
    }

    delete question.correctIndex; // ❌ لا نرجع الحل

    res.json({ question });
  } catch (err) {
    console.error("Get question error:", err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

/* ===============================
   POST: إرسال إجابة + إحصائيات
   /api/questions/answer/:id
================================ */
router.post("/answer/:id", requireAuth, async (req, res) => {
  try {
    const { selectedIndex } = req.body;
    const questionId = req.params.id;

    if (selectedIndex === undefined) {
      return res.status(400).json({ message: "الإجابة مطلوبة" });
    }

    const question = await Question.findById(questionId);
    const user = await User.findById(req.user.id);

    if (!question || !user) {
      return res.status(404).json({ message: "بيانات غير موجودة" });
    }

    const alreadyAnswered = await Answer.findOne({
      studentId: user._id,
      questionId,
    });

    if (alreadyAnswered) {
      return res
        .status(400)
        .json({ message: "لقد أجبت على هذا السؤال مسبقاً" });
    }

    const isCorrect = selectedIndex === question.correctIndex;

    await Answer.create({
      studentId: user._id,
      questionId,
      major: user.major,
      selectedIndex,
      isCorrect,
    });

    // الإحصائيات
    const totalAnswers = await Answer.countDocuments({ questionId });
    const correctAnswers = await Answer.countDocuments({
      questionId,
      isCorrect: true,
    });

    const majorsStats = await Answer.aggregate([
      { $match: { questionId: question._id } },
      {
        $group: {
          _id: "$major",
          total: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
    ]);

    res.json({
      correct: isCorrect,
      stats: {
        totalAnswers,
        correctAnswers,
        majors: majorsStats.map((m) => ({
          major: m._id,
          percent: Math.round((m.correct / m.total) * 100),
        })),
      },
    });
  } catch (err) {
    console.error("Submit answer error:", err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

module.exports = router;
