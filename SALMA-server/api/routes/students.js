const express = require("express");
const router = express.Router();
const Student = require("../models/students");

/**
 * GET /:id - Get student by ID
 * @param {string} id - Student ID
 * @returns {Object} Student data or error message
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findById(id)
      .populate('teachers', 'name') // Populate teacher names
      .populate('exam_grades.exam_id', 'name full_mark') // Populate exam details
      .populate('exam_grades.question_grades.question_id', 'question grade'); // Populate question details
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.status(200).json({ 
      student,
      message: "Student retrieved successfully" 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
