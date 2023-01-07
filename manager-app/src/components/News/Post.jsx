import { Avatar, Button, Col, Layout, Popconfirm, Row } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { WEB_SERVER_URL } from "../../config/serverURL";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEllipsis,
} from "react-icons/ai";
import { TbPin } from "react-icons/tb";

moment().locale("vi");

function Post({ props, setIsGhim, openModalUpdate, deletePost }) {
  const [postSelect, setPostSelect] = useState(false);

  return (
    <Layout
      style={{
        border: "1px solid #000",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#eff8f8",
      }}
    >
      <Row align="middle" style={{ marginBottom: 5 }}>
        <Col flex="60px">
          <Avatar
            size={40}
            src={
              props?.avatarUrl
                ? `${WEB_SERVER_URL}${props?.avatarUrl}`
                : "https://joeschmoe.io/api/v1/random"
            }
            style={{ border: "1px solid #9db5b6" }}
          />
        </Col>
        <Col flex={"auto"}>
          <Row>
            <b style={{ fontSize: 16 }}>{props?.fullname}</b>
          </Row>
          <Row>
            <span style={{ fontSize: 12 }}>
              {moment(props?.time).calendar()}
            </span>
          </Row>
        </Col>
        <Col flex="50px">
          <Row align="top" justify="end" style={{ position: "relative" }}>
            <Button
              icon={<AiOutlineEllipsis size={30} />}
              type="text"
              onClick={() => setPostSelect(!postSelect)}
            />
            {postSelect ? (
              <ul
                style={{
                  position: "absolute",
                  marginTop: 50,
                  backgroundColor: "#6a98ad",
                  padding: 5,
                  borderRadius: 5,
                  textAlign: "start",
                  border: "1px solid #3e33a1",
                }}
              >
                <li>
                  <Button
                    type="text"
                    onClick={() => {
                      setIsGhim(props._id);
                      setPostSelect(!postSelect);
                    }}
                  >
                    <Row wrap={false} align="middle">
                      <TbPin />
                      &ensp;<span>Ghim thông báo</span>
                    </Row>
                  </Button>
                </li>
                <li>
                  <Button
                    type="text"
                    onClick={() => {
                      openModalUpdate(props);
                      setPostSelect(!postSelect);
                    }}
                  >
                    <Row wrap={false} align="middle">
                      <AiOutlineEdit />
                      &ensp;<span>Sửa thông báo</span>
                    </Row>
                  </Button>
                </li>
                <li>
                  <Popconfirm
                    overlayInnerStyle={{ width: 300 }}
                    okText="Đồng ý"
                    cancelText="Đóng"
                    title="Bạn chắc chứ?"
                    onConfirm={() => {
                      deletePost(props._id);
                      setPostSelect(!postSelect);
                    }}
                  >
                    <Button type="text">
                      <Row wrap={false} align="middle">
                        <AiOutlineDelete />
                        &ensp;<span>Xoá thông báo</span>
                      </Row>
                    </Button>
                  </Popconfirm>
                </li>
              </ul>
            ) : (
              ""
            )}
          </Row>
        </Col>
      </Row>
      <div
        style={{
          margin: 0,
          borderRadius: 10,
          backgroundColor: "#fff",
          padding: " 10px",
        }}
        // dangerouslySetInnerHTML={{
        //   __html: props?.content?.children?.[0]?.innerHTML,
        // }}
      >
        <Row justify="center">
          <h1>{props?.title?.toUpperCase()}</h1>
        </Row>
        <div style={{ textAlign: "start" }}>{props?.content}</div>
      </div>
    </Layout>
  );
}

export default Post;
