const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const DbQueryManager = require("../utils/dbQueryManager")
const User = require("../models/UserModel")

module.exports.me = catchAsync(async (req, res, next) => {
  // const user = req.user.toPublic()
  const user = await User.findById(req.user.id).populate([
    {
      path: "enrolledCourses",
      select: "id title syllabus",
    },
    {
      path: "ownedCourses",
      select: "id title syllabus",
    },
  ])

  res.status(200).json({ status: "success", data: { data: user.toPublic() } })
})

module.exports.changeRole = catchAsync(async (req, res, next) => {
  let updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { type: req.body.role, background: req.body.background },
    { new: true, runValidators: true }
  )
  updatedUser = updatedUser.toPublic()
  res.status(200).json({ status: "success", data: { data: updatedUser } })
})
