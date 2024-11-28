import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">© 2024 PTaaS</div>
        <ul className="footer-links">
          <li>
            <a href="/home">Test yourself</a>
          </li>
          <li>
            <a href="/services">Our services</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>
      <div className="footer-info">
        <p>Providing top-notch penetration testing services.</p>
        <p>Email: info@ptaas.com | Phone: +41 78 658 10 32</p>
      </div>
    </footer>
  );
}

export default Footer;
