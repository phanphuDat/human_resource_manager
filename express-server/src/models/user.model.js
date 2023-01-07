var mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please Provide a Username"],
      trim: true,
      minlength: 4,
    },
    avatarUrl: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "please provide a email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please Provide Password"],
      minlength: 6,
      trim: true,
    },
    bio: {
      type: String,
      default: "Hello There!",
      minlength: 2,
      maxlength: 250,
    },
  },
  {
    collection: "users",
  }
);
// Include virtuals
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

// validateBeforeSave
userSchema.set("validateBeforeSave", true);

const User = mongoose.model("User", userSchema);

module.exports = User;
