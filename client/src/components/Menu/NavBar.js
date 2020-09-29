import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions';
import { Navbar, Nav } from 'react-bootstrap';
import './CreateChart.css';

const items = [
  { label: 'צור טבלה', link: '#chart' },
  { label: 'ניהול משתמש', link: '#Manage' },
  { label: 'סטטיסטיקה', link: '#statistics' },
];

const NavBar = ({ logout }) => {
  return (
    <Navbar
      bg="primary"
      variant={'dark'}
      expand="lg"
      className="justify-content-lg-end"
    >
      <Navbar.Brand href="/">מתפ״ש</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto justify-content-lg-end">
          <Nav.Link href="/api/logout" onClick={() => logout()}>
            יציאה
          </Nav.Link>
          <Nav.Link href="/users">משתמשים</Nav.Link>
          <Nav.Link href="/permissions">הרשאות</Nav.Link>
          <Nav.Link href="/statistics">סטטיסטיקה</Nav.Link>
          <Nav.Link href="/create-chart">צור גרף</Nav.Link>
          <Nav.Link href="/">עבור לדשבורד</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default connect(null, { logout })(NavBar);
