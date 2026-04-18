const mongoose = require("mongoose");

const subjectsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teachers",
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
      default: [],
    },
  ],
  exams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exams",
      required: true,
      default: [],
    },
  ],
});

module.exports = mongoose.model("Subjects", subjectsSchema);
