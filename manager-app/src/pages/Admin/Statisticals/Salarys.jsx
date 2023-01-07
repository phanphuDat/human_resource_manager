import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Layout,
  Row,
  Table,
} from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useState } from "react";
import moment from "moment";
import axios from "axios";
import { BiAlarm, BiSad, BiWinkSmile, BiDollarCircle } from "react-icons/bi";
import { WEB_SERVER_URL } from "../../../config/serverURL";
import { BEARER_TOKEN } from "../../../config/auth";

moment.locale("vi");

export default function Salarys() {
  const [loading, setLoading] = useState(false);
  const [rangeDate, setRangeDate] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  const [worlTotal, setWorlTotal] = useState(0);
  const [bonusTotal, setBonusTotal] = useState(0);
  const [punishTotal, setPunishTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);

  // data lấy từ API về
  const [tableData, setTableData] = useState([]);
  // phân trang từ tableData
  const [tablePage, setTablePage] = useState([]);

  const formatDate = "DD-MM-yyyy";

  const columns = [
    {
      title: "Ảnh",
      key: "avatarUrl",
      dataIndex: "avatarUrl",
      // width: "5%",
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
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Số ca làm",
      key: "userShift",
      dataIndex: "userShift",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text.toFixed(2)}</span>;
      },
    },
    {
      title: "Số giờ làm",
      key: "work",
      dataIndex: "work",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text.toFixed(2)}</span>;
      },
    },
    {
      title: "Thưởng",
      key: "bonus",
      dataIndex: "bonus",
      // width: "40%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Phạt",
      key: "punish",
      dataIndex: "punish",
      // width: "40%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Mức lương",
      key: "salary",
      dataIndex: "salary",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}/giờ</span>;
      },
    },
    {
      title: "Lương (vnđ)",
      key: "totals",
      dataIndex: "totals",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{Math.ceil(text)}</span>;
      },
    },
  ];

  const Statisticals = (time) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/utilities/managergetsalarys?start=${time[0]}&end=${time[1]}`,
        BEARER_TOKEN
      )
      .then(async (results) => {
        console.log(results.data);
        const data = await results.data.map((item) => {
          let row = [
            ["avatarUrl", item.avatarUrl],
            ["fullname", item.fullname],
            ["salary", item.salary],
          ];
          let userShift = 0;
          let work = 0;
          let bonus = 0;
          let punish = 0;
          item.userShifts.forEach((shift) => {
            userShift += 1;
            let hour =
              moment(shift.timeOut).hour() - moment(shift.timeIn).hour();
            let minute =
              moment(shift.timeOut).minute() - moment(shift.timeIn).minute();
            work += hour + minute / 60;
          });
          item.Bonus.forEach((money) => {
            if (money.money >= 0) {
              bonus += money.money;
            } else punish += money.money;
          });

          row.push(
            ["userShift", userShift],
            ["work", work],
            ["bonus", bonus],
            ["punish", punish],
            ["totals", work * item.salary]
          );
          return Object.fromEntries(row);
        });
        await setTableData(data);
        await setPage(data, 1);
        setLoading(false);
      })
      .catch((error) => console.log(error));
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
        <div style={{ margin: "5px 20px 10px 20px" }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card
                style={{
                  borderRadius: 16,
                  backgroundColor: "#2196f3",
                }}
                title={
                  <Row style={{ padding: 0 }}>
                    <Col>
                      <BiAlarm
                        size={30}
                        style={{ backgroundColor: "#2196f3", color: "#fff" }}
                      />
                    </Col>
                    <Col>
                      &emsp;<strong>Số giờ</strong>
                    </Col>
                  </Row>
                }
              >
                <b style={{ color: "#333" }}>{`${worlTotal.toFixed(2)} giờ`}</b>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                style={{
                  borderRadius: 16,
                  backgroundColor: "#e9dd3b",
                }}
                title={
                  <Row style={{ padding: 0 }}>
                    <Col>
                      <BiWinkSmile
                        size={30}
                        style={{ backgroundColor: "#e9dd3b", color: "#fff" }}
                      />
                    </Col>
                    <Col>
                      &emsp;<strong>Thưởng</strong>
                    </Col>
                  </Row>
                }
              >
                <b style={{ color: "#333" }}>{`${Math.ceil(
                  bonusTotal
                )} đồng`}</b>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                style={{
                  borderRadius: 16,
                  backgroundColor: "#ca2e2e",
                }}
                title={
                  <Row style={{ padding: 0 }}>
                    <Col>
                      <BiSad
                        size={30}
                        style={{ backgroundColor: "#ca2e2e", color: "#fff" }}
                      />
                    </Col>
                    <Col>
                      &emsp;<strong>Phạt</strong>
                    </Col>
                  </Row>
                }
              >
                <b style={{ color: "#333" }}>{`${Math.ceil(
                  punishTotal
                )} đồng`}</b>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                style={{
                  borderRadius: 16,
                  backgroundColor: "#26bd00",
                }}
                title={
                  <Row style={{ padding: 0 }}>
                    <Col>
                      <BiDollarCircle
                        size={30}
                        style={{ backgroundColor: "#26bd00", color: "#fff" }}
                      />
                    </Col>
                    <Col>
                      &emsp;<strong>Lương</strong>
                    </Col>
                  </Row>
                }
              >
                <b style={{ color: "#333" }}>{`${Math.ceil(
                  salaryTotal
                )} đồng`}</b>
              </Card>
            </Col>
          </Row>
        </div>
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
          scroll={{ y: 220 }}
        />
      </Content>
    </Layout>
  );
}
