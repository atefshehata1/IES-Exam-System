const mongoose = require("mongoose");

const examsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subjects",
    required: false,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teachers",
    required: true,
  },
  students: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Students", required: true },
  ],
  full_mark: {
    type: Number,
    required: true,
  },
  num_of_questions: {
    type: Number,
    required: true,
  },
  questions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Questions", required: true },
  ],
  path: {
    type: String,
  },
});

module.exports = mongoose.model("Exams", examsSchema);
