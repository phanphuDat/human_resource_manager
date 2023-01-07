var mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
  { collection: "chat" }
);

// Include virtuals
chatSchema.set("toObject", { virtuals: true });
chatSchema.set("toJSON", { virtuals: true });

// validateBeforeSave
chatSchema.set("validateBeforeSave", true);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
