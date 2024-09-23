// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header"; // Import Header

/* Import Page Components */
import Dashboard from "./components/Dashboard";
import Services from "./components/Services";
import Reports from "./components/Reports";
import Contact from "./components/Contact";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <div className="wrapper">
        <Header /> {/* Use Header here */}
        <main>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/services" element={<Services />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </main>
        <footer>
          <p>&copy; 2024 PTaaS. Seamless security at your fingertips.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
