const mongoose = require("mongoose");

const questionsSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
    validate: {
  validator: function(v) {
    return v && typeof v === 'string' && v.trim().length > 0;
  }
}
  },
  answer: {
    type: String,
    required: true,
  },
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exams",
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Questions", questionsSchema);
