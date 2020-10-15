import React, { useState } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions';
import { Navbar, Nav } from 'react-bootstrap';
import './CreateChart.css';

const NavBar = (props, { logout }) => {
  const [adminNav, setAdminNav] = useState(() => {
    if (props.permissions == 'מנהל') {
      return (
        <Nav className="ml-auto justify-content-lg-end">
          <Nav.Link href="/api/logout" onClick={() => logout()}>
            יציאה
          </Nav.Link>
          <Nav.Link href="/admin">אדמין</Nav.Link>
          <Nav.Link href="/users">משתמש חדש</Nav.Link>
          <Nav.Link href="/permissions">הרשאות</Nav.Link>
          <Nav.Link href="/statistics">סטטיסטיקה</Nav.Link>
          <Nav.Link href="/create-chart">צור גרף</Nav.Link>
          <Nav.Link href="/">עבור לדשבורד</Nav.Link>
        </Nav>
      );
    } else if (props.permissions == 'עורך') {
      return (
        <Nav className="ml-auto justify-content-lg-end">
          <Nav.Link href="/api/logout" onClick={() => logout()}>
            יציאה
          </Nav.Link>
          <Nav.Link href="/create-chart">צור גרף</Nav.Link>
          <Nav.Link href="/">עבור לדשבורד</Nav.Link>
        </Nav>
      );
    } else {
      return (
        <Nav className="ml-auto justify-content-lg-end">
          <Nav.Link href="/api/logout" onClick={() => logout()}>
            יציאה
          </Nav.Link>
          <Nav.Link href="/">עבור לדשבורד</Nav.Link>
        </Nav>
      );
    }
  });

  console.log(props.permissions);
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
