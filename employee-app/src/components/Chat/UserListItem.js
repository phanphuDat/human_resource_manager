import React from "react";
import { Avatar } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";

function UserListItem({ user, handleFunction }) {
  return (
    <>
      <Box
        cursor="pointer"
        bg={{
          background: " rgba(67, 43, 255, 0.8)",
          color: "white",
        }}
        w="100%"
        display="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
        onClick={handleFunction}
      >
      
        <Avatar
          mr="2"
          size="sm"
          cursor="pointer"
          name={user.fullname}
          src={user.avatarUrl}
        />
        <Text>{user.fullname}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </>
  );
}

export default UserListItem;
