import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  TimePicker,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { WEB_SERVER_URL } from "../../../config/serverURL";
import { BEARER_TOKEN } from "../../../config/auth";
import moment from "moment";

moment.locale("vi");
const formatHour = "HH:mm";
const formatDate = "DD-MM-yyyy";

const CreateSchedules = () => {
  const [departmentsList, setDepartmentsList] = useState([]);
  const [shiftsList, setShiftsList] = useState([]);
  const [calendarList, setCalendarList] = useState([]);
  const [selectRow, setSelectRow] = useState(null);

  const [calendarDate, setCalendarDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  // dùng cho modal add
  const [visibleModalAdd, setVisibleModalAdd] = useState(false);
  const [visibleModalResult, setVisibleModalResult] = useState(false);
  const [visibleModalEdit, setVisibleModalEdit] = useState(false);

  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  const [formSetupShifts] = Form.useForm();

  const columns = [
    {
      title: "Ngày",
      key: "date",
      dataIndex: "date",
      width: "10%",
      render: (text) => {
        return (
          <span style={{ fontWeight: "600" }}>
            {moment(text).format(formatDate)}
          </span>
        );
      },
    },
    {
      title: "Bộ phận",
      key: "departments",
      dataIndex: "departments",
      width: "40%",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let text;
            departmentsList.forEach((item) => {
              if (item.value === tag) text = item.label;
            });
            return <Tag color="cyan">{text}</Tag>;
          })}
        </>
      ),
    },
    {
      title: "Ca làm",
      key: "shifts",
      dataIndex: "shifts",
      width: "40%",
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
              onClick={() => editCalendar(record)}
            />
            <Popconfirm
              overlayInnerStyle={{ width: 300 }}
              okText="Đồng ý"
              cancelText="Đóng"
              title="Bạn chắc chứ?"
              onConfirm={() => deleteCalendar(record)}
            >
              <Button
                danger
                type="dashed"
                icon={<DeleteOutlined />}
                style={{ fontWeight: "600" }}
              ></Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  // lấy API bộ phận, chức vụ 1 lần
  useEffect(() => {
    axios
      .get(
        `${WEB_SERVER_URL}/departments/getdepartments?page=1&pageSize=500`,
        BEARER_TOKEN
      )
      .then((response) => {
        let selectList = response.data.results.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        setDepartmentsList(selectList);
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    getAllCalendar(1);
  }, [refresh]);
  // lấy API theo phân trang
  const getAllCalendar = (page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/departmentcalendar/getAlldepartmentCalendar?page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        let results = response.data.results;
        setCalendarList(results);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  const searchCalendar = (text, page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/departmentcalendar/searchdepartmentCalendar?search=${text}`,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          const newList = response.data.results;
          setCalendarList(newList);
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };

  // Xử menu cho <Select/> shifts
  const [chooseDepartment, setChooseDepartment] = useState([]);
  const [chooseShift, setChooseShift] = useState([]); // giá trị được điền trong select
  const [itemsSelectShift, setItemsSelectShift] = useState([]); // Select.option
  const [newShift, setNewShift] = useState([]); // value tạo mới item cho itemsSelectShift
  const [visibleMenuSelect, setVisibleMenuSelect] = useState(false); // controll turn on , turn off menu
  const [visibleBtnAddNewShift, setVisibleBtnAddNewShift] = useState(true); // ẩn Button thêm mới newShift khi đang điền
  //thêm item cho menu select
  const addItemSelectShift = (e) => {
    // console.log(typeof newShift[0].toString());
    if (newShift !== null) {
      e.preventDefault();
      const lableShift = `${moment(newShift[0]).format(formatHour)}-${moment(
        newShift[1]
      ).format(formatHour)}`;
      setItemsSelectShift([
        ...itemsSelectShift,
        {
          label: lableShift,
          value: lableShift,
        },
      ]);
      setShiftsList([
        ...shiftsList,
        {
          label: lableShift,
          value: newShift,
        },
      ]);
      setNewShift(null);
    }
  };

  const onSelectShift = (optione) => {
    setChooseShift([...chooseShift, optione]);
  };
  const onDeselectShift = (optione) => {
    let newList = chooseShift.filter((item) => item !== optione);
    setChooseShift(newList);
  };

  const onSelectDepartment = (optione) => {
    let newDepartment = departmentsList.filter(
      (item) => item.value === optione
    )[0];
    setChooseDepartment([...chooseDepartment, newDepartment]);
  };
  const onDeselectDepartment = (optione) => {
    let newList = chooseDepartment.filter((item) => item.value !== optione);
    setChooseDepartment(newList);
  };

  const renderTableInput = () => {
    return chooseShift.map((item) => {
      let departmentIndex = 0;
      return {
        title: `ca ${item}`,
        render: (dataIndex) => {
          let index = departmentIndex;
          departmentIndex = departmentIndex + 1;
          return (
            <Form.Item
              key={item}
              name={`${item}-${index}`}
              initialValue={0}
              style={{
                margin: 0,
              }}
              rules={[
                {
                  required: true,
                  message: `Chưa nhập`,
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
          );
        },
      };
    });
  };

  const columnsModal = [
    {
      title: "Bộ phận",
      dataIndex: "label",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
  ].concat(chooseShift ? renderTableInput() : null);

  const parseCalendar = (quantity, date) => {
    let shifts = [];
    // parse Form value => {in,out, quantity}
    Object.entries(quantity).forEach(([key, value]) => {
      let inout = shiftsList.filter((item) => key.includes(item.label))[0];
      shifts.push({
        in: inout.value[0],
        out: inout.value[1],
        quantity: value,
        still: value,
        sort: Number(key[key.length - 1]),
      });
    });
    // gắn department vào calendar theo sort(sort là hàng 1-3-5)
    let calendar = [];
    let sort = -1;
    chooseDepartment.forEach((item, index) => {
      let departmentShift = [];
      sort += 2;
      shifts.forEach((shift, indexShift) => {
        if (shift.sort === sort) {
          departmentShift.push(shifts[indexShift]);
        }
      });
      calendar.push({
        date: date,
        departmentId: item.value,
        shifts: departmentShift,
      });
    });
    return calendar;
  };

  const createCalendar = (quantity) => {
    if (calendarDate !== "") {
      const data = parseCalendar(quantity, calendarDate);
      axios.post(
        `${WEB_SERVER_URL}/departmentcalendar/createdepartmentCalendar`,
        data,
        BEARER_TOKEN
      );
      message.success("Tạo thành công");
      setRefresh(!refresh);
      setVisibleModalResult(true);
    } else {
      formSetupShifts.submit();
      message.success("Chưa nhập ngày");
    }
  };

  const editCalendar = (record) => {
    setSelectRow(record);
    let setFieldDepartment = departmentsList.filter((item) =>
      record.departments.includes(item.value)
    );
    let setFieldShift = [];
    let setShiftList = [];
    let editShift = [];
    record.shifts.forEach((item) => {
      let time = `${moment(item.in).format(formatHour)}-${moment(
        item.out
      ).format(formatHour)}`;
      setFieldShift.push(time);
      editShift.push({
        label: time,
        value: time,
      });
      setShiftList.push({
        label: time,
        value: [item.in, item.out],
      });
    });
    setItemsSelectShift(editShift); // Select.option
    setChooseShift(setFieldShift); //set column theo shifts đã có
    setShiftsList(setShiftList); // Lưu giá trị ngày in out vì Select.option k nhận value là mảng.
    setChooseDepartment(setFieldDepartment);
    // console.log(record);
    formSetupShifts.setFieldValue("departments", record.departments);
    formSetupShifts.setFieldValue("date", moment(record.date));
    formSetupShifts.setFieldValue("shifts", setFieldShift);
    // set value cho các ô quantity
    record.shiftsList.forEach((arr) => {
      arr.forEach((item) => {
        let fieldName = `${moment(item.in).format(formatHour)}-${moment(
          item.out
        ).format(formatHour)}-${item.sort}`;
        formEdit.setFieldValue(fieldName, item.quantity);
      });
    });
    setVisibleModalEdit(true);
  };

  const updateCalendar = (quantity) => {
    const data = parseCalendar(quantity, selectRow.date);
    axios.patch(
      `${WEB_SERVER_URL}/departmentcalendar/updatedepartmentCalendar`,
      { uid: selectRow.uid, data: data },
      BEARER_TOKEN
    );
    message.success("Cập nhật thành công");
    setRefresh(!refresh);
    setVisibleModalEdit(false);
  };

  const deleteCalendar = (record) => {
    console.log(record);
    let query = "";
    record.uid.forEach((item) => (query += " " + item));
    axios
      .delete(
        `${WEB_SERVER_URL}/departmentcalendar/deletedepartmentCalendar?uid=${query}`,
        BEARER_TOKEN
      )
      .then((results) => {
        message.success("Xoá thành công");
        setRefresh(!refresh);
      });
  };

  return (
    <div style={{ margin: 5 }}>
      <Row justify="space-around" style={{ margin: 10 }}>
        <Col span={12}>
          <DatePicker
            value={search}
            onChange={(value) => setSearch(value)}
            format={formatDate}
          />
          <Button type="primary" onClick={() => searchCalendar(search, 1)}>
            Tìm kiếm
          </Button>
        </Col>
        <Col span={4} justify={"end"}>
          <Button type="primary" onClick={() => setVisibleModalAdd(true)}>
            Tạo lịch làm
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={calendarList}
        pagination={{
          pageSize: pageSize,
          total: totalPages,
          onChange: (pageNumber) => {
            search
              ? searchCalendar(search, pageNumber)
              : getAllCalendar(pageNumber);
          },
        }}
        scroll={{ y: 360 }}
      />

      <Modal
        title="Tạo lịch làm"
        open={visibleModalAdd}
        onOk={() => {
          formAdd.submit();
        }}
        onCancel={() => {
          setVisibleModalAdd(false);
        }}
        footer={[
          <Button onClick={formAdd.submit} type="primary">
            Tạo lịch làm
          </Button>,
        ]}
        width={"90%"}
      >
        {/* Form setup bộ phận và ca làm việc cho lịch làm */}
        <Form
          form={formSetupShifts}
          name="add"
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={(value) => console.log(value)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Ngày làm việc"
            name="date"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <DatePicker
              value={calendarDate}
              onChange={(value) => setCalendarDate(value)}
              format={formatDate}
            />
          </Form.Item>
          <Form.Item
            label="Bộ phận"
            name="departments"
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
              placeholder="Chọn bộ phận"
              options={departmentsList}
              onDeselect={(optionValue) => onDeselectDepartment(optionValue)}
              onSelect={(optionValue) => onSelectDepartment(optionValue)}
            />
          </Form.Item>

          <Form.Item
            label="Chọn ca làm"
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
              onDeselect={(optionValue) => onDeselectShift(optionValue)}
              onSelect={(optionValue) => onSelectShift(optionValue)}
              onFocus={() => setVisibleMenuSelect(true)}
              open={visibleMenuSelect}
              onDropdownVisibleChange={() => setVisibleMenuSelect(true)}
              options={itemsSelectShift}
              dropdownRender={(menu) => (
                <>
                  <Row justify="end">
                    <Button
                      // size="small"
                      type="text"
                      onClick={() => setVisibleMenuSelect(false)}
                      icon={<CloseSquareOutlined size="small" />}
                    />
                  </Row>
                  <Divider
                    style={{
                      margin: "4px 0",
                    }}
                  />
                  {menu}
                  <Divider
                    style={{
                      margin: "4px 0",
                    }}
                  />
                  <Space
                    style={{
                      padding: "0 8px 4px",
                    }}
                  >
                    <TimePicker.RangePicker
                      format={formatHour}
                      value={newShift}
                      onChange={(event) => {
                        setNewShift(event);
                      }}
                      onOpenChange={() =>
                        setVisibleBtnAddNewShift(!visibleBtnAddNewShift)
                      }
                    />
                    {visibleBtnAddNewShift ? (
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={addItemSelectShift}
                      >
                        Thêm ca làm
                      </Button>
                    ) : (
                      ""
                    )}
                  </Space>
                </>
              )}
            />
          </Form.Item>
        </Form>

        {/* Chọn số lượng nhân viên cho ca làm */}
        <Form
          form={formAdd}
          component={false}
          // initialValues={{}}
          onFinish={(value) => createCalendar(value)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
        >
          <Table
            bordered
            dataSource={chooseDepartment}
            columns={columnsModal}
            rowClassName="editable-row"
            pagination={false}
          />
        </Form>
      </Modal>
      {/* modal xác nhận tiếp tục tạo lịch làm hay thoát */}
      <Modal
        open={visibleModalResult}
        title="Bạn có muốn tiếp tục tạo lịch làm không ?"
        footer={[
          <Button
            key="back"
            onClick={() => {
              setVisibleModalAdd(false);
              setVisibleModalResult(false);
            }}
          >
            Thoát
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              setVisibleModalResult(false);
            }}
          >
            Tiếp tục tạo lịch làm
          </Button>,
        ]}
      ></Modal>

      {/* Update lịch làm */}
      <Modal
        title="Chỉnh sửa lịch làm"
        open={visibleModalEdit}
        onOk={() => {
          formEdit.submit();
        }}
        onCancel={() => {
          setVisibleModalEdit(false);
        }}
        footer={[
          <Button onClick={formEdit.submit} type="primary">
            Cập nhật lịch làm
          </Button>,
        ]}
        width={"90%"}
      >
        {/* Form setup bộ phận và ca làm việc cho lịch làm */}
        <Form
          form={formSetupShifts}
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={(value) => console.log(value)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Ngày làm việc"
            name="date"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <DatePicker
              value={calendarDate}
              onChange={(value) => setCalendarDate(value)}
              format={formatDate}
              disabled={true}
            />
          </Form.Item>
          <Form.Item
            label="Bộ phận"
            name="departments"
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
              placeholder="Chọn bộ phận"
              options={departmentsList}
              onDeselect={(optionValue) => onDeselectDepartment(optionValue)}
              onSelect={(optionValue) => onSelectDepartment(optionValue)}
            />
          </Form.Item>

          <Form.Item
            label="Chọn ca làm"
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
              onDeselect={(optionValue) => onDeselectShift(optionValue)}
              onSelect={(optionValue) => onSelectShift(optionValue)}
              onFocus={() => setVisibleMenuSelect(true)}
              open={visibleMenuSelect}
              onDropdownVisibleChange={() => setVisibleMenuSelect(true)}
              options={itemsSelectShift}
              dropdownRender={(menu) => (
                <>
                  <Row justify="end">
                    <Button
                      // size="small"
                      type="text"
                      onClick={() => setVisibleMenuSelect(false)}
                      icon={<CloseSquareOutlined size="small" />}
                    />
                  </Row>
                  <Divider
                    style={{
                      margin: "4px 0",
                    }}
                  />
                  {menu}
                  <Divider
                    style={{
                      margin: "4px 0",
                    }}
                  />
                  <Space
                    style={{
                      padding: "0 8px 4px",
                    }}
                  >
                    <TimePicker.RangePicker
                      format={formatHour}
                      value={newShift}
                      onChange={(event) => {
                        setNewShift(event);
                      }}
                      onOpenChange={() =>
                        setVisibleBtnAddNewShift(!visibleBtnAddNewShift)
                      }
                    />
                    {visibleBtnAddNewShift ? (
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={addItemSelectShift}
                      >
                        Thêm ca làm
                      </Button>
                    ) : (
                      ""
                    )}
                  </Space>
                </>
              )}
            />
          </Form.Item>
        </Form>

        {/* Chọn số lượng nhân viên cho ca làm */}
        <Form
          form={formEdit}
          component={false}
          // initialValues={{}}
          onFinish={(value) => updateCalendar(value)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
        >
          <Table
            bordered
            dataSource={chooseDepartment}
            columns={columnsModal}
            rowClassName="editable-row"
            pagination={false}
          />
        </Form>
      </Modal>
    </div>
  );
};
export default CreateSchedules;
