const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
	{
    title: {
			type: String,
			trim: true,
      maxlength: 100,
			required: [true, "Title must be specified."]
		},
    description: {
			type: String,
      required: [true, "Description must be specified."],
			trim: true
		},
    url: {
			type: String,
      required: [true, "URL must be specified."],
			trim: true
		},
    created_at: {
			type: Date,
			required: [true, "Created_at date property must be specified"],
		},
		active: {
			// The activity is active --> not deleted
			type: Boolean,
			default: true,
		},
	},
	{
		strict: "throw",
	}
);

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
