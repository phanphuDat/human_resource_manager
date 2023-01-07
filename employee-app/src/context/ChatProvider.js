import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromLocalStorage, getTodoFromLocalStorage } from "../utils/localStorage";


const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [loggedUser, setLoggedUser] = useState();
  const [notification, setNotification] = useState(getTodoFromLocalStorage);
  const [chats, setChats] = useState();

  useEffect(() => {
    window.localStorage.setItem("notification", JSON.stringify(notification));
  }, [notification]);

  useEffect(() => {
    const loggedInUser = getUserFromLocalStorage();

    console.log('logged in user')
    setUser(loggedInUser)
  }, []);

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
