// components/Home.js
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-content">
      <h2 className="page-title">Simplify Your Penetration Testing</h2>
      <p className="page-text">
        Access real-time security assessments with ease.
      </p>
      <div className="cta-section">
        <Link to="/services">
          <button className="cta-button">Start a New Test</button>
        </Link>
        <Link to="/reports">
          <button className="cta-button outline">View Reports</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
