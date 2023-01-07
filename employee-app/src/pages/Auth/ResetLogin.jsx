import {
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Avatar,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { chakra } from "@chakra-ui/react";
import { Box, VStack, FormControl } from "@chakra-ui/react";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);

export default function ResetLogin() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    loading: false,
  });

  const submitHandler = async () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    setValues({ ...values, loading: true });
    const { email } = values;
    if (!email) {
      toast.error("Please Fill the Fields");
      setValues({ ...values, loading: false });
      return;
    } else if (!regex.test(email)) {
      toast.error("Invalid email format");
      setValues({ ...values, loading: false });
      return;
    }

    try {
      const { data } = await api.post("/auth/requestPassReset", { email });
      if (data) {
        toast.success("Link reset in Email");
      }
      // addUserToLocalStorage(data);
      setValues({ ...values, loading: false });
      navigate("/", { replace: true });
    } catch (error) {
      setValues({ ...values, loading: false });
    }
  };

  return (
    <Box
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(to-t, blue.200 , yellow.50 , pink.200)"
      fontFamily="inherit"
      flexDirection="column"
    >
      <VStack
        minW="350px"
        p="10px"
        border="1px solid #ccc"
        boxShadow="dark-lg"
        rounded="md"
        bg="ccffff"
      >
        <Avatar bg="blue.500" />
        <Box minW={{ base: "90%", md: "468px" }}>
          <Text
            fontSize="40px"
            fontFamily="Poppins"
            textAlign="center"
            fontWeight={700}
            mb="8px"
            css={{
              background:
                "linear-gradient(110.29deg, #2E5CFF 11.11%, #973DF0 60.96%)",
              textFillColor: "text",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              " -webkit-text-fill-color": "transparent",
            }}
          >
            Verification User
          </Text>
          <FormControl id="email" isRequired mb="10px">
            <FormLabel style={{ color: "gray" }}>Your Email</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<CFaUserAlt color="gray.300" />}
              />
              <Input
                value={values.email}
                type="email"
                placeholder="email address"
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
              />
            </InputGroup>
            <FormHelperText textAlign="right" mt="20px">
              <Link to="/">Login</Link>
            </FormHelperText>
          </FormControl>

          <Button
            background="rgba(67, 43, 255, 0.8)"
            width="100%"
            color="white"
            _hover={{
              background: " rgba(67, 43, 255, 0.8)",
              color: "white",
              transform: "translate(0,-5px)",
            }}
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={values.loading}
          >
            Reset
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
