import React, { useState } from "react";
import {
  Button,
  Input,
  Box,
  Text,
  Avatar,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

import { toast } from "react-toastify";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { useAppContext } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { removeUserFromLocalStorage } from "../../utils/localStorage";
import { getSender } from "../../config/chat";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = useAppContext();

  // @Handl     Logout - handler
  // @Desc      out chat
  const logoutHandler = () => {
    removeUserFromLocalStorage("user");
    navigate("/");
  };

  // @Handl     Search - users
  // @Desc      Search - users
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

  const avatar = user.avatarUrl;
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        {/* CHATIFY */}
        {/* <Text
          fontSize="2xl"
          fontFamily="Poppins"
          css={{
            background:
              "linear-gradient(110.29deg, #2E5CFF 11.11%, #973DF0 60.96%)",
            textFillColor: "text",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            " -webkit-text-fill-color": "transparent",
            fontWeight: 700,
          }}
        >
          Chatify
        </Text> */}
        <div>
          <Menu>
            <MenuButton p={1}>
              {notification?.length > 0 ? (
                <>{toast.info(`New Message`)}</>
              ) : null}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification?.length && "No New Message"}
              {notification?.map((noti) => (
                <MenuItem
                  key={noti._id}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    setNotification(notification.filter((n) => n !== noti));
                  }}
                >
                  {noti?.chat?.isGroupChat
                    ? `New Message in ${noti?.chat?.chatName} `
                    : ` New Message from ${getSender(user, noti?.chat?.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.fullname}
                src={
                  avatar
                    ? `${process.env.REACT_APP_BASE_URL}${avatar}`
                    : "https://joeschmoe.io/api/v1/random"
                }
              />
            </MenuButton>
            <MenuList>
              <MenuItem>My Profile</MenuItem>
              <ProfileModal user={user} />
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

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
          >
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
    </>
  );
};

export default SideDrawer;
