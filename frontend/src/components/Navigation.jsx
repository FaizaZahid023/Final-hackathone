import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Navbar,
  Nav,
  Container,
  Offcanvas,
  Button,
} from "react-bootstrap";
import images from "../assets/images/images.jpg";

const Navigation = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Navbar expand="md" bg="white" variant="light" className="shadow-sm py-3">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span className="fw-bold text-primary fs-4">TaskManager</span>
        </Navbar.Brand>

        {/* Offcanvas Toggle */}
        <Navbar.Toggle aria-controls="offcanvasNavbar" />

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="bg-white"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel" className="fw-bold">
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            {/* Center Nav Items */}
            <Nav className="mx-auto text-center">
              <NavLink to="/" icon={faHome} text="Home" />
              <NavLink to="/task" text="Tasks" />
            </Nav>

            {/* Right Side - Auth Buttons */}
            <Nav className="ms-md-auto mt-3 mt-md-0 d-flex align-items-center gap-2">
              {isAuthenticated ? (
                <Button
                  variant="outline-primary"
                  as={Link}
                  to="/logout"
                  size="sm"
                  className="px-3"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/signup"
                    size="sm"
                    className="px-3"
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="primary"
                    as={Link}
                    to="/login"
                    size="sm"
                    className="px-3"
                  >
                    Login
                  </Button>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

const NavLink = ({ to, icon, text }) => (
  <Nav.Link
    as={Link}
    to={to}
    className="text-dark fw-medium px-3 d-flex align-items-center"
    style={{ fontSize: "1rem" }}
  >
    {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
    {text}
  </Nav.Link>
);

export default Navigation;
