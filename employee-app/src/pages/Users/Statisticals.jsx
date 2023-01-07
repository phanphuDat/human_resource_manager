import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Layout,
  Row,
  Table,
  Tag,
} from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { BiAlarm, BiSad, BiWinkSmile, BiDollarCircle } from "react-icons/bi";
import { WEB_SERVER_URL } from "../../config/serverURL";
import { BEARER_TOKEN, USER_ID } from "../../config/auth";
import Meta from "antd/lib/card/Meta";

moment.locale("vi");
const formatDate = "DD/MM/yyyy";
const formatHour = "HH:mm";

export default function Statisticals() {
  const [loading, setLoading] = useState(false);
  const [rangeDate, setRangeDate] = useState([]);

  const [user, setUser] = useState({});
  const [inoutList, setInoutList] = useState([]);
  const [bonusList, setBonusList] = useState([]);

  const [worlTotal, setWorlTotal] = useState("0");
  const [bonusTotal, setBonusTotal] = useState("0");
  const [punishTotal, setPunishTotal] = useState("0");
  const [salaryTotal, setSalaryTotal] = useState("0");

  const InoutColumns = [
    {
      title: "Ngày",
      key: "date",
      dataIndex: "date",
      render: (text) => {
        return (
          <span style={{ fontWeight: "600" }}>
            {moment(new Date(text)).format(formatDate)}
          </span>
        );
      },
    },
    {
      title: "Vào(giờ)",
      key: "shift",
      dataIndex: "shift",
      // width: "40%",
      render: (time) => (
        <Tag color="cyan">{`${moment(time[0]).format(formatDate)}-${moment(
          time[1]
        ).format(formatDate)}`}</Tag>
      ),
    },
    {
      title: "Ra(giờ)",
      key: "timeIn",
      dataIndex: "timeIn",
      // width: "40%",
      render: (text) => {
        return (
          <span style={{ fontWeight: "600" }}>
            {moment(text).format(formatHour)}
          </span>
        );
      },
    },
    {
      title: "Ra(giờ)",
      key: "timeOut",
      dataIndex: "timeOut",
      // width: "40%",
      render: (text) => {
        return (
          <span style={{ fontWeight: "600" }}>
            {moment(text).format(formatHour)}
          </span>
        );
      },
    },
    {
      title: "Giờ công(giờ)",
      key: "work",
      dataIndex: "work",
      // width: "40%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
  ];

  const bonusColumns = [
    {
      title: "Thời gian",
      key: "date",
      dataIndex: "date",
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
      // width: "40%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Số tiền",
      key: "money",
      dataIndex: "money",
      // width: "40%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
  ];

  const Statisticals = (time) => {
    // console.log(time);
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/utilities/usergetsalary/${USER_ID}?start=${time[0]}&end=${time[1]}`,
        BEARER_TOKEN
      )
      .then(async (results) => {
        // console.log(results.data);
        let shift = results.data.userShifts;
        let bonus = results.data.bonus;
        let dayOff = results.data.dayOff;
        let totalWork = 0;
        let totalBonus = 0;
        let totalPunish = 0;
        let newList = shift.map((element) => {
          let hour =
            moment(element.timeOut).hour() - moment(element.timeIn).hour();
          let minute =
            moment(element.timeOut).minute() - moment(element.timeIn).minute();
          let work = hour + minute / 60;
          totalWork += work;
          return {
            date: element.date,
            shift: [element.in, element.out],
            timeIn: element.timeIn,
            timeOut: element.timeOut,
            work: work,
          };
        });
        bonus.forEach((element) => {
          if (element.money > 0) {
            totalBonus += element.money;
          } else totalPunish += element.money;
        });

        await setBonusList(bonus);
        await setInoutList(newList);

        // state kết quả

        await setWorlTotal(totalWork);
        await setBonusTotal(totalBonus);
        await setPunishTotal(totalPunish);
        console.log(totalWork, totalBonus, totalPunish);
        await setSalaryTotal(
          totalWork * results.data.salary + totalBonus + totalPunish
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  return (
    <Layout>
      <Header style={{ padding: "0 5px" }}>
        <Row gutter={5} align="middle" justify={"space-between"}>
          <Col span={17}>
            <DatePicker.RangePicker
              onChange={(e) => setRangeDate(e)}
              value={rangeDate}
              format={formatDate}
            />
          </Col>
          <Col span={6}>
            <Button
              onClick={() => Statisticals(rangeDate)}
              style={{ marginLeft: -10 }}
            >
              Thống kê
            </Button>
          </Col>
        </Row>
      </Header>
      <Content
        style={{
          height: "75vh",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "97%", margin: "5px" }}>
          <Row gutter={5}>
            <Col span={12}>
              <Card
                style={{
                  borderRadius: 16,
                  backgroundColor: "#2196f3",
                }}
                title={
                  <Row style={{ padding: 0 }}>
                    <Col>
                      <BiWinkSmile
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
                <b style={{ color: "#333" }}>{`${
                  worlTotal
                  // ?.toFixed(2)
                } giờ`}</b>
              </Card>
            </Col>
            <Col span={12}>
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
          </Row>
          <Row gutter={5}>
            <Col span={12}>
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
            <Col span={12}>
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
          columns={InoutColumns}
          dataSource={inoutList}
          scroll={{
            x: 800,
            y: 200,
          }}
        />
        <Table
          rowKey="_id"
          loading={loading}
          columns={bonusColumns}
          dataSource={bonusList}
          scroll={{
            y: 200,
          }}
        />
      </Content>
    </Layout>
  );
}
