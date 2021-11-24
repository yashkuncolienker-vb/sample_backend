const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    deleted_at: { type: Date, required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
UserSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "first_name",
      "last_name",
      "email",
      "role",
      "token",
      "created_at",
      "updated_at",
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
});
const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;
