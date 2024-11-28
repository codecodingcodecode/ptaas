// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Services from "./components/services";
import Contact from "./components/contact";
import Layout from "./components/layout";
import Header from "./components/header"; // Header importieren
import Footer from "./components/footer"; // Footer importieren
import "./app.css"; // Globale CSS-Stile

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Header /> {/* Header oben */}
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <Footer /> {/* Footer unten */}
      </div>
    </Router>
  );
}

export default App;
