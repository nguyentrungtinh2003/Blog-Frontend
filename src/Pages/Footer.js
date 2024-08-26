import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Blog Application</h5>
            <p>© 2024 Blog Application. Bản quyền của TrungTinhFullStack.</p>
          </Col>
          <Col md={4}>
            <h5>Liên Kết</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/home" className="text-white">
                  Trang Chủ
                </a>
              </li>
              <li>
                <a href="/about" className="text-white">
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white">
                  Liên Hệ
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-white">
                  Chính Sách Bảo Mật
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Liên Hệ</h5>
            <p>Email: trungtinhn300@gmail.com</p>
            <p>Điện Thoại: 0798948708</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
