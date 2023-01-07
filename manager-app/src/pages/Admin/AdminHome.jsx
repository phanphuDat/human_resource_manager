import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  CommentOutlined,
  ScheduleOutlined,
  EllipsisOutlined,
  HomeOutlined,
  SolutionOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { AiFillBell, AiOutlineQrcode } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import { Avatar, Col, Layout, Menu, Row, Badge, Button } from "antd";
import React, { useEffect, useState } from "react";
import { WEB_SERVER_URL } from "../../config/serverURL";
import { AVATAR_URL } from "../../config/auth";
const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    label,
    key,
    icon,
    children,
  };
}
const AdminHome = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const LogOut = () => {
    navigate("/", { replace: true });
  };

  const items = [
    getItem(
      <Link to="/manager/infors">Hồ sơ</Link>,
      "/manager/infors",
      <SolutionOutlined />
    ),
    getItem(
      <Link to="/manager">Bản tin</Link>,
      "/manager",
      <DesktopOutlined />
    ),
    getItem("Quản lý lịch làm", "managerschedules", <ScheduleOutlined />, [
      getItem(
        <Link to="/manager/managerworks/inout">Quản lý In/Out</Link>,
        "/manager/managerworks/inout"
      ),
      getItem(
        <Link to="/manager/managerworks/workschedules">Lịch làm chung</Link>,
        "/manager/managerworks/workschedules"
      ),
      getItem(
        <Link to="/manager/managerworks/createschedules">Tạo lịch làm</Link>,
        "/manager/managerworks/createschedules"
      ),
      getItem(
        <Link to="/manager/managerworks/dayoff">Đơn xin nghỉ</Link>,
        "/manager/managerworks/dayoff"
      ),
    ]),
    getItem("Quản lý cửa hàng", "managerstore", <HomeOutlined />, [
      getItem(
        <Link to="/manager/managerusers">Quản lý nhân viên</Link>,
        "/manager/managerusers",
        <TeamOutlined />
      ),
      getItem(
        <Link to="/manager/managerworks/bonuspunish">Thưởng/Phạt</Link>,
        "/manager/managerworks/bonuspunish"
      ),
      getItem(
        <Link to="/manager/store/departments">Bộ phận</Link>,
        "/manager/store/departments"
      ),
      getItem(
        <Link to="/manager/store/positions">Chức vụ</Link>,
        "/manager/store/positions"
      ),
    ]),
    getItem("Thống kê", "managerstatisticals", <PieChartOutlined />, [
      getItem(
        <Link to="/manager/statisticals/salarys">Tiền Lương</Link>,
        "/manager/statisticals/salarys"
      ),
      getItem(
        <Link to="/manager/statisticals/timekeeping">Thống kê chi tiết</Link>,
        "/manager/statisticals/timekeeping"
      ),
    ]),
    getItem(
      <Link to="/manager/chats">Chat</Link>,
      "/manager/chats",
      <CommentOutlined />
      ),
      getItem(
        <Link to="qrCode">QrCode</Link>,
        "manager/qrCode", 
        <AiOutlineQrcode />
      ),
    getItem(
      <Button onClick={() => LogOut()}>Đăng xuất</Button>,
      "BtnLogout",
      <VscSignOut />
    )
  ];

  return (
    <Layout
      style={{
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Sider
        className="webkit-scroll-bar"
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        style={{
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Avatar
          size={collapsed ? 64 : 96}
          src={
            AVATAR_URL
              ? `${WEB_SERVER_URL}${AVATAR_URL}`
              : "https://joeschmoe.io/api/v1/random"
          }
          style={{ margin: "20px 0" }}
        />

        <Menu
          theme="dark"
          defaultSelectedKeys={[window.location.pathname]}
          defaultOpenKeys={
            [
              "/manager/managerworks/inout",
              "/manager/managerworks/workschedules",
              "/manager/managerworks/createschedules",
            ].includes(window.location.pathname)
              ? ["managerschedules"]
              : [
                  "/manager/managerusers",
                  "/manager/managerworks/bonuspunish",
                  "/manager/store/departments",
                  "/manager/store/positions",
                ].includes(window.location.pathname)
              ? ["managerstore"]
              : [
                  "/manager/statisticals/timekeeping",
                  "/manager/statisticals/salarys",
                ].includes(window.location.pathname)
              ? ["managerstatisticals"]
              : []
          }
          mode="inline"
          items={items}
          style={{ paddingBottom: 50 }}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          <Row
            style={{ color: "#fff", backgroundColor: "#d6001c" }}
            align="middle"
          >
            <Col flex="auto">
              <Row justify="center">
                <img
                  style={{ height: 50 }}
                  src="https://queen.jollibee.com.ph/2022/08/bmpzMYBj-jollibee-logo-2x.png"
                  alt="logo jollibee"
                ></img>
              </Row>
            </Col>
            <Col flex="100px">
              <Badge count={1} size="small">
                <Avatar
                  style={{
                    color: "#fff",
                    backgroundColor: "#d6001c",
                    fontSize: 37,
                  }}
                  size={35}
                  shape="square"
                  icon={
                    <AiFillBell
                    // style={{ fontSize: 40 }}
                    />
                  }
                />
              </Badge>
            </Col>
          </Row>
        </Header>
        <Content>
          <div className="site-layout-background">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default AdminHome;
