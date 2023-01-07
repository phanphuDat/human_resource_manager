import {
  Text,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Button,
  FormHelperText,
  Avatar,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { chakra } from "@chakra-ui/react";
import { Box, VStack, FormControl } from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
} from "../../utils/localStorage";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export default function Login1() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
    loading: false,
  });

  const submitHandler = async () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    setValues({ ...values, loading: true });
    const { email, password } = values;
    if (!email || !password) {
      toast.error("Please Fill All the Fields");
      setValues({ ...values, loading: false });
      return;
    } else if (password.length < 6) {
      toast.error("Password must be more than 6 characters");
      setValues({ ...values, loading: false });
      return;
    } else if (!regex.test(email)) {
      toast.error("Invalid email format");
      setValues({ ...values, loading: false });
      return;
    }

    try {
      const { data } = await api.post("/auth/employee", { email, password });
      addUserToLocalStorage(data);
      setValues({ ...values, loading: false });
      navigate("/employee", { replace: true });
    } catch (error) {
      toast.error("Invalid email or password");
      setValues({ ...values, loading: false });
    }
  };

  // useEffect(() => {
  //   const userLoged = getUserFromLocalStorage();
  //   if(userLoged) {
  //     navigate("/employee", { replace: true });
  //   }
  // }, [])

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
            fontSize="60px"
            fontFamily="Poppins"
            textAlign="center"
            fontWeight={700}
            css={{
              background:
                "linear-gradient(110.29deg, #2E5CFF 11.11%, #973DF0 60.96%)",
              textFillColor: "text",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              " -webkit-text-fill-color": "transparent",
            }}
          >
            JOLLIBEE
          </Text>
          <FormControl id="email" isRequired mb="10px">
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

              <FormErrorMessage>test</FormErrorMessage>
            </InputGroup>
          </FormControl>
          <FormControl id="password" isRequired>
            <InputGroup size="md">
              <InputLeftElement
                pointerEvents="none"
                children={<CFaLock color="gray.300" />}
              />
              <Input
                value={values.password}
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
                type={show ? "text" : "password"}
                placeholder="Password"
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  bgColor="gray.300"
                  onClick={handleClick}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormHelperText textAlign="right">
              <Link to="/resetPass">forgot password?</Link>
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
            Login
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
