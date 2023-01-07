var mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    
    message: {
      type: String,
      trim: true,
    },
    msgStatus: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  },
  { collection: "messages" }
);

// Include virtuals
messageSchema.set("toObject", { virtuals: true });
messageSchema.set("toJSON", { virtuals: true });

// validateBeforeSave
messageSchema.set("validateBeforeSave", true);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
