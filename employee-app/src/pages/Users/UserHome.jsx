import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  DesktopOutlined,
  PieChartOutlined,
  CommentOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { AiFillBell } from "react-icons/ai";
import { Avatar, Layout, Menu, Button, Row, Col, Badge, Image } from "antd";
import React, { useState } from "react";
import { WEB_SERVER_URL } from "../../config/serverURL";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "../../utils/localStorage";
import useAuth from "../../hooks/useAuth";
import Notification from "../../components/Notification/Notification";

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    label,
    key,
    icon,
    children,
  };
}

const UserHome = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useAuth((state) => state);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const LogOut = () => {
    removeUserFromLocalStorage();
    signOut();
    navigate("/", { replace: true });
  };

  const items = [
    getItem(
      <NavLink to="/employee/infors">Hồ sơ</NavLink>,
      "/employee/infors",
      <SolutionOutlined />
    ),
    getItem(
      <NavLink to="/employee">Bản tin</NavLink>,
      "/employee",
      <DesktopOutlined />
    ),
    getItem("Lịch làm", "EmployeeWorkschedules", <ScheduleOutlined />, [
      getItem(
        <NavLink to="/employee/workschedules">Lịch làm chung</NavLink>,
        "/employee/workschedules"
      ),
      getItem(
        <NavLink to="/employee/myworkschedules/">Lịch làm của tôi</NavLink>,
        "/employee/myworkschedules"
      ),
      getItem(
        <NavLink to="/employee/registerschedules">Đăng kí lịch làm</NavLink>,
        "/employee/registerschedules"
      ),
      getItem(
        <NavLink to="/employee/dayoffs">Đơn xin nghỉ</NavLink>,
        "/employee/dayoffs"
      ),
    ]),
    getItem(
      <NavLink to="/employee/statisticals">Thống kê</NavLink>,
      "/employee/statisticals",
      <PieChartOutlined />
    ),
    getItem(
      <NavLink to="/employee/chats">Chat</NavLink>,
      "/employee/chats",
      <CommentOutlined />
    ),
    getItem(
      <Row justify="center">
        <Button onClick={() => LogOut()}>Đăng xuất</Button>
      </Row>,
      "BtnLogout"
    ),
  ];
  const auth = getUserFromLocalStorage();
  const avatar = auth.avatarUrl;
  return (
    <div>
      <Header
        className="site-layout-background"
        style={{
          padding: 0,
          color: "#fff",
          backgroundColor: "#d6001c",
        }}
      >
        <Row>
          <Col flex={"50px"}>
            <Button
              type="primary"
              danger
              onClick={toggleCollapsed}
              style={{
                margin: 10,
                fontSize: 60,
                height: 40,
                width: 40,
              }}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            ></Button>
          </Col>
          <Col flex="auto">
            <Row justify="center" align="middle" style={{ height: "100%" }}>
              <Image
                preview={false}
                src="https://queen.jollibee.com.ph/2022/08/bmpzMYBj-jollibee-logo-2x.png"
                width={170}
                alt="logo jollibee"
              />
            </Row>
          </Col>
          <Col flex="60px">
            <Notification />
          </Col>
        </Row>
      </Header>
      <Layout style={{ position: "relative" }}>
        <Sider
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          collapsedWidth={0}
          style={{ position: "absolute", zIndex: 3, height: "100%" }}
        >
          <Avatar
            size={64}
            src={
              avatar
                ? `${WEB_SERVER_URL}${auth.avatarUrl}`
                : "https://joeschmoe.io/api/v1/random"
            }
            style={{ margin: "20px 0" }}
          />
          <Menu
            defaultSelectedKeys={[window.location.pathname]}
            defaultOpenKeys={
              [
                "/employee/registerschedules",
                "/employee/myworkschedules",
                "/employee/dayoffs",
              ].includes(window.location.pathname)
                ? ["EmployeeWorkschedules"]
                : []
            }
            mode="inline"
            theme="dark"
            items={items}
          />
        </Sider>
        <Content
          style={{
            position: "relative",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};
export default UserHome;
