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
  Row,
  Col,
  Select,
  DatePicker,
} from "antd";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { WEB_SERVER_URL } from "../../../config/serverURL";
import { BEARER_TOKEN, USER_ID } from "../../../config/auth";
const { Search } = Input;

moment.locale("vi");

export default function InOut() {
  const columns = [
    {
      title: "Ảnh",
      key: "avatarUrl",
      dataIndex: "avatarUrl",
      width: "6%",
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
      width: "15%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Từ",
      key: "dateStart",
      dataIndex: "dateStart",
      width: "10%",
      render: (text) => {
        return (
          <span style={{ fontWeight: "600" }}>
            {moment(new Date(text)).format(formatDate)}
          </span>
        );
      },
    },
    {
      title: "Đến",
      key: "dateEnd",
      dataIndex: "dateEnd",
      width: "10%",
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
      width: "39%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
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
  // bật tắt modal
  const [visibleFormEdit, setVisibleFormEdit] = useState(false);
  // hàng được chọn
  const [selectedRow, setSelectedRow] = useState(null);

  const formatDate = "DD/MM/YYYY";
  const [formEdit] = Form.useForm();

  // lấy API bộ phận, chức vụ 1 lần
  useEffect(() => {
    getAllDayoffs(1);
  }, []);

  // lấy API theo phân trang
  const getAllDayoffs = (page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/dayoffs/getdayoffs?page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        setDayoffList(response.data.results);
        // setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  const searchDayoffs = (text, page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/dayoffs/managersearchdayoffs?search=${text}&page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
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
    if (values.status !== selectedRow.status) {
      const id = selectedRow._id;
      const data = {
        status: values.status,
      };
      axios
        .patch(
          `${WEB_SERVER_URL}/dayoffs/managerupdatedayoff/${id}`,
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
    }
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
      <Row justify="start" style={{ margin: "5px 0 8px 0" }}>
        <Col offset={2}>
          <Search
            placeholder="Nhập từ khoá tìm kiếm"
            allowClear
            value={search}
            loading={loading}
            enterButton="Search"
            size="middle"
            onChange={(text) => {
              console.log(text.target.value);
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
        scroll={{ y: 400 }}
      />

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
            span: 6,
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
          <Form.Item label="Nhân viên" name="fullname">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Thời gian nghỉ" name="rangeTime">
            <DatePicker.RangePicker format={formatDate} disabled />
          </Form.Item>
          <Form.Item label="Lý do" name="reason" disabled>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <Select
              options={[
                {
                  value: "Chấp nhận",
                  label: "Chấp nhận",
                },
                {
                  value: "Từ chối",
                  label: "Từ chối",
                },
                {
                  value: "Chưa duyệt",
                  label: "Chưa duyệt",
                  disabled: true,
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout.Content>
  );
}
