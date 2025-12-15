const mongoose = require("mongoose");
require("dotenv").config();

const Question = require("../models/Question");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // نحذف سؤال الأسبوع 1 لو موجود
    await Question.deleteOne({ weekNumber: 1 });

    // نضيف سؤال جديد
    await Question.create({
      weekNumber: 1,
      questionText: "ما هو تعريف علم الاقتصاد؟",
      options: [
        "دراسة توزيع الموارد النادرة",
        "دراسة التاريخ السياسي",
        "علم الطبيعة",
        "دراسة الأحياء"
      ],
      correctIndex: 0
    });

    console.log("✅ تم زرع سؤال الأسبوع بنجاح");
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
