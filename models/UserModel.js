const mongoose = require("mongoose")
const validator = require("validator")
const AppError = require("../utils/appError")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Name must be specified."],
      validate: [
        {
          validator: function (v) {
            return /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF- ]*$|^[a-zA-Z]+[a-zA-Z-' ]*$/.test(
              v
            )
          },
          message:
            "Name must use only English or Arabic letters and special characters(space, ',  -)",
        },
        {
          validator: function (v) {
            return (v && v.length) <= 50
          },
          message: "Name must not exceed 50 characters",
        },
      ],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Name must be specified."],
      validate: [
        {
          validator: function (v) {
            return /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF- ]*$|^[a-zA-Z]+[a-zA-Z-' ]*$/.test(
              v
            )
          },
          message:
            "Name must use only English or Arabic letters and special characters(space, ',  -)",
        },
        {
          validator: function (v) {
            return (v && v.length) <= 50
          },
          message: "Name must not exceed 50 characters",
        },
      ],
    },
    birthDate: {
      type: Date,
      min: "1950-01-01",
    },
    background: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    enrolledCourses: {
      type: [mongoose.Schema.ObjectId],
      default: [],
      ref: "Course",
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required."],
      validate: [validator.isEmail, "Email is invalid."],
    },
    type: {
      type: String,
      required: [true, "Type is required."],
      enum: ["learner", "admin", "instructor"],
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      validate: [
        {
          // Instagram username regex https://regexr.com/3cg7r
          validator: function (v) {
            return /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim.test(v)
          },
          message: "Invalid username",
        },
      ],
      required: [true, "Username is required."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    passwordLastChangedAt: {
      type: Date,
      required: [true, "PasswordLastChangedAt date property must be specified"],
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpiresAt: {
      type: Date,
    },
    created_at: {
      type: Date,
      required: [true, "Created_at date property must be specified"],
    },
    active: {
      // The user's account is active --> not deleted
      type: Boolean,
      default: true,
    },
  },
  {
    strict: "throw",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

userSchema.statics.validatePassword = (password) => {
  if (!password) throw new AppError("Password must be specifed.", 400)
  if (typeof password !== "string") {
    throw new AppError("Password must be string.", 400)
  }
  if (password.length < 8 || password.length > 50) {
    throw new AppError("Password must be 8-50 characters.", 400)
  }
  return true
}
// Returns a select options object for private user
userSchema.statics.privateUser = () => {
  return {
    __v: 0,
  }
}

// Returns a select options object for public user
userSchema.statics.publicUser = () => {
  return {
    password: 0,
    passwordLastChangedAt: 0,
    passwordResetToken: 0,
    passwordResetExpiresAt: 0,
    created_at: 0,
    active: 0,
    __v: 0,
  }
}

// Returns an object contains the public user info.
userSchema.methods.toPublic = function () {
  const publicUser = this.toObject({
    virtuals: true,
  })
  const fieldsToExclude = userSchema.statics.publicUser()

  Object.keys(publicUser).forEach((el) => {
    if (fieldsToExclude[el] === 0) {
      delete publicUser[el]
    }
  })
  return publicUser
}

const User = mongoose.model("User", userSchema)
module.exports = User
