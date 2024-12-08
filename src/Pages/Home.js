import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ThemeContext, ThemeProvider } from "./ThemeContext";
import URL from "./URL";

const Home = () => {
  const [newPost, setNewPost] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${URL}/api/posts/newPost`, {
        withCredentials: true,
      })
      .then((response) => {
        setNewPost(response.data);
      })
      .catch((error) => {
        console.log("Error axios data new post !");
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${URL}/api/posts`, { withCredentials: true })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log("Error axios get all posts");
      });
  }, []);

  // Hiển thị thời gian đăng bài viết
  const getTimeElapsed = (postDate) => {
    const currentDate = new Date();
    const postDateTime = new Date(postDate);

    const elapsedMilliseconds = currentDate - postDateTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    // Check if post date is in the current or previous year
    const postYear = postDateTime.getFullYear();
    const currentYear = currentDate.getFullYear();

    if (elapsedDays > 365) {
      return `${Math.floor(elapsedDays / 365)} năm trước`;
    } else if (elapsedDays > 30) {
      return `${Math.floor(elapsedDays / 30)} tháng trước`;
    } else if (elapsedDays > 0) {
      return `${elapsedDays} ngày trước`;
    } else if (elapsedHours > 0) {
      return `${elapsedHours} giờ trước`;
    } else if (elapsedMinutes > 0) {
      return `${elapsedMinutes} phút trước`;
    } else if (elapsedSeconds > 0) {
      return `${elapsedSeconds} giây trước`;
    } else {
      return "vừa xong";
    }
  };

  const context = useContext(ThemeContext);

  return (
    <div className={`${context.theme}`}>
      <Container>
        <Carousel interval={2000}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://i1.wp.com/theappentrepreneur.com/wp-content/uploads/2013/02/Blogging-Apps-For-Bloggers.jpg?fit=730%2C382&ssl=1"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3></h3>
              <p></p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://www.teknopk.com/wp-content/uploads/2018/03/blogging.jpg"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3></h3>
              <p></p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://www.hallaminternet.com/wp-content/uploads/2020/01/Is-blogging-relevant-anymore.jpeg"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3></h3>
              <p></p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <h2 className="text-center my-4">Danh sách bài viết</h2>
        <Carousel>
          {posts.map((p, i) => (
            <Carousel.Item key={i}>
              <img
                className=" d-block w-100"
                src={
                  `http://localhost:8080/uploads/${p.img}` ||
                  "https://via.placeholder.com/150"
                }
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>{p.name}</h3>
                <p> {new Date(p.date).toLocaleDateString()}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
          ;
        </Carousel>
        <h2 className="text-center my-4">Giới thiệu về chúng tôi</h2>
        <Row className="my-4">
          <Col md={6} className="shadow-lg">
            <h3 className="text-center">Nhóm sáng lập</h3>
            <Card className="mb-4 shadow-sm">
              <Card.Img
                variant="top"
                src="https://cdn.dribbble.com/users/3750213/screenshots/8353916/custom___1_2x_4x.png"
                alt="Founder"
              />
              <Card.Body>
                <Card.Title className="text-center">Nhóm HTTP</Card.Title>
                <Card.Text>
                  Nhóm HTTP là những người sáng lập trang blog này, bao gồm
                  những người bạn với niềm đam mê mãnh liệt trong việc chia sẻ
                  kiến thức và kinh nghiệm về công nghệ, du lịch, thể thao và
                  sức khỏe. Với vài năm hoạt động trong lĩnh vực IT, nhóm đã
                  tích lũy được rất nhiều kinh nghiệm quý báu.Nhóm cùng nhau xây
                  dựng một cộng đồng mạnh mẽ, nơi mọi người có thể học hỏi lẫn
                  nhau và cùng phát triển. Blog của nhóm không chỉ là một nguồn
                  thông tin phong phú mà còn là một nền tảng kết nối, giúp mọi
                  người giao lưu, chia sẻ và cùng nhau khám phá những điều mới
                  mẻ trong cuộc sống.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="shadow-lg">
            <h3 className="text-center">Giới thiệu về blog</h3>
            <Card className="mb-4 shadow-sm">
              <Card.Img
                variant="top"
                src="https://static.vecteezy.com/system/resources/previews/001/044/904/original/blogger-concept-with-man-and-woman-on-laptops-vector.jpg"
                alt="Founder"
              />
              <Card.Body>
                <Card.Text>
                  Blog của chúng tôi là điểm đến lý tưởng cho những ai đam mê
                  khám phá và tìm hiểu về công nghệ, du lịch, thể thao và sức
                  khỏe. Tại đây, bạn sẽ luôn tìm thấy những bài viết chất lượng,
                  được đầu tư kỹ lưỡng bởi đội ngũ chuyên gia với nhiều năm kinh
                  nghiệm. Chúng tôi tin rằng, kiến thức chỉ thực sự có giá trị
                  khi được chia sẻ và lan tỏa. Vì vậy, blog của chúng tôi không
                  chỉ là nơi cung cấp thông tin mà còn là nền tảng kết nối những
                  tâm hồn đam mê học hỏi và chia sẻ. Hãy cùng tham gia với chúng
                  tôi, trở thành một phần của cộng đồng sôi động và nhiệt huyết
                  này. Tại đây, bạn sẽ có cơ hội được truyền cảm hứng, học hỏi
                  từ những người cùng chí hướng và khám phá những điều mới mẻ,
                  thú vị. Cùng nhau, chúng ta sẽ tạo nên một không gian chia sẻ
                  tri thức đầy sáng tạo và kết nối, nơi mọi người đều có thể
                  đóng góp và học hỏi lẫn nhau, góp phần xây dựng một cộng đồng
                  tri thức phát triển và bền vững.
                </Card.Text>
                {/* <Button
                  variant="primary"
                  href="/about"
                  className="d-block mx-auto mt-3"
                >
                  Tìm hiểu thêm
                </Button> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <h2 className="text-center my-4">Bài viết mới</h2>
        <Row>
          {newPost.map((post, index) => (
            <Col md={4} key={index} className="shadow-lg">
              <Card className="mb-4">
                <Card.Img
                  variant="top"
                  src={
                    post.img
                      ? `http://localhost:8080/uploads/${post.img}`
                      : "https://via.placeholder.com/150"
                  }
                />
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={`http://localhost:8080/uploads/${post.postedBy.img}`}
                      alt="User"
                      className="rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <Card.Text className="mb-1">
                        <strong>{post.postedBy.username}</strong>
                      </Card.Text>
                      <Card.Title className="mb-0">{post.name}</Card.Title>
                    </div>
                  </div>
                  <Card.Text>
                    <strong>{getTimeElapsed(post.date)}</strong>
                  </Card.Text>
                  {/* <Button variant="primary" href="/article/1">
          Read more
        </Button> */}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
