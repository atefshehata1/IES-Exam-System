const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Teacher = require("../models/teachers.js");
const User = require("../models/users");
const Exam = require("../models/exams");
const Question = require("../models/questions");
const Student = require("../models/students");
const Subject = require("../models/subjects");
const ExamAnswers = require("../models/examanswers");
const { checkExist } = require("../middleware/helpers");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createPdfFromText } = require("../middleware/pdf_helpers");
const axios = require("axios");

/**
 * Placeholder function for grading logic (to be implemented)
 * @param {Object} question - Question object from database
 * @param {string} answer - Correct answer from question
 * @param {string} studentAnswer - Student's submitted answer
 * @param {number} full_mark - Maximum marks for the question
 * @returns {Object} Grading result object
 */
function GetGrade(question, answer, studentAnswer, full_mark) {
  return { text_answer: "ASDASD", grade: 8, explanation: "ASDASD" };
}
// Set up multer to store files in memory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { id } = req.params;
    const uploadDir = path.join(__dirname, `../../uploads/${id}`);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Save files in the specified folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original file name
  },
});

const imageFolderStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { teacherId, examId, studentId } = req.params;
    const uploadDir = path.join(
      __dirname,
      `../../uploads/${teacherId}/${examId}/${studentId}`
    );
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Save files in the specified folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original file name
  },
});

const imageUpload = multer({ storage: imageFolderStorage });

const upload = multer({ storage: storage });

/**
 * GET /:id - Get all exams for a teacher
 * @param {string} id - Teacher ID
 * @returns {Object} Teacher's exams or error message
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let status = 200;
    let message = "";
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      status = 404;
      message = "Teacher not found";
      return res.status(status).json({ message });
    }
    const exams = await Exam.find({ teacher: id });
    if (exams.length === 0) {
      status = 200;
      message = "No exams found";
    }
    res.status(status).json({ name: teacher.name, exams, message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /:id/uploads - Upload PDFs for a teacher
 * @param {string} id - Teacher ID
 * @returns {Object} Upload confirmation or error
 */
