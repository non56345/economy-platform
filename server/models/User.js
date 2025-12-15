const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // يسمح بوجود null للطلبة
    },

    password: {
      type: String,
    },

    studentNumber: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      unique: true,
      sparse: true,
    },

    major: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
