import React, {useState, Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler} from 'reactstrap';

export const AppNav = () => {
  const [state, setState] = useState({
    navOpen: false
  });
  const toggleNavbar = () => {
    const newState = {
      ...state,
      navOpen: !state.navOpen
    };
    setState(newState);
  };
  return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">PeepZ</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar}/>
        <Collapse isOpen={state.navOpen}>
          <Nav className="ml-auto" navbar/>
        </Collapse>
      </Navbar>
  )
};

export default AppNav;