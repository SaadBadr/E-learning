const catchAsync = require("./../utils/catchAsync")
const DbQueryManager = require("./../utils/dbQueryManager")
const AppError = require("../utils/appError")

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ _id: req.params.id })
    if (!doc) {
      return next(new AppError("No document found with that ID", 404))
    }
    await doc.deleteOne()

    res.status(204).json({
      status: "success",
      data: null,
    })
  })

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!doc) {
      return next(new AppError("No document found with that ID", 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    })
  })

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    })
  })

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (popOptions || req.popOptions)
      query = query.populate(popOptions || req.popOptions)
    const doc = await query

    if (req.customManipulation) req.customManipulation(doc)

    if (!doc) {
      return next(new AppError("No document found with that ID", 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    })
  })

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new DbQueryManager(Model.find())
    const doc = await features.all(req.query)
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    })
  })
