const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const teacherRoutes = require("./api/routes/teachers");
const userRoutes = require("./api/routes/user");
const studentRoutes = require("./api/routes/students");
const cors = require("cors");
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
const path = require('path');
// app.use(express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const port = process.env.PORT || 5000;
const url = process.env.MONGO_URL || "mongodb://localhost:27017/school";

// log the name of the collections and the database name
mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }
//   next();
// });

app.use(morgan("dev"));
app.use("/teachers", teacherRoutes);
app.use("/user", userRoutes);
app.use("/students", studentRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

module.exports = app;


/*

The decision threshold determines the score above which an instance is classified as positive.
*/
 