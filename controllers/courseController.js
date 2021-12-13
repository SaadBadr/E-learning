const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const DbQueryManager = require("../utils/dbQueryManager");
const Course = require("../models/CourseModel");

module.exports.courseCreate = catchAsync(async (req, res, next) => {
  const { syllabus, title } = req.body;
  const instructor = req.user._id;

  let newCourse = new Course({ syllabus, title, instructor });
  newCourse = await newCourse.save();

  res.status(200).json({
    status: "success",
    course: newCourse,
  });
});

module.exports.courseGet = catchAsync(async (req, res, next) => {
  const courseId = req.params.id;
  const userId = req.user._id;
  const userType = req.user.type;
  const course = await Course.findById(courseId).populate(
    "activities",
    "-active -__v"
  );

  if (
    userType != "admin" &&
    course.instructor != userId &&
    !user.enrolledCourses.includes(courseId)
  ) {
    throw new AppError("You are not allowed to access this course", 401);
  }

  res.status(200).json({
    status: "success",
    course,
  });
});
