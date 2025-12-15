const express = require("express");
const Answer = require("../models/Answer");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:questionId", auth, async (req, res) => {
  const answers = await Answer.find({ question: req.params.questionId })
    .populate("user", "major");

  const total = answers.length;
  const correct = answers.filter(a => a.isCorrect).length;

  const byMajor = {};
  answers.forEach(a => {
    const m = a.user.major;
    if (!byMajor[m]) byMajor[m] = { total: 0, correct: 0 };
    byMajor[m].total++;
    if (a.isCorrect) byMajor[m].correct++;
  });

  res.json({ total, correct, byMajor });
});

module.exports = router;
