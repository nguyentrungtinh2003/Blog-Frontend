// import React from "react";

// const ForgotPassword = () => {

// //tui muon nguoi dung nhap vao

//     return (
//         <>
//         <Row className="justify-content-md-center">
//         <Col md={6}>
//           <h2 className="text-center">Forgot Password</h2>
//           {message && (
//             <Alert variant={error ? "danger" : "success"}>{message}</Alert>
//           )}
//           <Form onSubmit={handleLogin}>
//             <Form.Group controlId="formUsername">
//               <Form.Label>Username</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group controlId="formEmail" className="mt-3">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter email"
//                 value={password}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </Form.Group>

//             <Button variant="primary" type="submit" className="mt-3">
//               Login
//             </Button>
//             <div className="mt-3">
//               <Link to="/register">
//                 <Button variant="secondary">Register</Button>
//               </Link>
//             </div>
//             <a href="/forgotPassword">
//             <Button variant="primary" className="mt-3">
//               Forgot Password
//             </Button>
//             </a>
//           </Form>
//         </Col>
//       </Row>
//         </>
//     )

// }

// export default ForgotPassword;
