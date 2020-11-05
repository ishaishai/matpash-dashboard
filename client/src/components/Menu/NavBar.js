import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../actions';
import { Navbar, Nav } from 'react-bootstrap';
import './CreateChart.css';

const NavBar = (props, { logout }) => {
  const [adminNav] = useState(() => {
    if (props.permissions === 'מנהל') {
      return (
        <Nav className="ml-auto justify-content-lg-end">
          <Nav.Link href="/api/logout" onClick={() => logout()}>
            יציאה
          </Nav.Link>
          <Nav.Link as={Link} to="/admin">
            אדמין
          </Nav.Link>
          <Nav.Link as={Link} to="/users">
            משתמש חדש
          </Nav.Link>
          <Nav.Link as={Link} to="/permissions">
            הרשאות
          </Nav.Link>
          <Nav.Link as={Link} to="/statistics">
            סטטיסטיקה
          </Nav.Link>
          <Nav.Link as={Link} to="/create-chart">
            צור גרף
          </Nav.Link>
          <Nav.Link as={Link} to="/">
            עבור לדשבורד
          </Nav.Link>
        </Nav>
      );
    } else if (props.permissions === 'עורך') {
      return (
        <Nav className="ml-auto justify-content-lg-end">
          <Nav.Link as={Link} to="/api/logout" onClick={() => logout()}>
            יציאה
          </Nav.Link>
          <Nav.Link as={Link} to="/create-chart">
            צור גרף
          </Nav.Link>
          <Nav.Link as={Link} to="/">
            עבור לדשבורד
          </Nav.Link>
        </Nav>
      );
    } else {
      return (
        <Nav className="ml-auto justify-content-lg-end">
          <Nav.Link as={Link} to="/api/logout" onClick={() => logout()}>
            יציאה
          </Nav.Link>
          <Nav.Link as={Link} to="/">
            עבור לדשבורד
          </Nav.Link>
        </Nav>
      );
    }
  });

  return (
    <Navbar
      bg="primary"
      variant={'dark'}
      expand="lg"
      className="justify-content-lg-end"
    >
      <Navbar.Brand href="/">מתפ״ש</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">{adminNav}</Navbar.Collapse>
    </Navbar>
  );
};
const mapStateToProps = ({
  auth: {
    user: { permissions },
  },
}) => ({ permissions });

export default connect(mapStateToProps, { logout })(NavBar);
