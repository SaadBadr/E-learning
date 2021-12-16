const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const DbQueryManager = require("../utils/dbQueryManager")

module.exports.createOneFactory = (model) =>
  catchAsync(async (req, res, next) => {
    let doc = new model(req.body)
    doc = await doc.save()

    const data = {}
    let fieldName = model.modelName.split(/(?=[A-Z])/)
    fieldName = fieldName[fieldName.length - 1].toLowerCase()
    data[fieldName] = doc

    res.status(200).json({
      status: "success",
      data,
    })
  })
