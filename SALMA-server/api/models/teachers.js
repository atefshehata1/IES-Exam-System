const mongoose = require("mongoose");

const teachersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
    default: "",
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subjects",
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
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
      default: [],
    },
  ],
  pdfs: [{ name: String, pdf_url: String }],
  student_groups: [
    {
      name: String,
      students: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Students",
          required: true,
          default: [],
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Teachers", teachersSchema);
