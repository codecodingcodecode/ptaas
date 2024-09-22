import React from "react";
import "./App.css";

function App() {
  return (
    <div className="wrapper">
      <header>
        <h1 className="title">PTaaS</h1>
        <nav>
          <ul className="nav-list">
            <li>
              <a href="#dashboard" className="nav-link">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#services" className="nav-link">
                Services
              </a>
            </li>
            <li>
              <a href="#reports" className="nav-link">
                Reports
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="intro">
          <h2 className="subtitle">Simplify Your Penetration Testing</h2>
          <p className="intro-text">
            Access real-time security assessments with ease.
          </p>
        </section>

        <section className="cta-section">
          <button className="cta-button">Start a New Test</button>
          <button className="cta-button">View Reports</button>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 PTaaS. Seamless security at your fingertips.</p>
      </footer>
    </div>
  );
}

export default App;
