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
      .get(`http://localhost:8080/api/auth/users/${id}`, {
        withCredentials: true,
      })
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
            <Card className="shadow-lg border-0">
              <Card.Header className=" text-black text-center">
                <h1 className="mb-0">Thông tin người dùng</h1>
              </Card.Header>
              <Card.Body className="text-center">
                <Card.Title className="mb-3">
                  <h4>Tên người dùng: {user.username}</h4>
                  <h5>Email: {user.email}</h5>
                </Card.Title>
                <div className="d-flex justify-content-center">
                  <img
                    src={`http://localhost:8080/uploads/${user.img}`}
                    alt={user.username}
                    className="img-fluid rounded-circle border"
                    style={{
                      maxWidth: "150px",
                      height: "150px",
                      objectFit: "cover",
                      border: "4px solid #007bff",
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
