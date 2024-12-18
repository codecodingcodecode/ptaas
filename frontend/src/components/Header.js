// components/Header.js
import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <header className="header">
      <h1 className="title">PTaaS</h1>
      <nav>
        <ul className="nav-list">
          <li>
            <NavLink to="/" end className="nav-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className="nav-link">
              Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="nav-link">
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
