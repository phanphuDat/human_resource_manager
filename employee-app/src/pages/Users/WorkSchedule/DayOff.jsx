import React, { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Table,
  Form,
  Input,
  InputNumber,
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
  Checkbox,
  TimePicker,
  Divider,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { WEB_SERVER_URL } from "../../../config/serverURL";
import { BEARER_TOKEN, USER_ID } from "../../../config/auth";
const { Search } = Input;

moment.locale("vi");

export default function InOut() {
  const columns = [
    {
      title: "Từ ngày",
      key: "dateStart",
      dataIndex: "dateStart",
      // width: "1%",
      render: (text) => {
        return (
          <span style={{ fontWeight: "600" }}>
            {moment(new Date(text)).format(formatDate)}
          </span>
        );
      },
    },
    {
      title: "Đến hết ngày",
      key: "dateEnd",
      dataIndex: "dateEnd",
      // width: "1%",
      render: (text) => {
        return (
          <span style={{ fontWeight: "600" }}>
            {moment(new Date(text)).format(formatDate)}
          </span>
        );
      },
    },
    {
      title: "Lý do",
      key: "reason",
      dataIndex: "reason",
      width: "40%",
      // width: "400px",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      width: "1%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Sửa / Xoá",
      key: "actions",
      width: "1%",
      render: (record) => {
        return (
          <Space>
            <Button
              type="dashed"
              icon={<EditOutlined />}
              style={{ fontWeight: "600" }}
              onClick={() => editDayoff(record)}
              // onClick={() => console.log(record)}
            />
            <Popconfirm
              overlayInnerStyle={{ width: 300 }}
              okText="Đồng ý"
              cancelText="Đóng"
              title="Bạn chắc chứ?"
              onConfirm={() => deleteDayoff(record)}
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
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [dayoffList, setDayoffList] = useState([]);
  const [search, setSearch] = useState("");
  // dùng cho add
  const [searchUser, setSearchUser] = useState("");
  const [chooseUsers, setChooseUsers] = useState([]);
  const [users, setUsers] = useState([]);
  // bật tắt modal
  const [visibleFormEdit, setVisibleFormEdit] = useState(false);
  const [visibleFormAdd, setVisibleFormAdd] = useState(false);
  // hàng được chọn
  const [selectedRow, setSelectedRow] = useState(null);

  const formatDate = "DD/MM/YYYY";
  const [formEdit] = Form.useForm();
  const [formAdd] = Form.useForm();

  // lấy API bộ phận, chức vụ 1 lần
  useEffect(() => {
    getAllDayoffs(1);
  }, []);

  // lấy API theo phân trang
  const getAllDayoffs = (page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/dayoffs/employeegetdayoffs/${USER_ID}?page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        setDayoffList(response.data.results);
        // setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const addDayOff = (value) => {
    let data = {
      userId: USER_ID,
      dateStart: value.rangeTime[0],
      dateEnd: value.rangeTime[1],
      reason: value.reason,
    };
    axios
      .post(`${WEB_SERVER_URL}/dayoffs/createdayoff`, data, BEARER_TOKEN)
      .then((response) => {
        const newDayOff = response.data.results.data;
        const newList = [newDayOff, ...dayoffList];
        message.success("Chấm công thành công");
        setVisibleFormAdd(false);
        setDayoffList(newList);
      })
      .catch((error) => {
        message.error("Chấm công thất bại");
        console.log(error);
      });
  };

  const searchDayoffs = (text, page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/dayoffs/usersearchdayoffs/${USER_ID}?search=${text}&page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        console.log(response.data);
        const newList = response.data.results;
        setDayoffList(newList);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const editDayoff = (record) => {
    setVisibleFormEdit(true);
    setSelectedRow(record);
    formEdit.setFieldValue("rangeTime", [
      moment(record.dateStart),
      moment(record.dateEnd),
    ]);
    formEdit.setFieldValue("reason", record.reason);
  };

  const updateDayoff = (values) => {
    setVisibleFormEdit(false);
    // console.log(values);
    const id = selectedRow._id;
    const data = {
      dateStart: values.rangeTime[0],
      dateEnd: values.rangeTime[1],
      reason: values.reason,
    };
    axios
      .patch(
        `${WEB_SERVER_URL}/dayoffs/userupdatedayoff/${id}`,
        data,
        BEARER_TOKEN
      )
      .then((response) => {
        message.success("Update thành công");
        const newList = dayoffList.map((item) => {
          if (item._id === id) {
            return {
              _id: id,
              userId: selectedRow.userId,
              ...values,
              status: selectedRow.status,
            };
          } else return item;
        });
        setDayoffList(newList);
      })
      .catch((error) => {
        message.error("Update thất bại");
        console.log(error);
      });
  };

  const deleteDayoff = (record) => {
    const { _id } = record;
    axios
      .delete(`${WEB_SERVER_URL}/dayoffs/deletedayoff/${_id}`, BEARER_TOKEN)
      .then((response) => {
        const newList = dayoffList.filter((item) => item._id !== _id);
        setDayoffList(newList);
        message.success("Xóa thành công");
      })
      .catch((error) => {
        message.error("Xóa thất bại");
        console.log(error);
      });
  };

  return (
    <Layout.Content style={{ padding: 4 }}>
      <Row wrap={false} style={{ margin: "5px 0 8px 0" }}>
        <Col>
          <Search
            placeholder="Nhập từ khoá tìm kiếm"
            allowClear
            value={search}
            loading={loading}
            enterButton="Search"
            size="large"
            onChange={(text) => {
              // console.log(text.target.value);
              if (text.target.value !== "") {
                setSearch(text.target.value);
              } else {
                getAllDayoffs(1);
                setSearch("");
              }
            }}
            onSearch={() => searchDayoffs(search, 1)}
          />
        </Col>
        <Col>
          <Button size="large" onClick={() => setVisibleFormAdd(true)}>
            Thêm mới
          </Button>
        </Col>
      </Row>
      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={dayoffList}
        pagination={{
          pageSize: pageSize,
          total: totalPages,
          onChange: (pageNumber) => {
            search
              ? searchDayoffs(search, pageNumber)
              : getAllDayoffs(pageNumber);
          },
        }}
        scroll={{ x: 700 }}
      />

      {/* Modal thêm mới  */}
      <Modal
        title="Thêm mới"
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
          onFinish={(value) => addDayOff(value)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Thời gian nghỉ"
            name="rangeTime"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <DatePicker.RangePicker format={formatDate} />
          </Form.Item>
          <Form.Item
            label="Lý do"
            name="reason"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <Input placeholder="Lý do" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal update  */}
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
          onFinish={(values) => updateDayoff(values)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Thời gian nghỉ"
            name="rangeTime"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <DatePicker.RangePicker format={formatDate} />
          </Form.Item>
          <Form.Item
            label="Lý do"
            name="reason"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <Input placeholder="Lý do" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout.Content>
  );
}
