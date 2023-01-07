import React, { useState, useEffect } from "react";
import { Button, Layout, Table, Popconfirm, message, Tag } from "antd";

import { DeleteOutlined } from "@ant-design/icons";
import { GoSignIn, GoSignOut } from "react-icons/go";
import axios from "axios";
import moment from "moment";
import { WEB_SERVER_URL } from "../../../config/serverURL";
import { BEARER_TOKEN, USER_ID } from "../../../config/auth";
import randomString from "randomstring";

moment.locale("vi");
const formatDate = "DD/MM/yyyy";
const formatHour = "HH:mm";

export default function MySchedules({ socket }) {
  const columns = [
    {
      title: "Ngày",
      key: "date",
      dataIndex: "date",
      width: "20%",
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
      width: "15%",
      render: (time) =>
        time ? (
          <Tag color="cyan">{moment(time).format(formatHour)}</Tag>
        ) : (
          "chưa có"
        ),
    },
    {
      title: "Ra",
      key: "timeOut",
      dataIndex: "timeOut",
      width: "15%",
      render: (time) =>
        time ? (
          <Tag color="cyan">{moment(time).format(formatHour)}</Tag>
        ) : (
          "chưa có"
        ),
    },
    {
      title: "Chấm công",
      key: "actions",
      width: "15%",
      render: (record) => {
        // if (record.timeOut || moment(record.date) < moment()) {
        //   return "";
        // } else {
        if (!record.timeOut && !record.timeIn) {
          return (
            <Button
              type="primary"
              style={{ fontWeight: "600" }}
              onClick={() => timeKeeping(record, "in")}
            >
              <GoSignIn /> In
            </Button>
          );
        } else {
          if (!record.timeOut && record.timeIn) {
            return (
              <Button
                type="primary"
                style={{ fontWeight: "600" }}
                onClick={() => timeKeeping(record, "out")}
              >
                <GoSignOut />
                Out
              </Button>
            );
          }
        }
        // }
      },
    },
    {
      title: "Xoá",
      key: "delete",
      width: "10%",
      render: (record) => {
        if (moment(record.date) > moment()) {
          return (
            <Popconfirm
              overlayInnerStyle={{ width: 300 }}
              okText="Đồng ý"
              cancelText="Đóng"
              title="Bạn chắc chứ?"
              onConfirm={() => deleteUserShift(record)}
            >
              <Button
                danger
                type="ghost"
                icon={<DeleteOutlined />}
                style={{ fontWeight: "600" }}
              ></Button>
            </Popconfirm>
          );
        } else return "";
      },
    },
  ];

  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [shiftList, setShiftList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [randomKey, setRandomKey] = useState("");

  // lấy API bộ phận, chức vụ 1 lần
  useEffect(() => {
    getUserShifts(1);
  }, [refresh]);

  // lấy API theo phân trang
  const getUserShifts = (page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/usershift/employeegetshift/${USER_ID}?page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        let results = response.data.results.map((item) => ({
          ...item,
          shift: { in: item.in, out: item.out },
        }));
        // console.log(results);
        setShiftList(results);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const timeKeeping = (record, inout) => {
    // const id = record._id;
    // const data = {};
    // if (inout === "in") {
    //   data.timeIn = moment();
    // } else {
    //   data.timeOut = moment();
    // }
    // axios
    //   .patch(
    //     `${WEB_SERVER_URL}/usershift/updateusershift/${id}?type=${inout}`,
    //     data,
    //     BEARER_TOKEN
    //   )
    //   .then((response) => {
    //     message.success("Update thành công");
    //   })
    //   .catch((error) => {
    //     message.error("Cập nhật thất bại");
    //     console.log(error);
    //   });

    console.log(record, "    ", inout);
    const id = record._id;
    const randomKey = randomString.generate(8);
    const data = {
      id: id,
      inout: inout,
      randomKey: randomKey,
    };
    console.log(data);
    socket.emit("datashift", data);
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

  useEffect(() => {
    socket.on("datashift-qr", (data) => console.log(data));
  }, [randomKey]);

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
          onChange: (pageNumber) => getUserShifts(pageNumber),
        }}
        scroll={{ x: 600, y: 550 }}
      />
    </Layout.Content>
  );
}
