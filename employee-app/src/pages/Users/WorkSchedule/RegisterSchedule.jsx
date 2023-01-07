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
  Tag,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  ScheduleOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { WEB_SERVER_URL } from "../../../config/serverURL";
import { BEARER_TOKEN, DEPARTMENT_ID, USER_ID } from "../../../config/auth";

moment.locale("vi");

export default function WorkSchedules() {
  const columns = [
    {
      title: "Ngày",
      key: "date",
      dataIndex: "date",
      // width: "40%",
      render: (text) => {
        return (
          <span style={{ fontWeight: "600" }}>
            {moment(text).format(formatDate)}
          </span>
        );
      },
    },
    {
      title: "Ca làm",
      key: "shifts",
      dataIndex: "shifts",
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag color="cyan">{`${moment(tag.in).format(formatHour)}-${moment(
              tag.out
            ).format(formatHour)}`}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Đăng kí",
      key: "actions",
      render: (record) => {
        return (
          <Space>
            <Button
              type="dashed"
              icon={<ScheduleOutlined />}
              style={{ fontWeight: "600" }}
              onClick={() => editRegisterCalendar(record)}
            />
          </Space>
        );
      },
    },
  ];

  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [shiftList, setShiftList] = useState([]);
  // dùng cho add
  const [refresh, setRefresh] = useState(true);
  const formatDate = "DD/MM/yyyy";
  const formatHour = "HH:mm";
  // modal xếp lịch làm
  const [visibleScheduleWork, setVisibleScheduleWork] = useState(false);
  // hàng được chọn
  const [selectedRow, setSelectedRow] = useState(null);

  const [form] = Form.useForm();

  // lấy API bộ phận, chức vụ 1 lần
  useEffect(() => {
    getActiveCalendars(1);
  }, [refresh]);

  // lấy API theo phân trang
  const getActiveCalendars = (page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/departmentcalendar/employeegetcalendars/${DEPARTMENT_ID}?page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        let results = response.data.results;
        setShiftList(results);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const editRegisterCalendar = async (record) => {
    form.setFieldValue("shifts", []);
    let options = await record?.shifts?.map((item) => {
      return {
        label: `${moment(item.in).format(formatHour)}-${moment(item.out).format(
          formatHour
        )}`,
        value: `${item.in} ${item.out}`,
      };
    });
    await setSelectedRow({ ...record, options });
    await setVisibleScheduleWork(true);
  };

  // Đăng kí lịch làm sau khi điền form
  const registerCalendar = (values) => {
    setVisibleScheduleWork(false);
    var list = [];
    values.shifts.forEach((item) => {
      let inout = item.split(" ");
      list.push({
        calendarId: selectedRow._id,
        userId: USER_ID,
        departmentId: DEPARTMENT_ID,
        date: moment(selectedRow.date),
        in: moment(inout[0]),
        out: moment(inout[1]),
      });
    });
    axios
      .post(`${WEB_SERVER_URL}/usershift/createusershift`, list, BEARER_TOKEN)
      .then((response) => {
        setRefresh(!refresh);
        message.success(response.data.message);
      })
      .catch((error) => {
        message.error("Đăng kí thất bại");
        console.log(error);
      });
  };

  return (
    <Layout.Content style={{ padding: 2 }}>
      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={shiftList}
        pagination={{
          pageSize: pageSize,
          total: totalPages,
          onChange: (pageNumber) => getActiveCalendars(pageNumber),
        }}
        scroll={{ y: 500 }}
      />

      {/* Modal đăng kí  */}
      <Modal
        title={`Đăng kí lịch làm ngày ${moment(selectedRow?.date).format(
          formatDate
        )}`}
        open={visibleScheduleWork}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setVisibleScheduleWork(false);
        }}
        style={{ margin: 0, padding: 0, width: "100%" }}
      >
        <Form
          form={form}
          name="registerCalendar"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={(value) => registerCalendar(value)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Ca làm muốn đăng kí"
            name="shifts"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <Select
              mode="multiple"
              style={{
                width: "100%",
              }}
              placeholder="Chọn ca làm"
              options={selectedRow?.options}
              // onChange={(e) => console.log(e)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout.Content>
  );
}
