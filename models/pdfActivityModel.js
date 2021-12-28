const mongoose = require("mongoose")
const Activity = require("./activityModel")
const fs = require("fs")
const { promisify } = require("util")

const pdfActivitySchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "URL must be specified."],
    trim: true,
  },
})

pdfActivitySchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    await promisify(fs.unlink)(`${process.env.PUBLIC_FOLDER}/${this.url}`)
  } catch (error) {
    next(error)
  }
})

pdfActivitySchema.pre("deleteMany", async function (next) {
  try {
    let deletedData = await pdfActivity.find(this._conditions).lean()
    if (deletedData) {
      promises = []
      deletedData.forEach((doc) =>
        promises.push(
          promisify(fs.unlink)(`${process.env.PUBLIC_FOLDER}/${doc.url}`)
        )
      )
      Promise.all(promises)
    }
    return next() // normal save
  } catch (error) {
    return next(error)
  }
})

// pdfActivity is a discriminator of Activity, i.e. pdfActivity inherits Activity schema
const pdfActivity = Activity.discriminator("PdfActivity", pdfActivitySchema)
module.exports = pdfActivity
