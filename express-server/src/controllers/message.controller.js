var Message = require("../models/message.model");
var Chat = require("../models/chat.model");
var User = require("../models/user.model");

const sendMessage = async (req, res, next) => {
  const { message, chatId } = req.body;

  if (message) {
    let newMessage = {
      sender: req.uid,
      message: message,
      chat: chatId,
    };
    let m = await Message.create(newMessage);
    m = await m.populate("sender", "fullname avatarUrl");
    m = await m.populate("chat");
    m = await User.populate(m, {
      path: "chat.users",
      select: "fullname avatarUrl email _id",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: m }, { new: true });

    res.status(200).json(m);
  } else {
    let newMessage = {
      sender: req.uid,
      message: "like status",
      chat: chatId,
    };

    let m = await Message.create(newMessage);
    m = await m.populate("sender", "fullname avatarUrl");
    m = await m.populate("chat");
    m = await User.populate(m, {
      path: "chat.users",
      select: "fullname avatarUrl email _id",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: m }, { new: true });
    res.status(200).json(m);
  }
};


const allMessages = async (req, res, next) => {
  const { chatId } = req.params;

  const getMessages = await Message.find({ chat: chatId })
    .populate("sender", "fullname email _id")
    .populate("chat");

  res.status(200).json(getMessages);
};

module.exports = {
  allMessages,
  sendMessage,
};
