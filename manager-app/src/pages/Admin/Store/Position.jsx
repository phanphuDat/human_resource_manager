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

export default function Position() {
  const columns = [
    {
      title: "Tên chức vụ",
      key: "name",
      dataIndex: "name",
      width: "20%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Mô tả",
      key: "descriptions",
      dataIndex: "descriptions",
      // width: "40%",
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
              onClick={() => editPosition(record)}
            />
            <Popconfirm
              overlayInnerStyle={{ width: 300 }}
              okText="Đồng ý"
              cancelText="Đóng"
              title="Are you sure?"
              onConfirm={() => deletePosition(record)}
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
  const [positions, setPositions] = useState([]);

  const [search, setSearch] = useState("");
  const [visibleFormEdit, setVisibleFormEdit] = useState(false);
  const [visibleFormAdd, setVisibleFormAdd] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [formEdit] = Form.useForm();
  const [formAdd] = Form.useForm();

  // lấy API bộ phận, chức vụ 1 lần
  useEffect(() => {
    getAllPosition(1);
  }, []);

  // lấy API theo phân trang
  const getAllPosition = (page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/positions/getpositions?page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        setPositions(response.data.results);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const searchPosition = (text, page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/positions/searchpositions?search=${text}&page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          const newList = response.data.results;
          setPositions(newList);
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const addPosition = (value) => {
    axios
      .post(`${WEB_SERVER_URL}/positions/createposition`, value, BEARER_TOKEN)
      .then((response) => {
        if (response.status === 200) {
          setVisibleFormAdd(false);
          const newList = [...positions, response.data.results.data];
          setPositions(newList);
          message.success("Tạo thành công");
        } else message.error("Tạo thất bại");
      });
  };

  const editPosition = (record) => {
    setVisibleFormEdit(true);
    setSelectedRow(record);
    Object.entries(record).forEach(([key, value]) =>
      formEdit.setFieldValue(key, value)
    );
  };

  const updatePosition = (values) => {
    const id = selectedRow._id;
    const data = values;
    axios
      .patch(
        `${WEB_SERVER_URL}/positions/updateposition/${id}`,
        data,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          setVisibleFormEdit(false);
          const newList = positions.map((item) => {
            if (item._id === id) {
              return { _id: id, avatarUrl: selectedRow.avatarUrl, ...values };
            } else return item;
          });
          setPositions(newList);
          console.log(newList);
          message.success("Update thành công");
        } else message.error("Update thất bại");
      });
  };
  const deletePosition = (record) => {
    const { _id } = record;
    axios
      .delete(`${WEB_SERVER_URL}/positions/deleteposition/${_id}`, BEARER_TOKEN)
      .then((response) => {
        if (response.status === 200) {
          const newList = positions.filter((item) => item._id !== _id);
          setPositions(newList);
          message.success("Xóa thành công");
        } else message.error("Xóa thất bại");
      });
  };

  return (
    <Layout>
      <Layout.Content style={{ padding: 5 }}>
        <Row justify="space-around" style={{ margin: "5px 0 10px 0" }}>
          <Col span={10}>
            <Search
              placeholder="Nhập từ khoá tìm kiếm"
              allowClear
              value={search}
              loading={loading}
              enterButton="Search"
              size="middle"
              onChange={(text) => setSearch(text.target.value)}
              onSearch={() => searchPosition(search, 1)}
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
          dataSource={positions}
          pagination={{
            pageSize: pageSize,
            total: totalPages,
            onChange: (pageNumber) => {
              search
                ? searchPosition(search, pageNumber)
                : getAllPosition(pageNumber);
            },
          }}
          scroll={{ y: 360 }}
        />

        {/* Modal thêm mới  */}
        <Modal
          title="Tạo mới"
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
            onFinish={(value) => addPosition(value)}
            onFinishFailed={(error) => {
              message.error(error);
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Tên"
              name="name"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <Input placeholder="Nhập tên chức vụ" />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name={"descriptions"}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <TextArea placeholder="Nhập vô tả" rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chỉnh sửa  */}
        <Modal
          title="Chỉnh sửa thông tin"
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
            onFinish={(values) => updatePosition(values)}
            onFinishFailed={(error) => {
              message.error(error);
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Tên"
              name="name"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <Input placeholder="Nhập tên chức vụ" />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name={"descriptions"}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <TextArea placeholder="Nhập vô tả" rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
