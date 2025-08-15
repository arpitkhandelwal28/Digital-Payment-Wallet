import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css"; // Importing custom styles

const Home = () => {
  return (
    <div className="home-section text-center">
      <Container>
        <Row className="align-items-center">
          {/* Left Side - Text Content */}
          <Col md={6} className="text-md-start text-center">
            <h1 className="home-title">Fast and Secure Online Payments</h1>
            <p className="lead">
              Experience seamless transactions with PayEase. Whether you're a small
              business or an enterprise, our platform offers the tools you need to
              manage payments effortlessly.
            </p>
            <ul className="list-unstyled home-list">
              <li>✔️ Easy integration with your website</li>
              <li>✔️ Accept payments globally in multiple currencies</li>
              <li>✔️ Real-time transaction monitoring and analytics</li>
            </ul>
            <Link to="/signup">
              <Button variant="primary" size="lg" className="mt-3">
                Get Started
              </Button>
            </Link>
          </Col>

          {/* Right Side - Image */}
          <Col md={6} className="text-center mt-4 mt-md-0">
            <Image
              src="https://razorpay.com/blog-content/uploads/2021/01/v03.png"
              alt="Online Payment Illustration"
              fluid
              className="home-image"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
