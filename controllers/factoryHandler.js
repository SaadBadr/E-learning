const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const DbQueryManager = require("../utils/dbQueryManager")

module.exports.createOneFactory = (model) =>
  catchAsync(async (req, res, next) => {
    let data = new model(req.body)
    data = await data.save()
    res.status(200).json({
      status: "success",
      data,
    })
  })
