const mongoose = require("mongoose");
const Activity = require("./activityModel");

const pdfActivitySchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "URL must be specified."],
    trim: true,
  },
});

// pdfActivity is a discriminator of Activity, i.e. pdfActivity inherits Activity schema
const pdfActivity = Activity.discriminator("PdfActivity", pdfActivitySchema);
module.exports = pdfActivity;
