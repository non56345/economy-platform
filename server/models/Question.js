const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    weekNumber: { type: Number, required: true, unique: true },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
