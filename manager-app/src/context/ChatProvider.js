import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromLocalStorage } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [loggedUser, setLoggedUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();


  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = getUserFromLocalStorage();

    setUser(loggedInUser)

    if (!loggedInUser) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        loggedUser, 
        setLoggedUser
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(ChatContext);
};

export { ChatProvider, useAppContext };
