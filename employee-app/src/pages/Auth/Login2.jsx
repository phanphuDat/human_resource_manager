import { Button, Checkbox, Form, Input, Col, Row, Avatar, message } from "antd";
import React, { useState } from "react";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Layout, { Content } from "antd/lib/layout/layout";
import axios from "axios";
import { WEB_SERVER_URL } from "../../config/serverURL";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth((state) => state);

  const onFinish = (values) => {
    const data = { ...values };
    axios
      .post(`${WEB_SERVER_URL}/auth/employee`, data)
      .then((response) => {
        localStorage.setItem("authToken", JSON.stringify(response.data));
        // Zustand: method
        signIn({ payload: response.data.payload, token: response.data.token });
        message.success("Login success");
        navigate("/employee", { replace: true });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          message.error("Đăng nhập không thành công!");
        }
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Col span={24}>
      <div style={{height: 150}}></div>
      <Row align="middle" justify="center">
        <Col>
          <Avatar shape="square" size={64} src="images/logos.png" />
        </Col>
        <Col>
          <h1>HELLO !!!</h1>
        </Col>
      </Row>
      <Row align="middle" justify="center">
        <Form
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            validate="true"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              { whitespace: true },
              { min: 10 },
              { type: "email", message: "Email must be a valid email" },
            ]}
            hasFeedback
          >
            <Input
              placeholder="Please enter a email"
              prefix={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            validate="true"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              { min: 6 },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Please enter a password"
              prefix={<LockOutlined />}
            ></Input.Password>
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              span: 24,
            }}
          >
            <Checkbox>Remember me</Checkbox>
            <a href="#" style={{ float: "right" }}>
              Forgot a password
            </a>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 24,
            }}
          >
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </Col>
  );
};

export default Login;
