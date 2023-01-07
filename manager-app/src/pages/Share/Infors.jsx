import React, { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Table,
  Form,
  Input,
  message,
  notification,
  Space,
  Modal,
  Upload,
  Row,
  Col,
  Radio,
  DatePicker,
  Avatar,
} from "antd";

import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { WEB_SERVER_URL } from "../../config/serverURL";
import { BEARER_TOKEN } from "../../config/auth";
import TextArea from "antd/lib/input/TextArea";
import { calc } from "@chakra-ui/react";

moment().locale("vi");
const formatDate = "DD/MM/yyyy";

export default function Infor() {
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
    if (record.birthday !== null) record.birthday = moment(record.birthday);
    setVisibleFormEdit(true);
    Object.entries(record).forEach(([key, value]) =>
      formEdit.setFieldValue(key, value)
    );
  };

  const updateUser = (values) => {
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
    axios
      .patch(`${WEB_SERVER_URL}/auth/changepassword`, values, BEARER_TOKEN)
      .then((response) => {
        setVisiblePasswordModal(false);
        message.success("Đổi mật khẩu thành công");
      })
      .catch((error) => {
        message.error("Đổi mật khẩu thất bại");
        console.log(error);
      });
  };

  const renderItem = (label, value, color) => {
    return (
      <Row
        align="middle"
        gutter={10}
        style={{
          borderRadius: 5,
          padding: 5,
          backgroundColor: color || "",
        }}
      >
        <Col span={8}>
          <Row justify="start">{label}</Row>
        </Col>
        <Col span={15}>
          <Row justify="start">
            <b>{value}</b>
          </Row>
        </Col>
      </Row>
    );
  };

  return (
    <div
      style={{
        fontSize: 15,
        backgroundColor: "#fff",
        borderRadius: 20,
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        padding: 20,
        margin: "20px 40px",
      }}
    >
      <Row justify="center" align="middle" gutter={20}>
        <Col span={8}>
          <Row justify="center" style={{ margin: 7 }}>
            <Avatar
              src={
                user.avatarUrl
                  ? `${WEB_SERVER_URL}${user?.avatarUrl}`
                  : "https://joeschmoe.io/api/v1/random"
              }
              size={150}
              style={{
                boxShadow:
                  "rgba(224, 140, 140, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
              }}
            />
          </Row>
          <Row justify="center">
            <span style={{ fontSize: 25, fontWeight: 700, color: "#0032bd" }}>
              {user.fullname}
            </span>
          </Row>
          <Row justify="center">{`${user.gender} - ${
            moment().get("years") - moment(user.birthday).get("years")
          } tuổi`}</Row>
          <Row justify="center" style={{ marginTop: 30, marginBottom: 10 }}>
            <Button
              type="primary"
              onClick={() => setVisiblePasswordModal(true)}
              style={{ width: "" }}
            >
              Đổi mật khẩu
            </Button>
          </Row>
          <Row justify="center">
            <Button type="primary" onClick={() => editUser(user)}>
              Chỉnh sửa thông tin
            </Button>
          </Row>
        </Col>
        <Col span={16}>
          {renderItem("Bộ phận", user.department, "#f1f5f9")}
          {renderItem("Chức vụ", user.position)}
          {renderItem("Mức lương", user.salary, "#f1f5f9")}
          {renderItem("Thẻ ngân hàng", user.bank)}
          {renderItem("Giới tính", user.gender, "#f1f5f9")}
          {renderItem("Ngày sinh", moment(user.birthday).format(formatDate))}
          {renderItem("CMND/CCCD", user.CCCD, "#f1f5f9")}
          {renderItem("Điện thoại", user.phone)}
          {renderItem("Email", user.email, "#f1f5f9")}
          {renderItem("Địa chỉ", user.address)}
          {renderItem("Bằng cấp", user.degree, "#f1f5f9")}
          {renderItem("Kĩ năng", user.skill)}
          {renderItem(
            "Ngày bắt đầu làm việc",
            moment(user.dateStart).format(formatDate),
            "#f1f5f9"
          )}
        </Col>
      </Row>

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
              <div style={{ textAlign: "left" }}>
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
            span: 10,
          }}
          wrapperCol={{
            span: 14,
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
    </div>
  );
}
