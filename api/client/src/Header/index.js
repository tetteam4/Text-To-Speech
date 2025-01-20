import React from "react";
import { HeaderContainer } from "./styles";
import { Link } from "react-router-dom";
import Button from "../Button";

function Header() {
  return (
    <HeaderContainer>
      <h1>Payamava Clone</h1>
      <div className="header-right">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <Button>Let's Talk</Button>
      </div>
    </HeaderContainer>
  );
}

export default Header;
