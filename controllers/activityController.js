const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const DbQueryManager = require("../utils/dbQueryManager");
const Course = require("../models/CourseModel");
const VideoActivity = require("../models/videoActivityModel");

module.exports.videoActivityCreate = catchAsync(async (req, res, next) => {
  const { title, description, url } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) throw new AppError("Invalid course!", 401);

  const newVideo = new VideoActivity({
    title,
    description,
    url,
    course: course._id,
  });
  newVideo = await newVideo.save();

  res.status(200).json({
    status: "success",
    video: newVideo,
  });
});
