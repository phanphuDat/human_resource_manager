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

function Post({ props }) {
  return (
    <Layout
      style={{
        border: "1px solid #000",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#eff8f8",
        position: "relative",
        margin: "0 5px 5px 5px",
      }}
    >
      <Row align="middle">
        <Col span={4}>
          <Avatar
            size={40}
            src={
              props?.avatarUrl
                ? `${WEB_SERVER_URL}${props?.avatarUrl}`
                : "https://joeschmoe.io/api/v1/random"
            }
          />
        </Col>
        <Col span={16}>
          <Row>
            <b style={{ margin: 0 }}>{props?.fullname}</b>
          </Row>
          <Row>{moment(props?.time).calendar()}</Row>
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