router.post("/:id/uploads", upload.array("pdf", 10), async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const pdfPaths = req.files.map((file) => file.path);
    for (let i = 0; i < pdfPaths.length; i++) {
      const pdf = { name: req.files[i].originalname, pdf_url: pdfPaths[i] };
      teacher.pdfs.push(pdf);
    }
    await teacher.save();

    console.log("File saved at:", pdfPaths);
    res.status(200).json({ message: "Uploaded" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /:id/exams/generate - Get all PDFs for question generation
 * @param {string} id - Teacher ID
 * @returns {Object} List of PDFs or error
 */
router.get("/:id/exams/generate", async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const pdfs = teacher.pdfs;
    if (pdfs.length === 0) {
      return res
        .status(204)
        .json({ message: "No data found please upload pdfs" });
    }
    res.status(200).json({ teacher: teacher.name, pdfs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /:id/exams/create-with-questions - Create exam and save questions in one operation
 * @param {string} id - Teacher ID
 * @param {Object} req.body - Exam data {exam_name, subject, questions, students, lang}
 *   - exam_name: string (optional, defaults to "temp")
 *   - subject: string (Subject ID, required)
 *   - questions: array (optional, can be empty for empty exam)
 *   - students: array (optional)
 *   - lang: string (optional, defaults to "en", can be "en" or "ar")
 * @returns {Object} Created exam object with PDF or error
 */
router.post("/:id/exams/create-with-questions", async (req, res) => {
  try {
    const { id } = req.params;
    let {
      exam_name = "temp",
      subject,
      questions = [],
      students = [],
      lang = "en",
    } = req.body;

    console.log("Creating exam with questions:", req.body);

    // Validate teacher exists
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Validate subject exists
    const subjectObj = await Subject.findById(subject);
    if (!subjectObj) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Validate language parameter
    if (lang && !["en", "ar"].includes(lang)) {
      return res.status(400).json({
        message: "Invalid language. Supported languages: 'en' or 'ar'",
      });
    }

    // Calculate total marks and number of questions
    const full_mark = questions.reduce((total, q) => total + (q.grade || 0), 0);
    const num_of_questions = questions.length;

    // Create exam
    const exam = new Exam({
      name: exam_name,
      teacher: id,
      full_mark,
      num_of_questions,
      students: [],
      subject: subjectObj._id,
      questions: [],
      path: "",
    });

    // Add exam to subject
    subjectObj.exams.push(exam._id);
    await subjectObj.save();

    // Create and save questions if provided
    let Qobjects = [];
    for (let i = 0; i < questions.length; i++) {
      let { question, answer, grade } = questions[i];
      // Validate and sanitize question data before creating
      if (!question || typeof question !== "string") {
        return res.status(400).json({
          message: `Question ${i + 1} is missing or invalid`,
        });
      }

      if (!answer || typeof answer !== "string") {
        return res.status(400).json({
          message: `Answer for question ${i + 1} is missing or invalid`,
        });
      }

      // Sanitize the strings
      const sanitizedQuestion = question.trim();
      const sanitizedAnswer = answer.trim();
      const sanitizedGrade = grade && typeof grade === "number" ? grade : 10;

      if (!sanitizedQuestion) {
        return res.status(400).json({
          message: `Question ${i + 1} cannot be empty`,
        });
      }

      if (!sanitizedAnswer) {
        return res.status(400).json({
          message: `Answer for question ${i + 1} cannot be empty`,
        });
      }

      let newQuestion = new Question({
        question,
        answer,
        exam_id: exam._id,
        grade,
      });
      Qobjects.push(newQuestion);
      await newQuestion.save();
    }

    // Update exam with question IDs
    exam.questions = Qobjects.map((q) => q._id);

    // Generate PDF
    const pdfPath = path.join(__dirname, `../../exams/${id}/${exam._id}.pdf`);

    // Select font based on language
    const fontPath =
      lang === "ar"
        ? path.join(
            __dirname,
            "../../(A) Arslan Wessam A (A) Arslan Wessam A.ttf"
          )
        : path.join(
            __dirname,
            "../../OpenSans-Italic-VariableFont_wdth,wght.ttf"
          );

    const dir = path.dirname(pdfPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let questionsText = " "; // Default for empty exam
    let questionIds = " ";

    if (Qobjects.length > 0) {
      // Format questions for PDF - each question on separate page
      questionsText = Qobjects.map(
        (q, index) => `Question ${index + 1} (${q.grade} marks):\n${q.question}`
      ).join("\n\n\n\n");

      questionIds = Qobjects.map((q) => q._id.toString()).join("\n\n");
    }
    await createPdfFromText(
      questionsText,
      pdfPath,
      fontPath,
      questionIds,
      lang,
      true
    );

    exam.path = pdfPath;
    await exam.save();

    // Add exam to teacher
    teacher.exams.push(exam._id);
    await teacher.save();

    // Read PDF and convert to base64
    const pdfData = fs.readFileSync(pdfPath);
    const base64Pdf = pdfData.toString("base64");

    res.status(201).json({
      exam,
      base64Pdf,
      questions: Qobjects,
      message: `Exam created successfully with ${num_of_questions} question(s) and PDF generated`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /:teacherId/exams/:examId - Get specific exam details
 * @param {string} teacherId - Teacher ID
 * @param {string} examId - Exam ID
 * @returns {Object} Exam details or error
 */
router.get("/:teacherId/exams/:examId", async (req, res) => {
  try {
    const { teacherId, examId } = req.params;
    const teacher = await Teacher.findById(teacherId);
    const exam = await Exam.findById(examId);
    const { isValid, message } = checkExist([
      (teacher, "Teacher not found"),
      (exam, "Exam not found"),
    ]);
    if (!isValid) {
      return res.status(404).json({ message });
    }

    res.status(200).json({ exam });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /:teacherId/exams/:examId - Delete an exam
 * @param {string} teacherId - Teacher ID
 * @param {string} examId - Exam ID
 * @returns {Object} Confirmation message or error
 */
router.delete("/:teacherId/exams/:examId", async (req, res) => {
  try {
    const { teacherId, examId } = req.params;
    const teacher = await Teacher.findById(teacherId);
    const exam = await Exam.findByIdAndDelete(examId);
    const { isValid, message } = checkExist([
      (teacher, "Teacher not found"),
      (exam, "Exam not found"),
    ]);
    if (!isValid) {
      return res.status(404).json({ message });
    }
    teacher.exams = teacher.exams.filter((id) => id !== examId);
    await teacher.save();

    for (let i = 0; i < exam.questions.length; i++) {
      await question.findByIdAndDelete(exam.questions[i]);
    }

    res.status(200).json({ message: "Exam deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /:teacherId/exams/:examId/genqa - Get QA from PDF
 * @param {string} teacherId - Teacher ID
 * @param {string} pdfName - PDF filename
 * @returns {Object} PDF data or error
 */
router.post("/:teacherId/exams/genqa", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { pdfName, paragraph } = req.body;
    const teacher = await Teacher.findById(teacherId);
    const pdf = teacher.pdfs.find((pdf) => pdf.name.endsWith(pdfName));
    const { isValid, message } = checkExist([
      (teacher | false, "Teacher not found"),
      (pdf | false, "Pdf not found"),
      (paragraph | false, "Paragraph not found"),
    ]);
    if (!isValid) {
      return res.status(404).json({ message });
    }
    const pdfPath = pdf.pdf_url;
    const pdfData = fs.readFileSync(pdfPath);
    const base64Pdf = pdfData.toString("base64");
    const AI_ENDPOINT = "http://127.0.0.1:8085/process";
    const response = await axios.post(AI_ENDPOINT, {
      paragrpath: paragraph,
      pdf: base64Pdf,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /:teacherId/exams/genqa_full - Get QA from multiple PDFs
 * @param {string} teacherId - Teacher ID
 * @param {string[]} pdfNames - Array of PDF filenames
 * @returns {Object} PDF data or error
 */
router.post("/:teacherId/exams/genqa_full", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { pdfNames } = req.body;

    const teacher = await Teacher.findById(teacherId);

    // Find all PDFs that match the provided names
    const pdfs = teacher.pdfs.filter((pdf) =>
      pdfNames.some((pdfName) => pdf.name.endsWith(pdfName))
    );

    const { isValid, message } = checkExist([
      (teacher, "Teacher not found"),
      (pdfs.length > 0, "No matching PDFs found"),
      (pdfNames && pdfNames.length > 0, "PDF names array not provided"),
    ]);

    if (!isValid) {
      return res.status(404).json({ message });
    }

    // Convert all PDFs to base64
    const base64Pdfs = pdfs.map((pdf) => {
      const pdfData = fs.readFileSync(pdf.pdf_url);
      return {
        name: pdf.name,
        data: pdfData.toString("base64"),
      };
    });

    const AI_ENDPOINT = "http://127.0.0.1:8085/generate_full";
    const response = await axios.post(AI_ENDPOINT, {
      pdfs: base64Pdfs,
    });

    // console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /:teacherId/exams/:examId/edit - Get exam editing interface
 * @param {string} teacherId - Teacher ID
 * @param {string} examId - Exam ID
 * @returns {Object} Exam data and PDFs for editing
 */
router.get("/:teacherId/exams/:examId/edit", async (req, res) => {
  try {
    const { teacherId, examId } = req.params;

    const teacher = await Teacher.findById(teacherId);
    const exam = await Exam.findOne({ _id: examId });
    const pdfs = teacher.pdfs;
    const { isValid, message } = checkExist([
      (teacher, "Teacher not found"),
      (exam, "Exam not found"),
    ]);
    if (!isValid) {
      return res.status(404).json({ message });
    }
    if (pdfs.length === 0) {
      return res
        .status(204)
        .json({ message: "No data found please upload pdfs" });
    }
    res.status(200).json({ teacher: teacher.name, exam, pdfs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// get all students grades for an exam
/**
 * GET /:teacherId/exams/:examId/grade - Get all student grades for exam
 * @param {string} teacherId - Teacher ID
 * @param {string} examId - Exam ID
 * @returns {Object} List of student grades
 */

router.get("/:teacherId/exams/:examId/grade", async (req, res) => {
  try {
    const { teacherId, examId } = req.params;

    const teacher = await Teacher.findById(teacherId);
    const exam = await Exam.findOne({ _id: examId });
    const { isValid, message } = checkExist([
      (teacher, "Teacher not found"),
      (exam, "Exam not found"),
    ]);
    if (!isValid) {
      return res.status(404).json({ message });
    }
    const studentIds = exam.students;
    const students = await Student.find({ _id: { $in: studentIds } });
    const studentGrades = students.map((student) => {
      const examGrade = student.exam_grades.find((ex) =>
        ex.exam_id.equals(new mongoose.Types.ObjectId(examId))
      );
      return {
        student_id: student._id,
        student_name: student.name,
        total_grade: examGrade.total_grade,
      };
    });
    res.status(200).json({ exam, students, studentGrades });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// get a student grade for an exam
/**
 * GET /:teacherId/exams/:examId/grade/:studentId - Get detailed student grade
 * @param {string} teacherId - Teacher ID
 * @param {string} examId - Exam ID
 * @param {string} studentId - Student ID
 * @returns {Object} Detailed grade breakdown with all exam details
 */
router.get("/:teacherId/exams/:examId/grade/:studentId", async (req, res) => {
  try {
    const { teacherId, examId, studentId } = req.params;
    const teacher = await Teacher.findById(teacherId);
    const exam = await Exam.findById(examId);
    const student = await Student.findById(studentId);
    const { isValid, message } = checkExist([
      (teacher, "Teacher not found"),
      (exam, "Exam not found"),
      (student, "Student not found"),
    ]);
    if (!isValid) {
      return res.status(404).json({ message });
    }

    const studentExam = student.exam_grades.find((ex) =>
      ex.exam_id.equals(examId)
    );
    if (!studentExam) {
      return res.status(404).json({ message: "Student didn't take the exam" });
    }

    // Get all exam answers for this student and exam
    const examAnswers = await ExamAnswers.find({
      exam_id: examId,
      student_id: studentId,
    });

    // Get detailed information for each question
    const questionDetails = await Promise.all(
      exam.questions.map(async (questionId) => {
        const question = await Question.findById(questionId);
        const examAnswer = examAnswers.find((answer) =>
          answer.question_id.equals(questionId)
        );

        if (!question) {
          return {
            question_id: questionId,
            question_text: "Question not found",
            correct_answer: "N/A",
            max_grade: 0,
            student_grade: 0,
            student_answer_image: null,
            student_answer: "No answer",
            explanation: "Question not found",
          };
        }

        if (!examAnswer) {
          return {
            question_id: question._id,
            question_text: question.question,
            correct_answer: question.answer,
            max_grade: question.grade,
            student_grade: 0,
            student_answer_image: null,
            student_answer: "No answer submitted",
            explanation: "No answer submitted",
          };
        }

        return {
          question_id: question._id,
          question_text: question.question,
          correct_answer: question.answer,
          max_grade: question.grade,
          student_grade: examAnswer.grade,
          student_answer: examAnswer.student_answer,
          explanation: examAnswer.explanation,
        };
      })
    );

    res.status(200).json({
      exam: {
        id: exam._id,
        name: exam.name,
        full_mark: exam.full_mark,
        num_of_questions: exam.num_of_questions,
      },
      student: {
        id: student._id,
        name: student.name,
      },
      teacher: {
        id: teacher._id,
        name: teacher.name,
      },
      grade_summary: {
        total_grade: studentExam.total_grade,
        max_total_grade: exam.full_mark,
        percentage: Math.round(
          (studentExam.total_grade / exam.full_mark) * 100
        ),
      },
      question_details: questionDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// grade an exam for a student
/**
 * POST /:teacherId/exams/:examId/grade/:studentId - Grade student exam
 * @param {string} teacherId - Teacher ID
 * @param {string} examId - Exam ID
 * @param {string} studentId - Student ID
 * @param {File[]} images - Answer images (multipart form)
 * @returns {Object} Grading results
 */
router.post(
  "/:teacherId/exams/:examId/grade/:studentId",
  imageUpload.array("images", 15),
  async (req, res) => {
    try {
      const { teacherId, examId, studentId } = req.params;
      const teacher = await Teacher.findById(teacherId);
      const exam = await Exam.findById(examId);
      const student = await Student.findById(studentId);
      const { isValid, message } = checkExist([
        (teacher, "Teacher not found"),
        (exam, "Exam not found"),
        (student, "Student not found"),
        (req.files && exam.num_of_questions === req.files.length,
        `Number of questions in exam is ${exam.num_of_questions} but ${
          req.files ? req.files.length : 0
        } images were uploaded`),
      ]);

      if (!isValid) {
        return res.status(404).json({ message });
      }
      exam.students.push(studentId);
      await exam.save();
      const questions = exam.questions;
      let totalGrade = 0;
      // grade_pipeline(questions, teacherId, studentId, examId);
      // question["img"], question["questionId"], question["questionAnswer"];
      let questionArray = [];
      for (let i = 0; i < questions.length; i++) {
        const question = await Question.findById(questions[i]);
        const studentAnswer = req.files[i].path;
        const base64Image = fs.readFileSync(studentAnswer, {
          encoding: "base64",
        });
        questionArray.push({
          img: base64Image,
          questionId: question._id,
          questionAnswer: question.answer,
        });
      }
      const AI_ENDPOINT = "http://127.0.0.1:8085/grade";
      const response = await axios.post(AI_ENDPOINT, {
        questions: questionArray,
        teacherId,
        studentId,
        examId,
      });

      const grades = response.data;
      let final_grades = [];
      let questionGradeDetails = []; // Array to store detailed question info

      for (let i = 0; i < grades.length; i++) {
        const [QID, grade, explanation, corrected_text, ideal_answer] =
          grades[i];
        console.log(QID, grade, explanation, corrected_text, ideal_answer);
        totalGrade += grade;

        // Get question details
        const question = await Question.findById(QID);

        const examAnswer = new ExamAnswers({
          exam_id: examId,
          question_id: QID,
          student_id: studentId,
          student_answer_image: questionArray[i].img,
          student_answer: corrected_text,
          grade,
          explanation,
        });

        final_grades.push({
          question_id: QID,
          grade,
        });

        // Add detailed question info for response
        questionGradeDetails.push({
          question_id: QID,
          question_text: question.question,
          grade: grade,
          max_grade: question.grade,
          explanation: explanation,
          student_answer: corrected_text,
          ideal_answer: ideal_answer,
        });

        await examAnswer.save();
      }

      student.exam_grades.push({
        exam_id: examId,
        total_grade: totalGrade,
        question_grades: final_grades,
      });

      await student.save();
      res.status(200).json({
        message: "Graded",
        total_grade: totalGrade,
        max_total_grade: exam.full_mark,
        question_details: questionGradeDetails,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// add a student to an exam
/**
 * POST /:teacherId/exams/:examId/addstudent/:studentId - Add student to exam
 * @param {string} teacherId - Teacher ID
 * @param {string} examId - Exam ID
 * @param {string} studentId - Student ID
 * @returns {Object} Updated exam and student
 */

router.post(
  "/:teacherId/exams/:examId/addstudent/:studentId",
  async (req, res) => {
    try {
      const { teacherId, examId, studentId } = req.params;
      const teacher = await Teacher.findById(teacherId);
      const exam = await Exam.findById(examId);
      const student = await Student.findById(studentId);

      const { isValid, message } = checkExist([
        (teacher, "Teacher not found"),
        (exam, "Exam not found"),
        (student, "Student not found"),
      ]);
      if (!isValid) {
        return res.status(404).json({ message });
      }
      exam.students.push(studentId);
      await exam.save();
      await student.save();
      res.status(200).json({ message: "Student added to exam", exam, student });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * POST /:teacherId/subjects/:subjectId/addstudent/:studentId - Add student to subject and teacher
 * @param {string} teacherId - Teacher ID
 * @param {string} subjectId - Subject ID
 * @param {string} studentId - Student ID
 * @returns {Object} Updated subject and confirmation message
 */
router.post(
  "/:teacherId/subjects/:subjectId/addstudent/:studentId",
  async (req, res) => {
    try {
      const { teacherId, subjectId, studentId } = req.params;

      const [teacher, subject, student] = await Promise.all([
        Teacher.findById(teacherId),
        Subject.findById(subjectId),
        Student.findById(studentId),
      ]);

      const { isValid, message } = checkExist([
        (teacher, "Teacher not found"),
        (subject, "Subject not found"),
        (student, "Student not found"),
      ]);

      if (!isValid) {
        return res.status(404).json({ message });
      }

      // Verify that the subject belongs to the teacher
      if (!subject.teacher.equals(teacherId)) {
        return res
          .status(403)
          .json({ message: "Subject does not belong to this teacher" });
      }

      // Check if student is already enrolled in the subject
      if (subject.students.includes(studentId)) {
        return res
          .status(400)
          .json({ message: "Student is already enrolled in this subject" });
      }

      // Add student to subject
      subject.students.push(studentId);
      await subject.save();

      // Automatically add student to teacher if not already assigned
      if (!teacher.students) {
        teacher.students = [];
      }
      if (!teacher.students.includes(studentId)) {
        teacher.students.push(studentId);
        await teacher.save();
      }

      // Add teacher to student's teachers array if not already assigned
      if (!student.teachers.includes(teacherId)) {
        student.teachers.push(teacherId);
        await student.save();
      }

      res.status(200).json({
        message: "Student added to subject and teacher successfully",
        subject: {
          id: subject._id,
          name: subject.name,
          students_count: subject.students.length,
        },
        student: {
          id: student._id,
          name: student.name,
        },
        teacher: {
          id: teacher._id,
          name: teacher.name,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * GET /:id - Get all students for a teacher
 * @param {string} id - Teacher ID
 * @returns {Object} Teacher's exams or error message
 */
router.get("/:id/students", async (req, res) => {
  try {
    const { id } = req.params;
    let status = 200;
    let message = "";
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      status = 404;
      message = "Teacher not found";
      return res.status(status).json({ message });
    }
    const students = await Student.find({ teachers: { $in: [id] } });
    if (students.length === 0) {
      status = 200;
      message = "No students found";
    }
    res.status(status).json({ name: teacher.name, students, message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /:teacherId/subjects - Get all subjects for a teacher
 * @param {string} teacherId - Teacher ID
 * @returns {Object} Teacher's subjects
 */
router.get("/:teacherId/subjects", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await Teacher.findById(teacherId);

    const { isValid, message } = checkExist([(teacher, "Teacher not found")]);
    if (!isValid) {
      return res.status(404).json({ message });
    }

    // Get all subjects for this teacher from the Subject collection
    const subjects = await Subject.find({ teacher: teacherId });

    if (subjects.length === 0) {
      return res.status(200).json({
        teacher_name: teacher.name,
        subjects: [],
        message: "No subjects found",
      });
    }

    // Format subjects with student count
    const formattedSubjects = subjects.map((subject) => ({
      id: subject._id,
      name: subject.name,
      students_count: subject.students.length,
      exams_count: subject.exams.length,
    }));

    res.status(200).json({
      teacher_name: teacher.name,
      subjects: formattedSubjects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /:teacherId/subjects - Create a new subject for a teacher
 * @param {string} teacherId - Teacher ID
 * @param {Object} req.body - Subject data {name, students}
 * @returns {Object} Created subject or error
 */
router.post("/:teacherId/subjects", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { name, students = [] } = req.body;

    const teacher = await Teacher.findById(teacherId);
    const { isValid, message } = checkExist([
      (teacher, "Teacher not found"),
      (name, "Subject name is required"),
    ]);

    if (!isValid) {
      return res.status(404).json({ message });
    }

    // Check if subject name already exists for this teacher
    const existingSubject = await Subject.findOne({
      teacher: teacherId,
      name: name,
    });

    if (existingSubject) {
      return res.status(400).json({
        message: "Subject with this name already exists for this teacher",
      });
    }

    const newSubject = new Subject({
      name,
      teacher: teacherId,
      students,
      exams: [],
    });

    await newSubject.save();

    // Add subject to teacher's subjects array
    teacher.subjects.push(newSubject._id);
    await teacher.save();

    res.status(201).json({
      message: "Subject created successfully",
      subject: newSubject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /:teacherId/subjects/:subjectId/students - Get students for a teacher's subject
 * @param {string} teacherId - Teacher ID
 * @param {string} subjectId - Subject ID
 * @returns {Object} List of students in the subject or error
 */
router.get("/:teacherId/subjects/:subjectId/students", async (req, res) => {
  try {
    const { teacherId, subjectId } = req.params;

    const teacher = await Teacher.findById(teacherId);
    const subject = await Subject.findById(subjectId).populate(
      "students",
      "name email"
    );

    const { isValid, message } = checkExist([
      (teacher, "Teacher not found"),
      (subject, "Subject not found"),
    ]);

    if (!isValid) {
      return res.status(404).json({ message });
    }

    // Verify that the subject belongs to the teacher
    if (!subject.teacher.equals(teacherId)) {
      return res
        .status(403)
        .json({ message: "Subject does not belong to this teacher" });
    }

    if (subject.students.length === 0) {
      return res.status(200).json({
        subject: {
          id: subject._id,
          name: subject.name,
        },
        students: [],
        message: "No students enrolled in this subject",
      });
    }

    res.status(200).json({
      subject: {
        id: subject._id,
        name: subject.name,
      },
      students: subject.students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /:teacherId/subjects/:subjectId/students/:studentId/exams - Get exams a student took for a specific subject
 * @param {string} teacherId - Teacher ID
 * @param {string} subjectId - Subject ID
 * @param {string} studentId - Student ID
 * @returns {Object} List of exams the student took for the subject or error
 */
router.get(
  "/:teacherId/subjects/:subjectId/students/:studentId/exams",
  async (req, res) => {
    try {
      const { teacherId, subjectId, studentId } = req.params;

      const [teacher, subject, student] = await Promise.all([
        Teacher.findById(teacherId),
        Subject.findById(subjectId).populate("exams"),
        Student.findById(studentId),
      ]);

      const { isValid, message } = checkExist([
        (teacher, "Teacher not found"),
        (subject, "Subject not found"),
        (student, "Student not found"),
      ]);

      if (!isValid) {
        return res.status(404).json({ message });
      }

      // Verify that the subject belongs to the teacher
      if (!subject.teacher.equals(teacherId)) {
        return res
          .status(403)
          .json({ message: "Subject does not belong to this teacher" });
      }

      // Verify that the student is enrolled in the subject
      if (!subject.students.includes(studentId)) {
        return res
          .status(403)
          .json({ message: "Student is not enrolled in this subject" });
      }

      // Get all exams for this subject that the student took
      const studentExamIds = student.exam_grades.map((grade) =>
        grade.exam_id.toString()
      );
      const subjectExamIds = subject.exams.map((exam) => exam._id.toString());

      // Find intersection of student's taken exams and subject's exams
      const takenExamIds = studentExamIds.filter((examId) =>
        subjectExamIds.includes(examId)
      );

      if (takenExamIds.length === 0) {
        return res.status(200).json({
          subject: {
            id: subject._id,
            name: subject.name,
          },
          student: {
            id: student._id,
            name: student.name,
          },
          exams: [],
          message: "Student has not taken any exams for this subject",
        });
      }

      // Get detailed exam information with grades
      const examsWithGrades = await Promise.all(
        takenExamIds.map(async (examId) => {
          const exam = await Exam.findById(examId);
          const studentGrade = student.exam_grades.find(
            (grade) => grade.exam_id.toString() === examId
          );

          return {
            exam_id: exam._id,
            exam_name: exam.name,
            full_mark: exam.full_mark,
            num_of_questions: exam.num_of_questions,
            student_grade: studentGrade.total_grade,
            date_taken: studentGrade.date_taken || null,
          };
        })
      );

      res.status(200).json({
        subject: {
          id: subject._id,
          name: subject.name,
        },
        student: {
          id: student._id,
          name: student.name,
        },
        exams: examsWithGrades,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * GET /student/:studentId/teachers-subjects - Get all teachers with subjects that a student is enrolled in
 * @param {string} studentId - Student ID
 * @returns {Object} List of teachers with their subjects that the student is enrolled in
 */
router.get("/student/:studentId/teachers-subjects", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find all subjects where the student is enrolled
    const enrolledSubjects = await Subject.find({
      students: { $in: [studentId] },
    }).populate("teacher", "name email");

    if (enrolledSubjects.length === 0) {
      return res.status(200).json({
        student: {
          id: student._id,
          name: student.name,
        },
        teachers: [],
        message: "Student is not enrolled in any subjects",
      });
    }

    // Group subjects by teacher
    const teachersMap = new Map();

    enrolledSubjects.forEach((subject) => {
      const teacherId = subject.teacher._id.toString();

      if (!teachersMap.has(teacherId)) {
        teachersMap.set(teacherId, {
          teacher_id: subject.teacher._id,
          teacher_name: subject.teacher.name,
          teacher_email: subject.teacher.email,
          subjects: [],
        });
      }

      teachersMap.get(teacherId).subjects.push({
        subject_id: subject._id,
        subject_name: subject.name,
        exams_count: subject.exams.length,
      });
    });

    // Convert map to array
    const teachersWithSubjects = Array.from(teachersMap.values());

    res.status(200).json({
      student: {
        id: student._id,
        name: student.name,
      },
      teachers: teachersWithSubjects,
      total_teachers: teachersWithSubjects.length,
      total_subjects: enrolledSubjects.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /student/:studentId/teacher/:teacherId/subjects - Get subjects that a student has with a specific teacher
 * @param {string} studentId - Student ID
 * @param {string} teacherId - Teacher ID
 * @returns {Object} List of subjects the student has with the specific teacher
 */
router.get(
  "/student/:studentId/teacher/:teacherId/subjects",
  async (req, res) => {
    try {
      const { studentId, teacherId } = req.params;

      // Validate both student and teacher exist
      const [student, teacher] = await Promise.all([
        Student.findById(studentId),
        Teacher.findById(teacherId),
      ]);

      const { isValid, message } = checkExist([
        (student, "Student not found"),
        (teacher, "Teacher not found"),
      ]);

      if (!isValid) {
        return res.status(404).json({ message });
      }

      // Find all subjects where:
      // 1. The teacher is the instructor
      // 2. The student is enrolled
      const sharedSubjects = await Subject.find({
        teacher: teacherId,
        students: { $in: [studentId] },
      });

      if (sharedSubjects.length === 0) {
        return res.status(200).json({
          student: {
            id: student._id,
            name: student.name,
          },
          teacher: {
            id: teacher._id,
            name: teacher.name,
            email: teacher.email,
          },
          subjects: [],
          message: "Student has no subjects with this teacher",
        });
      }

      // Format subjects with additional details
      const formattedSubjects = await Promise.all(
        sharedSubjects.map(async (subject) => {
          // Get exams for this subject that the student has taken
          const subjectExams = await Exam.find({ subject: subject._id });
          const studentExamIds = student.exam_grades.map((grade) =>
            grade.exam_id.toString()
          );

          const takenExams = subjectExams.filter((exam) =>
            studentExamIds.includes(exam._id.toString())
          );

          // Calculate average grade for this subject if student has taken exams
          let averageGrade = null;
          let totalExamsGrade = 0;
          let totalMaxGrade = 0;

          if (takenExams.length > 0) {
            takenExams.forEach((exam) => {
              const studentGrade = student.exam_grades.find(
                (grade) => grade.exam_id.toString() === exam._id.toString()
              );
              if (studentGrade) {
                totalExamsGrade += studentGrade.total_grade;
                totalMaxGrade += exam.full_mark;
              }
            });

            if (totalMaxGrade > 0) {
              averageGrade = Math.round(
                (totalExamsGrade / totalMaxGrade) * 100
              );
            }
          }

          return {
            subject_id: subject._id,
            subject_name: subject.name,
            total_students: subject.students.length,
            total_exams: subject.exams.length,
            exams_taken_by_student: takenExams.length,
            student_average_percentage: averageGrade,
            student_total_grade: totalExamsGrade,
            max_possible_grade: totalMaxGrade,
          };
        })
      );

      res.status(200).json({
        student: {
          id: student._id,
          name: student.name,
        },
        teacher: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
        },
        subjects: formattedSubjects,
        total_shared_subjects: formattedSubjects.length,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * GET /student/:studentId/exams - Get all exams that a student has taken
 * @param {string} studentId - Student ID
 * @returns {Object} List of all exams the student has taken with details
 */
router.get("/student/:studentId/exams", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if student has taken any exams
    if (!student.exam_grades || student.exam_grades.length === 0) {
      return res.status(200).json({
        student: {
          id: student._id,
          name: student.name,
        },
        exams: [],
        total_exams: 0,
        message: "Student has not taken any exams",
      });
    }

    // Get detailed information for each exam the student has taken
    const examDetails = await Promise.all(
      student.exam_grades.map(async (examGrade) => {
        const exam = await Exam.findById(examGrade.exam_id)
          .populate("teacher", "name email")
          .populate("subject", "name");

        if (!exam) {
          return {
            exam_id: examGrade.exam_id,
            exam_name: "Exam not found",
            subject_name: "Unknown",
            teacher_name: "Unknown",
            teacher_email: "Unknown",
            student_grade: examGrade.total_grade,
            max_grade: 0,
            percentage: 0,
            num_of_questions: 0,
            date_taken: examGrade.date_taken || null,
            status: "Exam data missing",
          };
        }

        const percentage =
          exam.full_mark > 0
            ? Math.round((examGrade.total_grade / exam.full_mark) * 100)
            : 0;

        return {
          exam_id: exam._id,
          exam_name: exam.name,
          subject_id: exam.subject ? exam.subject._id : null,
          subject_name: exam.subject ? exam.subject.name : "Unknown Subject",
          teacher_id: exam.teacher ? exam.teacher._id : null,
          teacher_name: exam.teacher ? exam.teacher.name : "Unknown Teacher",
          teacher_email: exam.teacher ? exam.teacher.email : "Unknown",
          student_grade: examGrade.total_grade,
          max_grade: exam.full_mark,
          percentage: percentage,
          num_of_questions: exam.num_of_questions,
          date_taken: examGrade.date_taken || null,
          question_grades: examGrade.question_grades || [],
          status: "Completed",
        };
      })
    );

    // Sort exams by date taken (most recent first), then by exam name
    examDetails.sort((a, b) => {
      if (a.date_taken && b.date_taken) {
        return new Date(b.date_taken) - new Date(a.date_taken);
      } else if (a.date_taken) {
        return -1;
      } else if (b.date_taken) {
        return 1;
      } else {
        return a.exam_name.localeCompare(b.exam_name);
      }
    });

    // Calculate overall statistics
    const totalGrade = examDetails.reduce(
      (sum, exam) => sum + exam.student_grade,
      0
    );
    const totalMaxGrade = examDetails.reduce(
      (sum, exam) => sum + exam.max_grade,
      0
    );
    const overallPercentage =
      totalMaxGrade > 0 ? Math.round((totalGrade / totalMaxGrade) * 100) : 0;

    // Group exams by subject for additional insights
    const examsBySubject = examDetails.reduce((acc, exam) => {
      const subjectName = exam.subject_name;
      if (!acc[subjectName]) {
        acc[subjectName] = {
          subject_id: exam.subject_id,
          subject_name: subjectName,
          teacher_name: exam.teacher_name,
          exams_count: 0,
          total_grade: 0,
          total_max_grade: 0,
          average_percentage: 0,
        };
      }
      acc[subjectName].exams_count++;
      acc[subjectName].total_grade += exam.student_grade;
      acc[subjectName].total_max_grade += exam.max_grade;
      acc[subjectName].average_percentage =
        acc[subjectName].total_max_grade > 0
          ? Math.round(
              (acc[subjectName].total_grade /
                acc[subjectName].total_max_grade) *
                100
            )
          : 0;
      return acc;
    }, {});

    res.status(200).json({
      student: {
        id: student._id,
        name: student.name,
      },
      exams: examDetails,
      total_exams: examDetails.length,
      overall_statistics: {
        total_grade: totalGrade,
        total_max_grade: totalMaxGrade,
        overall_percentage: overallPercentage,
        subjects_count: Object.keys(examsBySubject).length,
      },
      performance_by_subject: Object.values(examsBySubject),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /:teacherId/profile - Get teacher profile information
 * @param {string} teacherId - Teacher ID
 * @returns {Object} Teacher profile information or error
 */
router.get("/:teacherId/profile", async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find the associated user to get email
    const user = await User.findOne({ profile_id: teacherId });

    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    // Return teacher information without sensitive data
    const teacherProfile = {
      id: teacher._id,
      name: teacher.name,
      email: user.email,
      phone: teacher.phone,
      bio: teacher.bio,
      subjects_count: teacher.subjects.length,
      exams_count: teacher.exams.length,
      students_count: teacher.students.length,
      pdfs_count: teacher.pdfs.length,
    };

    res.status(200).json({
      message: "Teacher profile retrieved successfully",
      teacher: teacherProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /:teacherId/profile - Edit teacher profile
 * @param {string} teacherId - Teacher ID
 * @param {Object} req.body - Profile data {name, email, phone, bio}
 * @returns {Object} Updated teacher profile or error
 */
router.put("/:teacherId/profile", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { name, email, phone, bio } = req.body;

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find the associated user
    const user = await User.findOne({ profile_id: teacherId });

    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || email.trim().length === 0) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!phone || phone.trim().length === 0) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check if email is already used by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email: email.trim() });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    // Update teacher fields
    teacher.name = name.trim();
    teacher.phone = phone.trim();

    // Bio is optional, so only update if provided
    if (bio !== undefined) {
      teacher.bio = bio.trim();
    }

    // Update user fields
    user.name = name.trim();
    user.email = email.trim();

    await teacher.save();
    await user.save();

    // Return updated teacher profile
    const updatedProfile = {
      id: teacher._id,
      name: teacher.name,
      email: user.email,
      phone: teacher.phone,
      bio: teacher.bio,
      subjects_count: teacher.subjects.length,
      exams_count: teacher.exams.length,
      students_count: teacher.students.length,
      pdfs_count: teacher.pdfs.length,
    };

    res.status(200).json({
      message: "Teacher profile updated successfully",
      teacher: updatedProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /student/:studentId/profile - Get student profile information
 * @param {string} studentId - Student ID
 * @returns {Object} Student profile information or error
 */
router.get("/student/:studentId/profile", async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the associated user to get email
    const user = await User.findOne({ profile_id: studentId });

    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    // Calculate total exams taken
    const totalExamsTaken = student.exam_grades
      ? student.exam_grades.length
      : 0;

    // Calculate overall average grade
    let overallAverage = 0;
    let totalGrade = 0;
    let totalMaxGrade = 0;

    if (totalExamsTaken > 0) {
      for (const examGrade of student.exam_grades) {
        const exam = await Exam.findById(examGrade.exam_id);
        if (exam) {
          totalGrade += examGrade.total_grade;
          totalMaxGrade += exam.full_mark;
        }
      }

      if (totalMaxGrade > 0) {
        overallAverage = Math.round((totalGrade / totalMaxGrade) * 100);
      }
    }

    // Get count of subjects student is enrolled in
    const enrolledSubjects = await Subject.countDocuments({
      students: { $in: [studentId] },
    });

    // Get count of teachers
    const teachersCount = student.teachers ? student.teachers.length : 0;

    // Return student information without sensitive data
    const studentProfile = {
      id: student._id,
      name: student.name,
      email: user.email,
      phone: student.phone,
      bio: student.bio,
      student_id: student.student_id,
      enrolled_subjects_count: enrolledSubjects,
      teachers_count: teachersCount,
      total_exams_taken: totalExamsTaken,
      overall_average_percentage: overallAverage,
      total_grade_points: totalGrade,
      total_max_grade_points: totalMaxGrade,
    };

    res.status(200).json({
      message: "Student profile retrieved successfully",
      student: studentProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /student/:studentId/profile - Edit student profile
 * @param {string} studentId - Student ID
 * @param {Object} req.body - Profile data {name, email, phone, bio}
 * @returns {Object} Updated student profile or error
 */
router.put("/student/:studentId/profile", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, email, phone, bio } = req.body;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the associated user
    const user = await User.findOne({ profile_id: studentId });

    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || email.trim().length === 0) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!phone || phone.trim().length === 0) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check if email is already used by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email: email.trim() });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    // Update student fields
    student.name = name.trim();
    student.phone = phone.trim();

    // Bio is optional, so only update if provided
    if (bio !== undefined) {
      student.bio = bio.trim();
    }

    // Update user fields
    user.name = name.trim();
    user.email = email.trim();

    await student.save();
    await user.save();

    // Calculate updated statistics for response
    const totalExamsTaken = student.exam_grades
      ? student.exam_grades.length
      : 0;
    let overallAverage = 0;
    let totalGrade = 0;
    let totalMaxGrade = 0;

    if (totalExamsTaken > 0) {
      for (const examGrade of student.exam_grades) {
        const exam = await Exam.findById(examGrade.exam_id);
        if (exam) {
          totalGrade += examGrade.total_grade;
          totalMaxGrade += exam.full_mark;
        }
      }

      if (totalMaxGrade > 0) {
        overallAverage = Math.round((totalGrade / totalMaxGrade) * 100);
      }
    }

    const enrolledSubjects = await Subject.countDocuments({
      students: { $in: [studentId] },
    });

    const teachersCount = student.teachers ? student.teachers.length : 0;

    // Return updated student profile
    const updatedProfile = {
      id: student._id,
      name: student.name,
      email: user.email,
      phone: student.phone,
      bio: student.bio,
      student_id: student.student_id,
      enrolled_subjects_count: enrolledSubjects,
      teachers_count: teachersCount,
      total_exams_taken: totalExamsTaken,
      overall_average_percentage: overallAverage,
      total_grade_points: totalGrade,
      total_max_grade_points: totalMaxGrade,
    };

    res.status(200).json({
      message: "Student profile updated successfully",
      student: updatedProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
