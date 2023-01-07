import {
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Avatar,
  FormHelperText,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Box, VStack, FormControl } from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";

const CFaLock = chakra(FaLock);

export default function Login1() {
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({
    password: "",
    confirmPass: "",
    loading: false,
  });
  const [isValid, setIsValid] = useState("");
  const { token, id } = queryString.parse(location.search);

  const verifiToken = async () => {
    try {
      const { data } = await api.get(
        `/auth/verifi-token?token=${token}&id=${id}`
      );
      console.log(data);
    } catch (error) {
      if (error?.response?.data) {
        console.log(error.response.data.message);
        if (error.response.data.message === "Invalid token") setIsValid("load");
      }
    }
  };

  useEffect(() => {
    verifiToken();
  }, []);

  if (isValid === "load") {
    return (
      <Box
        display="flex"
        height="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <h1>You Cannot Reset password</h1>
      </Box>
    );
  }

  const submitHandler = async () => {
    setValues({ ...values, loading: false });
    const { password, confirmPass } = values;

    if (!password || !confirmPass) {
      toast.error("Please Fill All the Fields");
      setValues({ ...values, loading: false });
      return;
    } else if (password.length < 6 || confirmPass.length < 6) {
      toast.error("Password must be more than 6 characters");
      setValues({ ...values, loading: false });
      return;
    } else if (password !== confirmPass) {
      toast.error("password mismatch");
      setValues({ ...values, loading: false });
      return;
    }
    try {
      const { data } = await api.post(
        `/auth/passwordReset?token=${token}&id=${id}`,
        { password }
      );
      console.log(data);
      toast.success("Your password has been changed successfully");
      setValues({ ...values, loading: false });
      // navigate("/", { replace: true });
    } catch (error) {
      toast.error("You Cannot Reset Password");
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
            fontSize="50px"
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
            RESET PASSWORD
          </Text>
          <FormControl id="password" isRequired mb="10px">
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
                type="password"
                placeholder="New Password"
              />
            </InputGroup>
          </FormControl>
          <FormControl id="confirmPass" isRequired>
            <InputGroup size="md">
              <InputLeftElement
                pointerEvents="none"
                children={<CFaLock color="gray.300" />}
              />
              <Input
                value={values.confirmPass}
                onChange={(e) =>
                  setValues({ ...values, confirmPass: e.target.value })
                }
                type="password"
                placeholder="Confirm Password"
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
            Reset Password
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
