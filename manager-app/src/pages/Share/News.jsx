import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Switch,
  Tooltip,
} from "antd";
import { TbPin, TbPinnedOff } from "react-icons/tb";
import { Content, Footer, Header } from "antd/lib/layout/layout.js";
import Sider from "antd/lib/layout/Sider.js";
import Post from "../../components/News/Post.jsx";
import { AVATAR_URL, BEARER_TOKEN, FULLNAME } from "../../config/auth.js";
import { WEB_SERVER_URL } from "../../config/serverURL.js";
import TextArea from "antd/lib/input/TextArea.js";
import Search from "antd/lib/input/Search.js";

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [gimList, setGimList] = useState([]);

  const [selectPost, setSelectPost] = useState({});
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [visibleEditor, setVisibleEditor] = useState(false);
  const [visibleModalUpdate, setVisibleModalUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();

  // lấy API khởi chạy
  useEffect(() => {
    getNewsPage(page);
  }, [page]);

  // lấy API theo trang
  const getNewsPage = (page) => {
    axios
      .get(
        `${WEB_SERVER_URL}/news/getnews?page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        setGimList(response.data.gimList);
        setNewsList(response.data.newsList);
      })
      .catch((error) => console.log(error));
  };

  const getNewGim = (id) => {
    setLoading(true);
    axios
      .get(`${WEB_SERVER_URL}/news/getnew/${id}`, BEARER_TOKEN)
      .then((response) => {
        setNewsList(response.data.results);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const createNew = (value) => {
    axios
      .post(`${WEB_SERVER_URL}/news/createnew`, value, BEARER_TOKEN)
      .then((response) => {
        // console.log(response);
        setVisibleEditor(false);
        message.success("Thành công");
        let newObject = {
          ...response.data.results.data,
          avatarUrl: AVATAR_URL,
          fullname: FULLNAME,
        };
        setNewsList([newObject, ...newsList]);
        if (value.pin) {
          setGimList([newObject, ...gimList]);
        }
      })
      .catch((error) => {
        message.error("Thất bại");
        console.log(error);
      });
  };

  const searchNews = (text, page) => {
    setLoading(true);
    axios
      .get(
        `${WEB_SERVER_URL}/news/searchnews?search=${text}&page=${page}&pageSize=${pageSize}`,
        BEARER_TOKEN
      )
      .then((response) => {
        if (response.status === 200) {
          const newList = response.data.results;
          setNewsList(newList);
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const setUnGhim = (id) => {
    axios
      .patch(
        `${WEB_SERVER_URL}/news/updatenew/${id}`,
        { pin: false },
        BEARER_TOKEN
      )
      .then((response) => {
        let newArray = gimList.filter((item) => item._id !== id);
        setGimList(newArray);
      })
      .catch((error) => console.log(error));
  };

  const setIsGhim = (id) => {
    if (!gimList.some((item) => item._id === id))
      axios
        .patch(
          `${WEB_SERVER_URL}/news/updatenew/${id}`,
          { pin: true },
          BEARER_TOKEN
        )
        .then((response) => {
          let newGim = newsList.filter((item) => item._id === id);
          setGimList([...gimList, ...newGim]);
        })
        .catch((error) => console.log(error));
  };

  const openModalUpdate = (record) => {
    setVisibleModalUpdate(true);
    formUpdate.setFieldValue("pin", record.pin);
    formUpdate.setFieldValue("title", record.title);
    formUpdate.setFieldValue("content", record.content);
    setSelectPost(record);
  };

  const updatePost = (value) => {
    let id = selectPost._id;
    axios
      .patch(`${WEB_SERVER_URL}/news/updatenew/${id}`, value, BEARER_TOKEN)
      .then((response) => {
        setVisibleModalUpdate(false);
        let newArr = newsList.filter((item) => item._id === id);
        setNewsList([...newArr, { _id: id, ...value }]);
        if (value.pin) {
          let newArr2 = gimList.filter((item) => item._id === id);
          setGimList([...newArr2, { _id: id, ...value }]);
        }
      })
      .catch((error) => console.log(error));
  };

  const deletePost = (id) => {
    axios
      .delete(`${WEB_SERVER_URL}/news/deletenew/${id}`, BEARER_TOKEN)
      .then((response) => {
        let newGimList = gimList.filter((item) => item._id !== id);
        let newArray = newsList.filter((item) => item._id !== id);
        setGimList(newGimList);
        setNewsList(newArray);
        setVisibleModalUpdate(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Layout
      style={{
        padding: 10,
      }}
    >
      <Row>
        <Col span={16}>
          <Row justify="center">
            <Search
              placeholder="Tìm kiếm theo từ khoá"
              allowClear
              value={search}
              loading={loading}
              enterButton="Search"
              // size="large"
              size="middle"
              onChange={(text) => {
                if (text === "") getNewsPage(1);
                setSearch(text.target.value);
              }}
              onSearch={() => searchNews(search, 1)}
              style={{ width: 400 }}
            />
          </Row>
        </Col>
        <Col span={8} justify={"end"}>
          <Row justify="center">
            <Button
              type="primary"
              onClick={() => {
                formAdd.setFieldsValue({ title: "", content: "", pin: false });
                setVisibleEditor(true);
              }}
            >
              Tạo thông báo
            </Button>
          </Row>
        </Col>
      </Row>
      <Row style={{ margin: 10, borderBottom: "1px solid #333" }}></Row>
      <Row align="top" gutter={10}>
        <Col span={16}>
          <div
            style={{
              height: "75vh",
              overflowY: "auto",
            }}
          >
            {newsList?.map((item) => {
              return (
                <div style={{ margin: "0 0 10px 0" }} key={item._id}>
                  <Post
                    props={item}
                    setIsGhim={setIsGhim}
                    openModalUpdate={openModalUpdate}
                    deletePost={deletePost}
                  />
                </div>
              );
            })}
          </div>
          <Row justify="end">
            {newsList.length === pageSize ? (
              <Button onClick={() => setPage(page + 1)}>Trang tiếp theo</Button>
            ) : (
              ""
            )}
          </Row>
        </Col>
        <Col span={8}>
          <div
            style={{
              minHeight: 350,
              // border: "1px solid #000",
              borderRadius: 10,
              padding: 10,
              backgroundColor: "#fff",
            }}
          >
            <h1 style={{ fontSize: 18, color: "#0c00b6", fontWeight: 700 }}>
              THÔNG BÁO QUAN TRỌNG
            </h1>
            <hr></hr>
            {gimList?.map((item) => {
              return (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: "#a1a7b6",
                    borderRadius: 10,
                    margin: 5,
                    padding: 3,
                  }}
                >
                  <Row wrap={false} align="middle">
                    <Col span={20}>
                      <h6
                        onClick={() => getNewGim(item._id)}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {item?.title?.toUpperCase()}
                      </h6>
                    </Col>
                    <Col span={4}>
                      <Tooltip title="gỡ ghim">
                        <Button
                          type="primary"
                          shape="circle"
                          // icon={<TbPinnedOff />}
                          onClick={() => setUnGhim(item._id)}
                        >
                          <Row justify="center">
                            <TbPinnedOff />
                          </Row>
                        </Button>
                      </Tooltip>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>

      {/* Modal tạo mới */}
      <Modal
        open={visibleEditor}
        title="Tạo thông báo"
        onOk={() => formAdd.submit()}
        onCancel={() => setVisibleEditor(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => formAdd.submit()}
          >
            Đăng thông báo
          </Button>,
        ]}
      >
        <Form
          form={formAdd}
          name="add"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{}}
          onFinish={(value) => createNew(value)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <Input placeholder="Nhập tên chức vụ" />
          </Form.Item>
          <Form.Item
            label="Nội dung thông báo"
            name={"content"}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <TextArea placeholder="Nhập vô tả" rows={5} />
          </Form.Item>
          <Form.Item
            label="Ghim thông báo quan trọng"
            name="pin"
            // valuePropName="checked"
            checked={true}
          >
            <Switch />
          </Form.Item>
        </Form>
        {/* <Editor getHtmlText={setHtmlText} /> */}
      </Modal>

      {/* Modal update */}
      <Modal
        open={visibleModalUpdate}
        title="Chỉnh sửa thông báo"
        onOk={() => formUpdate.submit()}
        onCancel={() => setVisibleModalUpdate(false)}
        loading={loading}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => formUpdate.submit()}
          >
            Cập nhật thông báo
          </Button>,
        ]}
      >
        <Form
          form={formUpdate}
          name="update"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{}}
          onFinish={(value) => updatePost(value)}
          onFinishFailed={(error) => {
            message.error(error);
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <Input placeholder="Nhập tên chức vụ" />
          </Form.Item>
          <Form.Item
            label="Nội dung thông báo"
            name={"content"}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chưa nhập",
              },
            ]}
          >
            <TextArea placeholder="Nhập vô tả" rows={5} />
          </Form.Item>
          <Form.Item
            label="Ghim thông báo quan trọng"
            name="pin"
            // valuePropName="checked"
            checked={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}
