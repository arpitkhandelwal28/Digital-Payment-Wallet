import React,{ useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Transaction from './Pages/transaction';
import { Navbar, Nav, Container, NavDropdown} from "react-bootstrap";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const togglemenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if(storedUser){
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div>
        <Router>
           <div>
              <Navbar bg="primary" variant="dark" expand="md" sticky="top">
                <Container>
                <Navbar.Brand as={Link} to="/">FastPay</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                  <Nav classname="ml-auto">
                    {user ? (
                      <>
                        <Nav.Link as="Link" to="/transaction">Home</Nav.Link>
                        <NavDropdown title={<><i className='bi bi-person-circle'></i> {user.email}</>}>
                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                      </>
                    ):(
                      <>
                        <Nav.Link as="Link" to="/login">Login</Nav.Link>
                        <Nav.Link as="Link" to="/signup">Signup</Nav.Link>
                      </>
                    )}
                  </Nav>
                </Navbar.Collapse>
                </Container>
              </Navbar>
              <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/transaction' element={<Transaction/>}/>
              </Routes>
           </div>
        </Router>
    </div>
  );
};

export default App;
