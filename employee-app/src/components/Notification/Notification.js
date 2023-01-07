import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { useAppContext } from "../../context/ChatProvider";
import { getSender } from "../../config/chat";
import { useNavigate } from "react-router-dom";

function Notification() {
  const { notification, setNotification, setSelectedChat, user } =
    useAppContext();

  const navigate = useNavigate();

  return (
    <>
      <Menu>
        <MenuButton>
          <div style={{ position: "relative" }}>
            <BellIcon fontSize="2xl" />
          </div>
          {notification.length > 0 ? (
            <div
              style={{
                height: "4px",
                position: "absolute",
                top: "2px",
                right: "27px",
              }}
            >
              <span style={{ color: "black", fontWeight: 600 }}>
                {notification.length}
              </span>
            </div>
          ) : null}
        </MenuButton>
        <MenuList color="#000" pl={1}>
          {!notification?.length && "No New Message"}
          {notification?.map((noti) => (
            <MenuItem
              key={noti.id}
              onClick={() => {
                setSelectedChat(noti.chat);
                navigate("/employee/chats", { replace: true });
                setNotification(
                  notification.filter((n) => n.chat._id !== noti.chat._id)
                );
              }}
            >
              {noti?.chat?.isGroupChat
                ? `New Message in ${noti?.chat?.chatName} `
                : ` New Message from ${getSender(user, noti?.chat?.users)}`}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
}

export default Notification;
