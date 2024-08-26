import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import { Container, Row, Col, Card } from "react-bootstrap";

const ViewUser = () => {
  const [user, setUser] = useState({});
  const { id } = useParams();
  const context = useContext(ThemeContext);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/auth/users/${id}`)
      .then((response) => setUser(response.data))
      .catch((error) => {
        console.log("Error get user by id !");
      });
  }, [id]);

  return (
    <div className={context.theme}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg">
              <Card.Header className="text-center ">
                <h1>Thông tin người dùng</h1>
              </Card.Header>
              <Card.Body className="p-4">
                <Card.Title>Tên người dùng: {user.username}</Card.Title>
                <Card.Title>Email: {user.email}</Card.Title>
                <div className="text-center">
                  <img
                    src={`http://localhost:8080/uploads/${user.img}`}
                    alt={user.username}
                    className="img-fluid rounded"
                    style={{
                      maxWidth: "200px",
                      height: "auto",
                      marginTop: "20px",
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ViewUser;
