import React, { useState } from "react";
import { useAppContext } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import MyChat from "../../components/Chat/MyChat";
import ChatBox from "../../components/Chat/ChatBox";

export default function Chats({socket}) {
  const { user } = useAppContext();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }} className="chat">
      {/* {user && <SideDrawer />} */}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} socket={socket}/>
        )}
      </Box>
    </div>
  );
}
