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
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { WEB_SERVER_URL } from "../../../config/serverURL";
import { BEARER_TOKEN } from "../../../config/auth";
import TextArea from "antd/lib/input/TextArea";
const { Search } = Input;

export default function ManagerUser() {
  const columns = [
    {
      title: "Ảnh",
      key: "avatarUrl",
      dataIndex: "avatarUrl",
      width: "8%",
      render: (text) => {
        return (
          <div>
            {text && (
              <img
                src={`${WEB_SERVER_URL}${text}`}
                style={{ maxHeight: 30, maxWidth: 30 }}
                alt=""
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Họ và tên",
      key: "fullname",
      dataIndex: "fullname",
      width: "20%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Bộ phận",
      key: `department`,
      dataIndex: "departmentId",
      width: "10%",
      render: (text) => {
        let departmentName;
        departments.forEach((element) => {
          if (element._id === text) {
            departmentName = element.name;
            return;
          }
        });
        return <span style={{ fontWeight: "600" }}>{departmentName}</span>;
      },
    },
    {
      title: "Chức vụ",
      key: "position",
      dataIndex: "positionId",
      width: "10%",
      render: (text) => {
        let positionName;
        positions.forEach((element) => {
          if (element._id === text) {
            positionName = element.name;
            return;
          }
        });
        return <span style={{ fontWeight: "600" }}>{positionName}</span>;
      },
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
      width: "20%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Quyền tài khoản",
      key: "role",
      dataIndex: "role",
      width: "10%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Sửa / Xoá",
      key: "actions",
      width: "10%",
      render: (record) => {
        return (
          <Space>
            <Button
              type="dashed"
              icon={<EditOutlined />}
              style={{ fontWeight: "600" }}
              onClick={() => editUser(record)}
            />
            <Popconfirm
              overlayInnerStyle={{ width: 300 }}
              okText="Đồng ý"
              cancelText="Đóng"
              title="Are you sure?"
              onConfirm={() => deleteUser(record)}
            >
              <Button
                danger
                type="dashed"
                icon={<DeleteOutlined />}
                style={{ fontWeight: "600" }}
                // onClick={() => {console.log(record);}}
              ></Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);

  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [visibleFormEdit, setVisibleFormEdit] = useState(false);
  const [visibleFormAdd, setVisibleFormAdd] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [formEdit] = Form.useForm();
  const [formAdd] = Form.useForm();

  // lấy API bộ phận, chức vụ 1 lần
  useEffect(() => {
    getAllUsers(1);
    axios
      .get(`${WEB_SERVER_URL}/departments/getdepartments`, BEARER_TOKEN)
      .then((response) => {
        setDepartments(response.data.results);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${WEB_SERVER_URL}/positions/getpositions`, BEARER_TOKEN)
      .then((response) => {
        setPositions(response.data.results);
      })
      .catch((error) => console.log(error));
  }, []);

  // lấy API theo phân trang
  const getAllUsers = (page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/users/getallusers?page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        setUsers(response.data.results);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const searchUsers = (text, page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/users/getusers?search=${text}&page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          const newList = response.data.results;
          setUsers(newList);
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const addUser = (value) => {
    axios
      .post(`${WEB_SERVER_URL}/users/createuser`, value, BEARER_TOKEN)
      .then((response) => {
        if (response.status === 200) {
          setVisibleFormAdd(false);
          const newList = [...users, response.data.results.data];
          setUsers(newList);
          message.success("Tạo thành công");
        } else message.error("Tạo thất bại");
      });
  };

  const editUser = (record) => {
    setVisibleFormEdit(true);
    setSelectedRow(record);
    Object.entries(record).forEach(([key, value]) =>
      formEdit.setFieldValue(key, value)
    );
  };

  const updateUser = (values) => {
    const id = selectedRow._id;
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );
    axios
      .patch(
        `${WEB_SERVER_URL}/users/adminupdateuser/${id}`,
        formData,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          setVisibleFormEdit(false);
          const newList = users.map((item) => {
            if (item._id === id) {
              return { _id: id, avatarUrl: response.data.avatarUrl, ...values };
            } else return item;
          });
          setUsers(newList);
          message.success("Update thành công");
        } else message.error("Update thất bại");
      });
  };
  const deleteUser = (record) => {
    const { _id } = record;
    axios
      .delete(`${WEB_SERVER_URL}/users/deleteuser/${_id}`, BEARER_TOKEN)
      .then((response) => {
        if (response.status === 200) {
          const newList = users.filter((item) => item._id !== _id);
          setUsers(newList);
          message.success("Xóa thành công");
        } else message.error("Xóa thất bại");
      });
  };

  return (
    <Layout>
      <Layout.Content style={{ padding: 5 }}>
        <Row justify="space-around" style={{ margin: 5 }}>
          <Col span={10}>
            <Search
              placeholder="Nhập từ khoá tìm kiếm"
              allowClear
              value={search}
              loading={loading}
              enterButton="Search"
              size="middle"
              onChange={(text) => setSearch(text.target.value)}
              onSearch={() => searchUsers(search)}
            />
          </Col>
          <Col span={4} justify={"end"}>
            <Button
              type="primary"
              size="middle"
              onClick={() => setVisibleFormAdd(true)}
            >
              Thêm mới
            </Button>
          </Col>
        </Row>

        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={users}
          pagination={{
            pageSize: pageSize,
            total: totalPages,
            onChange: (pageNumber) => {
              search
                ? searchUsers(search, pageNumber)
                : getAllUsers(pageNumber);
            },
          }}
          scroll={{ y: 360 }}
        />

        {/* Modal thêm mới user */}
        <Modal
          title="Chỉnh sửa thông tin nhân viên"
          open={visibleFormAdd}
          onOk={() => {
            formAdd.submit();
          }}
          onCancel={() => {
            setVisibleFormAdd(false);
          }}
        >
          <Form
            form={formAdd}
            name="add"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{}}
            onFinish={(value) => addUser(value)}
            onFinishFailed={(error) => {
              message.error(error);
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Họ và tên"
              name="fullname"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Giới tính" name="gender">
              <Radio.Group>
                <Radio value="Nam"> Nam </Radio>
                <Radio value="Nữ"> Nữ </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Phone" name={"phone"} hasFeedback>
              <Input placeholder="Enter your phone number" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập email",
                },
                { type: "email" },
              ]}
            >
              <Input />
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
            <Form.Item
              label="Bộ phận"
              name={"departmentId"}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <Select>
                {departments.map((item, index) => {
                  return (
                    <Select.Option value={item._id}>{item.name}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Chức vụ"
              name={"positionId"}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <Select>
                {positions.map((item, index) => {
                  return (
                    <Select.Option value={item._id}>{item.name}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Hệ số lương"
              name={"salary"}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập hệ số lương",
                },
              ]}
            >
              <InputNumber addonAfter="vnđ" />
            </Form.Item>
            <Form.Item label="Số tài khoản" name={"bank"} hasFeedback>
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal update user */}
        <Modal
          title="Chỉnh sửa thông tin nhân viên"
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
            initialValues={selectedRow || ""}
            onFinish={(values) => updateUser(values)}
            onFinishFailed={(error) => {
              message.error(error);
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Họ và tên"
              name="fullname"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Giới tính" name="gender">
              <Radio.Group>
                <Radio value="Nam"> Nam </Radio>
                <Radio value="Nữ"> Nữ </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Phone" name={"phone"} hasFeedback>
              <Input placeholder="Enter your phone number" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập email",
                },
                { type: "email" },
              ]}
            >
              <Input />
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
            <Form.Item
              label="Quyền"
              name={"role"}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <Select>
                <Select.Option value="employee">employee</Select.Option>
                <Select.Option value="manager">manager</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Bộ phận"
              name={"departmentId"}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <Select>
                {departments.map((item, index) => {
                  return (
                    <Select.Option value={item._id}>{item.name}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Chức vụ"
              name={"positionId"}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <Select>
                {positions.map((item, index) => {
                  return (
                    <Select.Option value={item._id}>{item.name}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Hệ số lương"
              name={"salary"}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập hệ số lương",
                },
              ]}
            >
              <InputNumber addonAfter="vnđ" />
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
      </Layout.Content>
    </Layout>
  );
}
