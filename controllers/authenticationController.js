const catchAsync = require("./../utils/catchAsync")
const AppError = require("../utils/appError")
const generatePasswordHashAndSalt = require("../utils/generatePasswordHashAndSalt")
const verifyPassword = require("../utils/verifyPassword")
const signJwt = require("../utils/signJwt")
const User = require("../models/UserModel")

const passport = require("passport")

const adminSignupService = async (
  firstName,
  lastName,
  birthDate,
  email,
  username,
  password,
  type = "admin"
) => {
  const passwordHash = await generatePasswordHashAndSalt(password)

  let newAdmin = new User({
    firstName,
    lastName,
    birthDate,
    email,
    username,
    password: passwordHash,
    type,
    created_at: new Date(),
    passwordLastChangedAt: new Date(),
  })

  newAdmin = await newAdmin.save()
  return newAdmin
}
module.exports.adminSignupService = adminSignupService

// For all users
module.exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    // Invalid email
    throw new AppError("Invalid username or password", 401)
  }
  const isValid = await verifyPassword(req.body.password, user.password)
  if (!isValid) {
    // Invalid password
    throw new AppError("Invalid email or password", 401)
  }

  // Valid email & pass
  const tokenObject = signJwt(user._id, user.type)
  const publicUser = user.toPublic()
  res.status(200).json({
    status: "success",
    data: {
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
      ...publicUser,
    },
  })
})

module.exports.signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, birthDate, email, username, password } = req.body
  const type = "learner"
  User.validatePassword(password) // If there is an error it would be caught by catchAsync.
  const passwordHash = await generatePasswordHashAndSalt(password)

  let newUser = new User({
    firstName,
    lastName,
    birthDate,
    email,
    username,
    password: passwordHash,
    type,
    created_at: new Date(),
    passwordLastChangedAt: new Date(),
  })

  newUser = await newUser.save() // If there is an error it would be caught by catchAsync.

  const tokenObject = signJwt(newUser._id, newUser.type)
  const publicUser = newUser.toPublic()
  res.status(200).json({
    status: "success",
    data: {
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
      ...publicUser,
    },
  })
})

module.exports.adminSignup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, birthDate, email, username, password } = req.body
  const type = "admin"

  User.validatePassword(password) // If there is an error it would be caught by catchAsync.
  const newAdmin = await adminSignupService(
    firstName,
    lastName,
    birthDate,
    email,
    username,
    password,
    type
  ) // If there is an error it would be caught by catchAsync.

  const tokenObject = signJwt(newAdmin._id, newAdmin.type)
  const publicUser = newAdmin.toPublic()
  res.status(200).json({
    status: "success",
    data: {
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
      ...publicUser,
    },
  })
})

module.exports.adminChangePassword = catchAsync(async (req, res, next) => {
  const { password } = req.body

  User.validatePassword(password) // If there is an error it would be caught by catchAsync.
  const passwordHash = generatePasswordHashAndSalt(password)

  req.user.password = passwordHash

  const newAdmin = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: req.user.password,
    },
    { new: true, runValidators: true }
  )

  const tokenObject = signJwt(newAdmin._id, newAdmin.type)
  const publicUser = newAdmin.toPublic()

  res.status(200).json({
    status: "success",
    data: {
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
      ...publicUser,
    },
  })
})

module.exports.adminDelete = catchAsync(async (req, res, next) => {
  const response = await User.findByIdAndDelete(req.params.id)
  res.status(200).json({
    status: "success",
  })
})

module.exports.getAdmins = catchAsync(async (req, res, next) => {
  const admins = await User.find()
  res.status(200).json({
    status: "success",
    data: { admins },
  })
})

module.exports.protect = () => {
  return passport.authenticate("jwt", { session: false })
}

module.exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const myRole = req.user.type

    if (!roles.includes(myRole)) {
      return next(
        new AppError(
          "You are unauthorized. This route is restricted to certain type of users.",
          401
        )
      )
    } else {
      return next()
    }
  }
}
