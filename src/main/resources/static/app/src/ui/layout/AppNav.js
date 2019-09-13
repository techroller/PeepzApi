import React, {Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler} from 'reactstrap';


export class AppNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: false
    };
  }

  toggleNavbar = () => {
    this.setState((state) => {
      return {
        navOpen: !state.navOpen
      };
    });
  }

  render = () => (
    <Navbar color="light" light expand="md">
      <NavbarBrand href="/">PeepZ</NavbarBrand>
      <NavbarToggler onClick={this.toggleNavbar}/>
      <Collapse isOpen={this.state.isOpen}>
        <Nav className="ml-auto" navbar/>
      </Collapse>
    </Navbar>
  )
}

export default AppNav;