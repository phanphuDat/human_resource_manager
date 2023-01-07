import React from "react";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "antd/dist/antd.min.css";
import { ConfigProvider } from "antd";
import { ChatProvider } from "./context/ChatProvider";
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <ConfigProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </ConfigProvider>
      </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>
);
