import { Avatar, Button, Col, DatePicker, Layout, Row, Table } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useState } from "react";
import moment from "moment";
import axios from "axios";
import { WEB_SERVER_URL } from "../../../config/serverURL";
import { BEARER_TOKEN } from "../../../config/auth";

moment.locale("vi");

export default function Salarys() {
  const [loading, setLoading] = useState(false);
  const [rangeDate, setRangeDate] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  // data lấy từ API về
  const [tableData, setTableData] = useState([]);
  // phân trang từ tableData
  const [tablePage, setTablePage] = useState([]);
  const [columns, setColumns] = useState([]);

  const formatDate = "DD-MM-yyyy";

  const renderColumns = (start, end) => {
    let dateStart = moment(start).year() * 365 + moment(start).dayOfYear();
    let dateEnd = moment(end).year() * 365 + moment(end).dayOfYear();
    let i = start;
    let dateColumns = [];
    while (
      moment(i).year() * 365 + moment(i).dayOfYear() >= dateStart &&
      moment(i).year() * 365 + moment(i).dayOfYear() <= dateEnd
    ) {
      dateColumns.push({
        title: moment(i).date(),
        key: moment(i).format(formatDate),
        dataIndex: moment(i).format(formatDate),
        render: (text) => {
          return (
            <Row style={{ fontWeight: "600" }} align="middle" justify="center">
              {text}
            </Row>
          );
        },
      });
      i = moment(i).add(1, "days");
    }
    return dateColumns;
  };
  const Statisticals = async (time) => {
    setLoading(true);
    const newColumns = [
      {
        title: "Ảnh",
        key: "avatarUrl",
        dataIndex: "avatarUrl",
        ellipsis: true,
        fixed: "left",
        render: (text) => {
          return (
            <div>
              {text && (
                <Avatar
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
        title: "Tên",
        key: "fullname",
        dataIndex: "fullname",
        fixed: "left",
        ellipsis: true,
        render: (text) => {
          return <span style={{ fontWeight: "600" }}>{text}</span>;
        },
      },
    ]
      .concat(time ? renderColumns(time[0], time[1]) : [])
      .concat([
        {
          title: "Ca làm",
          key: "totalShift",
          dataIndex: "totalShift",
          width: 150,
          render: (text) => {
            return (
              <Row
                style={{ fontWeight: "600" }}
                align="middle"
                justify="center"
              >
                {text}
              </Row>
            );
          },
        },
        {
          title: "Đi trễ",
          key: "totalL",
          dataIndex: "totalL",
          width: 150,
          render: (text) => {
            return (
              <Row
                style={{ fontWeight: "600" }}
                align="middle"
                justify="center"
              >
                {text}
              </Row>
            );
          },
        },
        {
          title: "Thiếu in/out",
          key: "totalI",
          dataIndex: "totalI",
          width: 150,
          render: (text) => {
            return (
              <Row
                style={{ fontWeight: "600" }}
                align="middle"
                justify="center"
              >
                {text}
              </Row>
            );
          },
        },
        {
          title: "Nghỉ phép",
          key: "totalP",
          dataIndex: "totalP",
          width: 150,
          render: (text) => {
            return (
              <Row
                style={{ fontWeight: "600" }}
                align="middle"
                justify="center"
              >
                {text}
              </Row>
            );
          },
        },
        {
          title: "Nghỉ không phép",
          key: "totalK",
          dataIndex: "totalK",
          width: 150,
          render: (text) => {
            return (
              <Row
                style={{ fontWeight: "600" }}
                align="middle"
                justify="center"
              >
                <span>{text}</span>
              </Row>
            );
          },
        },
      ]);
    await axios
      .get(
        `${WEB_SERVER_URL}/utilities/managertimekeeping?start=${time[0]}&end=${time[1]}`,
        BEARER_TOKEN
      )
      .then(async (results) => {
        let res = results.data;
        const data = await res.map((item) => {
          let row = [
            ["avatarUrl", item.avatarUrl],
            ["fullname", item.fullname],
            ["salary", item.salary],
          ];
          let totalShift = 0; // tổng số ca làm
          let totalL = 0;
          let totalI = 0;
          let totalP = 0;
          let totalK = 0;
          item.userShifts.forEach((shift) => {
            let sign = "";
            totalShift += 1;
            if (shift.timeIn || shift.timeOut) {
              //x,l
              if (shift.timeIn && shift.timeOut) {
                //x,l
                if (
                  moment(shift.timeIn).hour() * 60 +
                    moment(shift.timeIn).minute() <
                    moment(shift.in).hour() * 60 + moment(shift.in).minute() &&
                  moment(shift.timeOut).hour() * 60 +
                    moment(shift.timeOut).minute() >
                    moment(shift.out).hour() * 60 + moment(shift.out).minute()
                ) {
                  sign = sign + "X"; // đi làm đúng giờ
                } else {
                  sign = sign + "L";
                  totalL += 1;
                } // trễ hoặc về sớm
              } else {
                sign = sign + "I"; //i thiếu thông tin chấm công
                totalI += 1;
              }
            } else {
              let p = "K";
              // lặp qua đơn nghỉ phép xem có được cho phép nghỉ hay k? Nếu k thì là nghỉ k phép ('K')
              item.dayOffs.forEach((dayOff) => {
                let start =
                  moment(dayOff.dateStart).year() * 365 +
                  moment(dayOff.dateStart).dayOfYear();
                let end =
                  moment(dayOff.dateEnd).year() * 365 +
                  moment(dayOff.dateEnd).dayOfYear();
                let sht =
                  moment(shift.date).year() * 365 +
                  moment(shift.date).dayOfYear();
                if (sht > start && sht < end && dayOff.status === "Chấp nhận") {
                  p = "P";
                  return;
                }
              });
              totalP += 1;
              if (p === "K") {
                totalK += 1;
              } else {
                totalP += 1;
              }
              sign = sign + p;
              //p,kp
            }
            row.push([moment(shift.date).format(formatDate), sign]);
          });
          row.push(
            ["totalShift", totalShift],
            ["totalL", totalL],
            ["totalI", totalI],
            ["totalP", totalP],
            ["totalK", totalK]
          );
          return Object.fromEntries(row);
        });
        setColumns(newColumns);
        await setTableData(data);
        await setPage(data, 1);
      })
      .catch((error) => console.log(error));

    await setLoading(false);
  };

  const setPage = (data, page) => {
    var list = [];
    var startIndex = (page - 1) * pageSize;
    var endIndex;
    if (data.length - page * pageSize > 0) {
      endIndex = startIndex + pageSize - 1;
    } else {
      endIndex = data.length - startIndex - 1;
    }
    for (let i = startIndex; i <= endIndex; i++) {
      list.push(data[i]);
    }
    setTablePage(list);
  };

  return (
    <Layout>
      <Header>
        <Row gutter={16}>
          <Col>
            <DatePicker.RangePicker
              onChange={(e) => setRangeDate(e)}
              value={rangeDate}
              format={formatDate}
            />
          </Col>
          <Col>
            <Button onClick={() => Statisticals(rangeDate)}>Thống kê</Button>
          </Col>
        </Row>
      </Header>
      <Content style={{ margin: 5 }}>
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={tablePage}
          pagination={{
            pageSize: pageSize,
            total:
              tableData !== [] ? Math.ceil(tableData.length / pageSize) : 1,
            onChange: (pageNumber) => setPage(tableData, pageNumber),
          }}
          scroll={{ y: 400, x: true }}
          bordered={true}
        />
      </Content>
    </Layout>
  );
}
