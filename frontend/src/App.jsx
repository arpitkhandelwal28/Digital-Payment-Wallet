import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/home";
import Transaction from "./Pages/transaction";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { AuthContext, AuthProvider } from "./context/AuthContext";

function AppNavbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="primary" variant="dark" expand="md" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">FastPay</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/transaction">Home</Nav.Link>
                <NavDropdown title={<><i className='bi bi-person-circle'></i> {user.email}</>}>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// Route wrapper for auth protection
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/transaction" element={<PrivateRoute><Transaction /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
