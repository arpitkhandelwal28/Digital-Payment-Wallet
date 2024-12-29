import { Container, Row, Col, Button, Image } from "react-bootstrap";

const home = () => {
  return (
    <div className="bg-light text-center py-5">
    <Container>
        <Row className="align-items-center">
            <Col md={6}>
                <h1 className="display-4">Fast and Secure Online Payments</h1>
                <p className="lead">
                    Experience seamless transactions with PayEase. whether you're a small buisness or 
                    an enterprise, our platform offers the tools you need to manage Payments
                    effortlessly.
                </p>
                <ul className="list-unstyled">
                    <li>- Easy integration with your website</li>
                    <li>- Accept payments globally in multiple currencies</li>
                    <li>- Real-time transaction monitoring and analytics</li>
                </ul>

            </Col>
            <Col md={6}>
                <Image src="https://via.placeholder.com/500x300" alt="Online Payment Illustration" fluid/>
            </Col>
        </Row>
    </Container>
    </div>
  );
};

export default home;