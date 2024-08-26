import React from "react";
import { Container, Button } from "react-bootstrap";

const NotMatch = () => {
  return (
    <Container className="text-center my-5">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Page Not Found</h2>

      <p className="mb-4">
        Sorry, the page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <Button variant="primary" href="/">
        Go to Homepage
      </Button>
    </Container>
  );
};

export default NotMatch;
