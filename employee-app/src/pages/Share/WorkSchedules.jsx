import React, { useState, useEffect } from "react";
import { Button, Table, Input, DatePicker, Tag, Row, Col, Divider } from "antd";
import axios from "axios";
import moment from "moment";
import { WEB_SERVER_URL } from "../../config/serverURL";
import { BEARER_TOKEN } from "../../config/auth";

moment.locale("vi");

export default function WorkSchedules() {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [calendarList, setCalendarList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const formatDate = "DD/MM/yyyy";
  const formatHour = "HH:mm";

  // lấy API bộ phận, chức vụ 1 lần
  useEffect(() => {
    getCalendarList(page);
    axios
      .get(
        `${WEB_SERVER_URL}/departments/getdepartments?page=1&pageSize=500`,
        BEARER_TOKEN
      )
      .then((response) => {
        setDepartmentsList(response.data.results);
      })
      .catch((error) => console.log(error));
  }, []);

  // lấy API theo phân trang
  const getCalendarList = (page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/utilities/getworkschedules?page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        let calendarList = response.data.calendarList;
        console.log(calendarList);
        setCalendarList(calendarList);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const renderColumns = (shifts) => {
    return shifts.map((item) => {
      return {
        title: `ca ${item}`,
        dataIndex: `${item}`,
        render: (tags) => (
          <>
            {tags?.map((tag) => (
              <Tag color="cyan">{tag}</Tag>
            ))}
          </>
        ),
      };
    });
  };
  const renderCalendar = (data) => {
    let shifts = data?.shifts?.map(
      (item) =>
        `${moment(item.in).format(formatHour)}-${moment(item.out).format(
          formatHour
        )}`
    );
    //['shift1', 'shift2']
    const columns = [
      {
        title: "Bộ phận",
        dataIndex: "department",
        // fixed: "left",
        render: (text) => {
          return <span style={{ fontWeight: "600" }}>{text}</span>;
        },
      },
    ].concat(shifts ? renderColumns(shifts) : null);

    // xử lý calendar từ API thành định dạng data cho table (column)
    let tableData = data?.departments?.map((item, index) => {
      let dpt = departmentsList.filter((i) => i._id === item);
      // lấy tên bộ phận theo _id = item
      let array = [["department", dpt[0]?.name]];
      shifts.forEach((i2) => {
        let shift = [i2, []];
        data?.usersShifts[index]?.forEach((i3) => {
          let label = `${moment(i3?.in).format(formatHour)}-${moment(
            i3?.out
          ).format(formatHour)}`;
          if (i2 === label) {
            shift[1].push(i3?.fullname);
          }
        });

        array.push(shift);
      });

      return Object.fromEntries(array);
    });

    return (
      <div key={data._id}>
        <b>
          {`Lịch làm ngày ${moment(data._id).format(formatDate)}`.toUpperCase()}
        </b>
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={tableData}
          pagination={false}
          scroll={{ x: 600 }}
        />
        <Divider></Divider>
      </div>
    );
  };

  const searchCalendar = (date) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/utilities/searchworkschedules?search=${date}`,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          const newList = response.data.calendarList;
          setCalendarList(newList);
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <Row
        justify="space-between"
        wrap={false}
        style={{ margin: "10px 2px 0 2px" }}
      >
        <Col>
          <DatePicker
            value={search}
            onChange={(value) => {
              setSearch(value);
            }}
            format={formatDate}
          />
          <Button
            type="primary"
            onClick={() => {
              setIsSearch(true);
              searchCalendar(search);
            }}
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
                getCalendarList(page);
              }}
            >
              Thoát tìm kiếm
            </Button>
          </Col>
        ) : null}
      </Row>
      <Divider style={{ magin: 1 }}></Divider>

      {/* Render calendar */}
      <div
        style={{
          height: "75vh",
          overflowY: "auto",
        }}
      >
        {calendarList === []
          ? "Trống"
          : calendarList.map((item) => renderCalendar(item))}
      </div>

      {/* Render footer */}
      {isSearch ? null : (
        <Row
          justify={page > 1 ? "space-between" : "end"}
          style={{ marginRight: 5, marginBottom: 5 }}
        >
          {page > 1 ? (
            <Button
              type="primary"
              onClick={() => {
                let newpage = page - 1;
                getCalendarList(newpage);
                setPage(newpage);
              }}
            >
              Trang trước
            </Button>
          ) : null}
          {calendarList.length < pageSize ? null : (
            <Button
              type="primary"
              onClick={() => {
                let newpage = page + 1;
                getCalendarList(newpage);
                setPage(newpage);
              }}
            >
              Trang tiếp theo
            </Button>
          )}
        </Row>
      )}
    </div>
  );
}
