import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Col, Layout, Modal, Row } from "antd";
import Post from "../../components/News/Post";
import { BEARER_TOKEN } from "../../config/auth.js";
import { WEB_SERVER_URL } from "../../config/serverURL.js";
import Search from "antd/lib/input/Search.js";

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [gimList, setGimList] = useState([]);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [visibleGimList, setVisibleGimList] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <Layout loading={loading}>
      <Row
        gutter={5}
        justify="space-around"
        style={{ height: 35, margin: 5 }}
        align="middle"
        wrap={false}
      >
        <Col>
          <Search
            placeholder="Tìm kiếm theo từ khoá"
            allowClear
            value={search}
            loading={loading}
            enterButton="Search"
            size="middle"
            onChange={(text) => {
              if (text === "") getNewsPage(1);
              setSearch(text.target.value);
            }}
            onSearch={() => searchNews(search, 1)}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => setVisibleGimList(!visibleGimList)}
          >
            Chú ý
          </Button>
        </Col>
      </Row>
      <hr style={{ margin: 5 }} />
      <Row
        align="top"
        gutter={10}
        style={{
          height: "75vh",
          overflowY: "auto",
        }}
      >
        <Col span={24}>
          {newsList?.map((item) => {
            return (
              <div style={{ margin: "0 0 10px 0" }} key={item._id}>
                <Post props={item} />
              </div>
            );
          })}
          <Row justify="end">
            {newsList.length === pageSize ? (
              <Button onClick={() => setPage(page + 1)}>Trang tiếp theo</Button>
            ) : null}
          </Row>
        </Col>
      </Row>

      {/* Modal update */}
      <Modal
        open={visibleGimList}
        title={
          <h1 style={{ fontSize: 15, color: "#0c00b6", fontWeight: 700 }}>
            THÔNG BÁO QUAN TRỌNG
          </h1>
        }
        onCancel={() => setVisibleGimList(false)}
        footer={null}
      >
        <div>
          {gimList !== []
            ? gimList?.map((item) => {
                return (
                  <div
                    key={item._id}
                    style={{
                      backgroundColor: "#a1a7b6",
                      borderRadius: 5,
                      margin: 5,
                      padding: "10px 20px",
                    }}
                    onClick={() => {
                      setVisibleGimList(false);
                      getNewGim(item._id);
                    }}
                  >
                    <Row wrap={false} align="middle">
                      <h4 style={{ margin: 0 }}>
                        {item?.title?.toUpperCase()}
                      </h4>
                    </Row>
                  </div>
                );
              })
            : null}
        </div>
      </Modal>
    </Layout>
  );
}
