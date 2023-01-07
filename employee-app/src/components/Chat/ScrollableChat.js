import { Avatar, Tooltip } from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/chat";
import { useAppContext } from "../../context/ChatProvider";
import { BiLike } from "react-icons/bi";

const ScrollableChat = ({ messages }) => {
  const { user } = useAppContext();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  useEffect(() => scrollToBottom(), [messages]);

  return (
    <div className="scrollMessages">
      <div className="space"></div>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={m.sender.fullname}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.fullname}
                  src={m.sender.avatarUrl}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.message !== "like status" ? (
                m.message
              ) : (
                <BiLike color="#0084ff" size="20" />
              )}
            </span>
          </div>
        ))}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ScrollableChat;
