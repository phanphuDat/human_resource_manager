import React, { useState, useEffect } from "react";
import {
  Button,
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
  TimePicker,
  Tag,
  Divider,
  DatePicker,
} from "antd";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { WEB_SERVER_URL } from "../../../config/serverURL";
import { BEARER_TOKEN } from "../../../config/auth";
const { Search } = Input;

moment.locale("vi");
const formatDate = "DD/MM/yyyy";
const formatHour = "HH:mm";

export default function InOut() {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearch, setIsSearch] = useState(false);
  const [userShifts, setUserShifts] = useState([]);
  const [search, setSearch] = useState("");
  // bật tắt modal
  const [visibleFormEdit, setVisibleFormEdit] = useState(false);
  // hàng được chọn
  const [selectedRow, setSelectedRow] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [formEdit] = Form.useForm();

  // lấy API bộ phận, chức vụ 1 lần
  useEffect(() => {
    getAllUserShifts(1);
  }, [refresh]);

  // lấy API theo phân trang
  const getAllUserShifts = (page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/usershift/getallusershifts?page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        setUserShifts(response.data.results);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const searchUserShift = (date) => {
    console.log(date);
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/usershift/searchusershift?date=${date}`,
        BEARER_TOKEN
      )
      .then((response) => {
        const newList = response.data;
        setUserShifts(newList);
      })
      .catch((error) => console.log(error));
    setLoading(false);
  };
  //

  const editUserShift = (record) => {
    // console.log(record);
    setVisibleFormEdit(true);
    setSelectedRow(record);
    formEdit.setFieldValue("shift", [moment(record.in), moment(record.out)]);
    formEdit.setFieldValue(
      "timeIn",
      record.timeIn ? moment(record.timeIn) : null
    );
    formEdit.setFieldValue(
      "timeOut",
      record.timeOut ? moment(record.timeOut) : null
    );
  };

  const updateUserShift = (values) => {
    setVisibleFormEdit(false);
    console.log(values);
    const id = selectedRow._id;
    const data = {
      timeIn: values.timeIn,
      timeOut: values.timeOut,
    };
    axios
      .patch(
        `${WEB_SERVER_URL}/usershift/updateusershift/${id}`,
        data,
        BEARER_TOKEN
      )
      .then((response) => {
        setRefresh(!refresh);
        message.success("Cập nhật thành công");
      })
      .catch((error) => {
        console.log(error);
        message.error("Cập nhật thất bại");
      });
  };

  const deleteUserShift = (record) => {
    console.log(record);
    axios
      .delete(
        `${WEB_SERVER_URL}/usershift/deleteusershift/${record._id}?calendarId=${record.calendarId}&int=${record.in}&out=${record.out}`,
        BEARER_TOKEN
      )
      .then((response) => {
        setRefresh(!refresh);
        message.success("Xóa thành công");
      })
      .catch((error) => {
        console.log(error);
        message.error("Xoá thất bại");
      });
  };

  const renderTable = (data) => {
    let tableData = data?.userShifts?.map((item) => ({
      ...item,
      shift: { in: item.in, out: item.out },
    }));
    const columns = [
      {
        title: "Ảnh",
        key: "avatarUrl",
        dataIndex: "avatarUrl",
        render: (text) => {
          return (
            <div>
              {text && (
                <img
                  src={`${WEB_SERVER_URL}${text}`}
                  style={{ maxWidth: 30, maxHeight: 30 }}
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
        render: (text) => {
          return <span style={{ fontWeight: "600" }}>{text}</span>;
        },
      },
      {
        title: "Ca làm",
        key: "shift",
        dataIndex: "shift",
        width: "25%",
        render: (time) => (
          <Tag color="cyan">{`${moment(time.in).format(formatHour)}-${moment(
            time.out
          ).format(formatHour)}`}</Tag>
        ),
      },
      {
        title: "Vào",
        key: "timeIn",
        dataIndex: "timeIn",
        render: (text) => {
          return (
            <span style={{ fontWeight: "600" }}>
              {text ? moment(text).format(formatHour) : ""}
            </span>
          );
        },
      },
      {
        title: "Ra",
        key: "timeOut",
        dataIndex: "timeOut",
        render: (text) => {
          return (
            <span style={{ fontWeight: "600" }}>
              {text ? moment(text).format(formatHour) : ""}
            </span>
          );
        },
      },
      {
        title: "Sửa / Xoá",
        key: "actions",
        render: (record) => {
          return (
            <Space>
              <Button
                type="dashed"
                icon={<EditOutlined />}
                style={{ fontWeight: "600" }}
                onClick={() => editUserShift(record)}
                // onClick={() => console.log(record)}
              />
              <Popconfirm
                overlayInnerStyle={{ width: 300 }}
                okText="Đồng ý"
                cancelText="Đóng"
                title="Bạn chắc chứ?"
                onConfirm={() => deleteUserShift(record)}
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
    return (
      <div key={data._id}>
        <b>
          {`Ca làm ngày ${moment(data._id).format(formatDate)}`.toUpperCase()}
        </b>
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={tableData}
          pagination={false}
        />
        <Divider style={{ magin: 1 }}></Divider>
      </div>
    );
  };

  return (
    <div style={{ margin: 4 }}>
      <Row
        justify="start"
        wrap={false}
        style={{ margin: "10px 2px 0 2px" }}
        gutter={10}
      >
        <Col offset={4}>
          <DatePicker
            value={search}
            onChange={(value) => {
              setSearch(value);
            }}
            format={formatDate}
            size="middle"
          />
          <Button
            type="primary"
            onClick={() => {
              setIsSearch(true);
              searchUserShift(search);
            }}
            size="middle"
          >
            Tìm kiếm
          </Button>
        </Col>
        {isSearch ? (
          <Col>
            <Button
              type="primary"
              onClick={() => {
                setIsSearch(false);
                setSearch("");
                getAllUserShifts(page);
              }}
            >
              Thoát tìm kiếm
            </Button>
          </Col>
        ) : null}
      </Row>
      <Row style={{ margin: 10, borderBottom: "1px solid #333" }}></Row>
      {/* Render calendar */}
      <div
        style={{
          height: "70vh",
          overflowY: "auto",
        }}
      >
        {userShifts === []
          ? "Trống"
          : userShifts.map((item) => renderTable(item))}
      </div>

      {/* Modal update  */}
      <Modal
        title="Thông tin chấm công"
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
          onFinish={(values) => updateUserShift(values)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
          autoComplete="off"
        >
          <Form.Item label="Ca làm" name="shift">
            <TimePicker.RangePicker format={formatHour} disabled />
          </Form.Item>
          <Form.Item
            label="Giờ vào"
            name="timeIn"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <TimePicker format={formatHour} />
          </Form.Item>
          <Form.Item
            label="Giờ ra"
            name="timeOut"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <TimePicker format={formatHour} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
