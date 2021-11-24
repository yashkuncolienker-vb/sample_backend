const mongoose = require("mongoose");

// creating rewards schema
const rewardsSchema = mongoose.Schema(
  {
    reward_name: {
      type: String,
      required: true,
    },
    reward_display_name: {
      type: String,
      required: true,
    },
    reward_type: {
      type: String,
      required: true,
    },
    reward_sender: {
      type: String,
      enum: ["Leadership", "Manager"],
      required: true,
    },
    recepients: {
      type: [String],
      enum: ["Manager", "Employee", "Selected"],
      required: true,
    },
    receiver_message: {
      type: String,
      required: true,
    },
    announcement_type: {
      type: String,
      required: true,
    },
    slack_channel: {
      type: String,
      required: false,
    },
    channel_message: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Draft", "Stop", "Launch"],
      default: "Draft",
    },
    employee_id: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// creating rewards collection with rewardsSchema
const rewardsModal = mongoose.model("rewards", rewardsSchema);

// exporting collections
module.exports = rewardsModal;
