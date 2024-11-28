import React from "react";
import "./contact.css"; // Importiere die CSS-Datei ohne das Modul

function Contact() {
  return (
    <div className="container">
      {" "}
      {/* Nutze die Klassen ohne `styles.` */}
      <h2 className="title">Get in Touch</h2>
      <p className="subtitle">
        Have feedback or change requests? I would love to hear from you!
      </p>
      <div className="card">
        <div className="contactItem">
          <span className="icon" role="img" aria-label="Email">
            ✉️
          </span>
          <a href="mailto:sean.horvath@stud.hslu.ch" className="link">
            sean.horvath@stud.hslu.ch
          </a>
        </div>
        <div className="contactItem">
          <span className="icon" role="img" aria-label="GitHub">
            🐙
          </span>
          <a
            href="https://github.com/codecodingcodecode/ptaas"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            GitHub Repository
          </a>
        </div>
      </div>
      <div className="animationContainer">
        <a href="mailto:sean.horvath@stud.hslu.ch" className="envelopeLink">
          <div className="envelope">
            <div className="paper"></div>
          </div>
        </a>
      </div>
      <p className="footnote">
        P.S. I accept change requests, bug reports, and even coding jokes!
      </p>
      <p className="joke">
        Why do programmers prefer dark mode? Because light attracts bugs!
      </p>
    </div>
  );
}

export default Contact;
