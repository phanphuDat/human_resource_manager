import React, { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Table,
  Form,
  Input,
  Popconfirm,
  message,
  notification,
  Space,
  Modal,
  Upload,
  Row,
  Col,
  Radio,
  Select,
  DatePicker,
  InputNumber,
  Avatar,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { WEB_SERVER_URL } from "../../config/serverURL";
import { AVATAR_URL, BEARER_TOKEN } from "../../config/auth";
import TextArea from "antd/lib/input/TextArea";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { GiPositionMarker, GiSkills } from "react-icons/gi";
import { TbCertificate } from "react-icons/tb";
import { MdPassword } from "react-icons/md";
import {
  AiFillBell,
  AiFillDollarCircle,
  AiTwotoneEdit,
  AiTwotoneMail,
} from "react-icons/ai";

import {
  RiFileUserFill,
  RiLuggageDepositFill,
  RiBankFill,
} from "react-icons/ri";
import {
  FaBirthdayCake,
  FaHourglassStart,
  FaIdCard,
  FaTransgender,
  FaUserEdit,
  FaUserTie,
} from "react-icons/fa";
import { DownloadOutlined } from "@ant-design/icons";

moment().locale("vi");

export default function ManagerUser() {
  const [user, setUser] = useState({});

  const [file, setFile] = useState(null);
  const [visibleFormEdit, setVisibleFormEdit] = useState(false);
  const [visiblePasswordModal, setVisiblePasswordModal] = useState(false);

  const [formEdit] = Form.useForm();
  const [formPassword] = Form.useForm();

  // lấy API bộ phận, chức vụ 1 lần
  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    axios
      .get(`${WEB_SERVER_URL}/users/getUser`, BEARER_TOKEN)
      .then((response) => {
        setUser(response.data.results[0]);
      })
      .catch((error) => console.log(error));
  };

  const editUser = (record) => {
    if (record.birthday) record.birthday = moment(record.birthday);
    setVisibleFormEdit(true);
    Object.entries(record).forEach(([key, value]) =>
      formEdit.setFieldValue(key, value)
    );
  };

  const updateUser = (values) => {
    // console.log(values);
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );
    axios
      .patch(
        `${WEB_SERVER_URL}/users/employeeupdateuser`,
        formData,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          setVisibleFormEdit(false);
          message.success("Update thành công");
          getUser();
        } else message.error("Update thất bại");
      });
  };

  const changePassword = (values) => {
    console.log(values);
    axios
      .patch(`${WEB_SERVER_URL}/auth/changepassword`, values, BEARER_TOKEN)
      .then((response) => {
        if (response.status === 200) {
          setVisiblePasswordModal(false);
          message.success("Đổi mật khẩu thành công");
        } else message.error("Đổi mật khẩu thất bại");
      });
  };

  return (
    <Layout
      style={{
        // minHeight: "91vh",
        backgroundImage: "linear-gradient(to bottom right, #14aa8c, #1c95cb)",
      }}
    >
      <div
        style={{
          // backgroundColor: "revert-layer",
          margin: 10,
          borderRadius: 10,
          padding: 10,
          height: "100%",
        }}
      >
        <Row>
          <Col span={8}>
            <Avatar
              shape="circle"
              size={70}
              src={
                user.avatarUrl
                  ? `${WEB_SERVER_URL}${user.avatarUrl}`
                  : "https://joeschmoe.io/api/v1/random"
              }
              style={{
                padding: 3,
                backgroundColor: "#fff",
                border: "2px solid #000",
              }}
            />
          </Col>
          <Col span={16}>
            <Row style={{ marginTop: 10 }}>
              <b style={{ margin: 0, lineHeight: "30px", fontSize: 18 }}>
                {user.fullname}
              </b>
            </Row>
            <Row>
              <b>{user.phone}</b>
            </Row>
          </Col>
        </Row>
      </div>
      <Content
        style={{
          backgroundColor: "#fff",
          margin: "0 10px",
          borderRadius: 10,
          padding: 10,
          height: "100%",
        }}
      >
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#fb2410",
                borderRadius: 5,
              }}
              shape="square"
              icon={<FaUserTie size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div
              style={{
                textAlign: "start",
                height: "100%",
                paddingTop: 3,
              }}
            >
              <b>{user.position}</b>
            </div>
          </Col>
        </Row>
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#fb4f05",
                borderRadius: 5,
              }}
              shape="square"
              icon={<RiFileUserFill size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div style={{ textAlign: "start", height: "100%", paddingTop: 3 }}>
              <b>{user.department}</b>
            </div>
          </Col>
        </Row>
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#f99300",
                borderRadius: 5,
              }}
              shape="square"
              icon={<AiFillDollarCircle size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div style={{ textAlign: "start", height: "100%", paddingTop: 3 }}>
              <b>{user.salary}/h</b>
            </div>
          </Col>
        </Row>
      </Content>
      <Content
        style={{
          backgroundColor: "#fff",
          margin: 10,
          borderRadius: 10,
          padding: 10,
          height: "100%",
        }}
      >
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#f6b600",
                borderRadius: 5,
              }}
              shape="square"
              icon={<FaTransgender size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div style={{ textAlign: "start", height: "100%", paddingTop: 3 }}>
              <b>{user.gender}</b>
            </div>
          </Col>
        </Row>
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#fcfb2d",
                borderRadius: 5,
              }}
              shape="square"
              icon={<FaBirthdayCake size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div style={{ textAlign: "start", height: "100%", paddingTop: 3 }}>
              <b>{moment(user.birthday).format("DD/MM/yyyy")}</b>
            </div>
          </Col>
        </Row>
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#cbe426",
                borderRadius: 5,
              }}
              shape="square"
              icon={<AiTwotoneMail size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div style={{ textAlign: "start", height: "100%", paddingTop: 3 }}>
              <b>{user.email}</b>
            </div>
          </Col>
        </Row>
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#62aa2d",
                borderRadius: 5,
              }}
              shape="square"
              icon={<GiPositionMarker size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div style={{ textAlign: "start", height: "100%", paddingTop: 3 }}>
              <b>{user.address}</b>
            </div>
          </Col>
        </Row>
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#028cca",
                borderRadius: 5,
              }}
              shape="square"
              icon={<FaIdCard size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div style={{ textAlign: "start", height: "100%", paddingTop: 3 }}>
              <b>{user.CCCD}</b>
            </div>
          </Col>
        </Row>
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#0244fc",
                borderRadius: 5,
              }}
              shape="square"
              icon={<RiBankFill size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div style={{ textAlign: "start", height: "100%", paddingTop: 3 }}>
              <b>{user.bank}</b>
            </div>
          </Col>
        </Row>
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#3d009e",
                borderRadius: 5,
              }}
              shape="square"
              icon={<TbCertificate size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div style={{ textAlign: "start", height: "100%", paddingTop: 3 }}>
              <b>{user.degree}</b>
            </div>
          </Col>
        </Row>
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#8400ab",
                borderRadius: 5,
              }}
              shape="square"
              icon={<GiSkills size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div style={{ textAlign: "start", height: "100%", paddingTop: 3 }}>
              <b>{user.skill}</b>
            </div>
          </Col>
        </Row>
        <Row
          wrap={false}
          style={{ backgroundColor: "#fff", fontSize: 15, marginBottom: 5 }}
        >
          <Col span={4}>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: "#a31746",
                borderRadius: 5,
              }}
              shape="square"
              icon={<FaHourglassStart size={22} style={{ margin: 5 }} />}
            />
          </Col>
          <Col span={20}>
            <div style={{ textAlign: "start", height: "100%", paddingTop: 3 }}>
              <b>{moment(user.dateStart).format("DD/MM/yyyy")}</b>
            </div>
          </Col>
        </Row>
      </Content>
      <Footer style={{ padding: 10 }}>
        <Row wrap={false}>
          <Col span={12}>
            <Button
              type="primary"
              shape="round"
              // icon={<MdPassword />}
              onClick={() => setVisiblePasswordModal(true)}
            >
              Đổi mật khẩu
            </Button>
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              shape="round"
              // icon={<FaUserEdit />}
              onClick={() => editUser(user)}
            >
              <span style={{ marginLeft: 5 }}>Cập nhật</span>
            </Button>
          </Col>
        </Row>
      </Footer>

      {/* Modal update user */}
      <Modal
        title="Cập nhật thông tin"
        open={visibleFormEdit}
        onOk={() => {
          formEdit.submit();
        }}
        onCancel={() => {
          setVisibleFormEdit(false);
        }}
      >
        <Form
          form={formEdit}
          name="edit"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={user || ""}
          onFinish={(values) => updateUser(values)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
          autoComplete="off"
        >
          <Form.Item label="Giới tính" name="gender">
            <Radio.Group>
              <Radio value="Nam"> Nam </Radio>
              <Radio value="Nữ"> Nữ </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Phone" name={"phone"} hasFeedback>
            <Input placeholder="Enter your phone number" />
          </Form.Item>
          <Form.Item label="Địa chỉ" name={"address"} hasFeedback>
            <Input placeholder="Enter your address" />
          </Form.Item>
          <Form.Item label="Ngày sinh" name={"birthday"}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="CMND/CCCD" name={"CCCD"} hasFeedback>
            <Input placeholder="Enter your CCCD" />
          </Form.Item>
          <Form.Item label="Bằng cấp" name={"degree"} hasFeedback>
            <Input />
          </Form.Item>
          <Form.Item label="Kĩ năng" name={"skill"} hasFeedback>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Số tài khoản" name={"bank"} hasFeedback>
            <Input />
          </Form.Item>
          <Form.Item label="Upload avatar" valuePropName="fileList">
            <Upload
              listType="picture-card"
              accept=".png,.jpg"
              maxCount={1}
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal update user */}
      <Modal
        title="Đổi mật khẩu"
        open={visiblePasswordModal}
        onOk={() => {
          formPassword.submit();
        }}
        onCancel={() => {
          setVisiblePasswordModal(false);
        }}
      >
        <Form
          form={formPassword}
          name="changepassword"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{}}
          onFinish={(values) => changePassword(values)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
          autoComplete="off"
        >
          <Form.Item
            name="password"
            label="Mật khẩu cũ"
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmNewPW"
            label="Nhập lại mật khẩu mới"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu mới chưa khớp"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}
