import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSender, getSenderFull } from "../../config/chat";
import { useAppContext } from "../../context/ChatProvider";
import api from "../../utils/axios";
import ProfileModal from "./ProfileModal";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import { GrSend } from "react-icons/gr";
import { BiLike } from "react-icons/bi";
import { FaImages } from "react-icons/fa";

let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain, socket }) => {
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  //lấy tất cả tin nhắn. rồi setMessage
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const { data } = await api.get(`/message/${selectedChat._id}`);

      setMessages(data);
      setLoading(false);
      socket.emit("join-chat", selectedChat._id);
    } catch (error) {
      toast.error(error);
    }
  };

  const sendMessage = async (e) => {
    if (newMessage) {
      try {
        socket.emit("stop-typing", selectedChat._id);
        const { data } = await api.post(`/message/`, {
          message: newMessage,
          chatId: selectedChat._id,
        });
        setNewMessage("");
        socket.emit("new-message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error(error);
      }
    } else {
      try {
        socket.emit("stop-typing", selectedChat._id);
        const { data } = await api.post(`/message/`, {
          chatId: selectedChat._id,
        });
        socket.emit("new-message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error(error);
      }
    }
    // if ((e.key === "Enter" && newMessage)) {
    //   socket.emit("stop-typing", selectedChat._id);
  };

  // Socket
  useEffect(() => {
    socket.emit("setup", user);

    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
  }, []);

  // first Loading message
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // new message receive and setMessages
  useEffect(() => {
    socket.on("message-received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const imageUpload = () => {};

  return (
    <>
      {selectedChat ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "5px",
              width: "100%",
              fontSize: "20px",
            }}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </div>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="message">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              // onKeyDown={sendMessage}
              h="15%"
              isRequired
              mt={3}
            >
              {isTyping ? <div>Typing ...</div> : <></>}
              <div style={{ display: "flex" }}>
                <IconButton
                  isRound={true}
                  icon={<FaImages />}
                  onClick={imageUpload}
                />
                <Input
                  style={{ borderRadius: "50px", margin: "0 5px" }}
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
                <IconButton isRound={true} onClick={sendMessage}>
                  {!newMessage ? <BiLike color="#0084ff" /> : <GrSend />}
                </IconButton>
              </div>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Poppins">
            Click On Users to Start Conversation
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
