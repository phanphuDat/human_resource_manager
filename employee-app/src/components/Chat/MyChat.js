import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import { Box, IconButton, Input, Spinner, Stack, Text, Tooltip } from "@chakra-ui/react";
import api from "../../utils/axios";
import { Button } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";
import { toast } from "react-toastify";
import { getUserFromLocalStorage } from "../../utils/localStorage";
import { getSender } from "../../config/chat";
import { useDisclosure } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import UserListItem from "./UserListItem";
import { FiSearch } from "react-icons/fi";
import { ArrowBackIcon } from "@chakra-ui/icons";

const MyChats = ({ fetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    selectedChat,
    loggedUser,
    setLoggedUser,
    setSelectedChat,
    chats,
    setChats,
  } = useAppContext();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please Provide username");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.get(`/auth/users?fullname=${search}`);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error(error);
    }
  };

  // find success user and access chat
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await api.post(`/chat`, { userId });

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chat");

      setChats(data);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    setLoggedUser(getUserFromLocalStorage());
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Poppins"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <FiSearch />
            {/* <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text> */}
          </Button>
        </Tooltip>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            {/* search - text */}
            
            <Text
              height="max-content"
              fontSize="20px"
              fontFamily="Poppins"
              alignSelf="center"
              margin="20px"
              display="flex"
              alignItems="center"
              width="100%"
              justifyContent="center"
            >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={onClose}
              marginRight="10px"
            />
              Search Users
            </Text>
            <DrawerBody>
              {/* Search Input - handle search Button */}
              <Box display="flex" pb={2}>
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>

              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml="auto" d="flex" />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <GroupChatModal>
          <Button
            display="flex"
            fontFamily="Poppins"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats?.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={
                  selectedChat === chat ? "rgba(67, 43, 255, 0.8)" : "#E8E8E8"
                }
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat?._id}
              >
                <Text>
                  {!chat?.isGroupChat
                    ? getSender(loggedUser, chat?.users)
                    : chat?.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
