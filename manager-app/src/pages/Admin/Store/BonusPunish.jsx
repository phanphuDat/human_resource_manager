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
import { BEARER_TOKEN } from "../../../config/auth";
import TextArea from "antd/lib/input/TextArea";
const { Search } = Input;

export default function BonusPunish() {
  const columns = [
    {
      title: "Thời gian",
      key: "date",
      dataIndex: "date",
      width: "10%",
      render: (text) => {
        return (
          <span style={{ fontWeight: "600" }}>
            {moment(new Date(text)).format("DD/MM/YYYY")}
          </span>
        );
      },
    },
    {
      title: "Ảnh",
      key: "avatarUrl",
      dataIndex: "avatarUrl",
      width: "5%",
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
      width: "15%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Lý do",
      key: "reason",
      dataIndex: "reason",
      // width: "35%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Số tiền",
      key: "money",
      dataIndex: "money",
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
              onClick={() => editBonus(record)}
              // onClick={() => console.log(record)}
            />
            <Popconfirm
              overlayInnerStyle={{ width: 300 }}
              okText="Đồng ý"
              cancelText="Đóng"
              title="Bạn chắc chứ?"
              onConfirm={() => deleteBonus(record)}
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
  const Usercolumns = [
    {
      title: "Ảnh",
      key: "avatarUrl",
      dataIndex: "avatarUrl",
      width: "1%",
      render: (text) => {
        return (
          <div>
            {text && (
              <img
                src={`${WEB_SERVER_URL}${text}`}
                style={{ width: 60 }}
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
      // width: "40%",
      render: (text) => {
        return <span style={{ fontWeight: "600" }}>{text}</span>;
      },
    },
    {
      title: "Chọn",
      key: "actions",
      width: "1%",
      render: (record) => {
        return (
          <Checkbox
            defaultChecked={false}
            onChange={(checked) =>
              isChooseUsers(checked.target.checked, record)
            }
          />
        );
      },
    },
  ];

  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [bonusList, setBonusList] = useState([]);
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

  const [formEdit] = Form.useForm();
  const [formAdd] = Form.useForm();

  // lấy API bộ phận, chức vụ 1 lần
  useEffect(() => {
    getAllBonus(1);
  }, []);

  // lấy API theo phân trang
  const getAllBonus = (page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/bonuspunishs/getbonuspunishs?page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        setBonusList(response.data.results);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  // Hỗ trợ cho chức năng tạo Bonus
  const searchUsers = (text, page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/users/getusers?search=${text}&page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          const newList = response.data.results;
          setUsers(newList);
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };
  const isChooseUsers = (choose, record) => {
    let newChoose;
    if (choose) {
      newChoose = [
        {
          value: record._id,
          label: record.fullname,
          avatarUrl: record.avatarUrl,
        },
        ...chooseUsers,
      ];
    } else newChoose = chooseUsers.filter((item) => item.value !== record._id);
    setChooseUsers(newChoose);
  };

  const addBonus = (value) => {
    let list = [];
    value.users.forEach((item) =>
      list.push({
        userId: item,
        date: value.date,
        reason: value.reason,
        money: value.money,
      })
    );
    axios
      .post(
        `${WEB_SERVER_URL}/bonuspunishs/createbonuspunishs`,
        list,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          list.forEach((item, index) => {
            item._id = response.data.results.insertedIds[index];
            chooseUsers.forEach((item2) => {
              if (item2.value === item.userId) {
                item.fullname = item2.label;
                item.avatarUrl = item2.avatarUrl;
              }
            });
          });
          const newList = [...bonusList, ...list];
          setVisibleFormAdd(false);
          setBonusList(newList);
          message.success("Tạo thành công");
        } else message.error("Tạo thất bại");
      });
  };

  const searchBonus = (text, page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/bonuspunishs/searchbonuspunishs?search=${text}&page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          const newList = response.data.results;
          setBonusList(newList);
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const editBonus = (record) => {
    setVisibleFormEdit(true);
    setSelectedRow(record);
    // Object.entries(record).forEach(([key, value]) =>
    //   formEdit.setFieldValue(key, value)
    // );
  };

  const updateBonus = (values) => {
    const id = selectedRow._id;
    const data = values;
    axios
      .patch(
        `${WEB_SERVER_URL}/bonuspunishs/updatebonuspunish/${id}`,
        data,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          setVisibleFormEdit(false);
          const newList = bonusList.map((item) => {
            if (item._id === id) {
              return { _id: id, avatarUrl: selectedRow.avatarUrl, ...values };
            } else return item;
          });
          setBonusList(newList);
          console.log(newList);
          message.success("Update thành công");
        } else message.error("Update thất bại");
      });
  };

  const deleteBonus = (record) => {
    const { _id } = record;
    axios
      .delete(
        `${WEB_SERVER_URL}/bonuspunishs/deletebonuspunish/${_id}`,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          const newList = bonusList.filter((item) => item._id !== _id);
          setBonusList(newList);
          message.success("Xóa thành công");
        } else message.error("Xóa thất bại");
      });
  };

  return (
    <Layout>
      <Layout.Content style={{ margin: 5 }}>
        <Row justify="space-around" style={{ margin: "5px 0 10px 0" }}>
          <Col span={10}>
            <Search
              placeholder="Nhập từ khoá tìm kiếm"
              allowClear
              value={search}
              loading={loading}
              enterButton="Search"
              size="middle"
              onChange={(text) => setSearch(text.target.value)}
              onSearch={() => searchBonus(search, 1)}
            />
          </Col>
          <Col span={4} justify={"end"}>
            <Button
              type="primary"
              size="middle"
              onClick={() => setVisibleFormAdd(true)}
            >
              Thêm mới
            </Button>
          </Col>
        </Row>

        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={bonusList}
          pagination={{
            pageSize: pageSize,
            total: totalPages,
            onChange: (pageNumber) => {
              search
                ? searchBonus(search, pageNumber)
                : getAllBonus(pageNumber);
            },
          }}
          scroll={{ y: 360 }}
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
          <Search
            placeholder="Nhập từ khoá tìm kiếm"
            allowClear
            value={searchUser}
            loading={loading}
            enterButton="Search"
            size="large"
            onChange={(text) => setSearchUser(text.target.value)}
            onSearch={() => searchUsers(searchUser, 1)}
          />
          <Table
            rowKey="_id"
            loading={loading}
            columns={Usercolumns}
            dataSource={users}
            pagination={{
              pageSize: pageSize,
              total: totalPages,
              onChange: (pageNumber) => {
                searchUsers(searchUser, pageNumber);
              },
            }}
          />
          <Form
            form={formAdd}
            name="add"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            onFinish={(value) => addBonus(value)}
            onFinishFailed={(error) => {
              message.error(error);
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Nhân viên"
              name="users"
              hasFeedback
              // initialValue={chooseUsers && chooseUsers.map(item => item.value) }
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Chọn nhân viên"
                defaultValue={
                  chooseUsers && chooseUsers.map((item) => item.value)
                }
                options={chooseUsers}
              />
            </Form.Item>
            <Form.Item
              label="Ngày"
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
                format={(value) => moment(new Date(value)).format("DD/MM/YYYY")}
              />
            </Form.Item>
            <Form.Item
              label="Lý do"
              name={"reason"}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item
              label="Số tiền"
              name="money"
              hasFeedback
              initialValue={10000}
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <InputNumber addonAfter="vnđ" />
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
            onFinish={(values) => updateBonus(values)}
            onFinishFailed={(error) => {
              message.error(error);
            }}
            autoComplete="off"
          >
            <Form.Item label="Họ và tên" name="fullname">
              <Input disabled={true} />
            </Form.Item>
            <Form.Item
              label="Ngày"
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
                // onChange={value=>value}
                format={(value) => moment(new Date(value)).format("DD/MM/YYYY")}
              />
            </Form.Item>
            <Form.Item
              label="Lý do"
              name={"reason"}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item
              label="Số tiền"
              name="money"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Chưa nhập",
                },
              ]}
            >
              <InputNumber addonAfter="vnđ" />
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
