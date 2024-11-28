import "./services.css"; // Import the CSS for animations and styling

function Services() {
  return (
    <div className="services-page">
      <h2 className="services-title">Our Penetration Testing Tools</h2>
      <p className="services-subtitle">
        I utilized some of the most trusted and powerful tools in the security
        industry to ensure comprehensive vulnerability assessments.
      </p>

      <div className="services-list">
        <div className="service-card">
          <h3>Nmap</h3>
          <p>
            Nmap (Network Mapper) is a free and open-source tool for network
            discovery and security auditing. It's designed to rapidly scan large
            networks but works fine against single hosts.
          </p>
          <a href="https://nmap.org/" target="_blank" rel="noopener noreferrer">
            Learn More
          </a>
        </div>

        <div className="service-card">
          <h3>Nikto</h3>
          <p>
            Nikto is an open-source web server scanner that tests for dangerous
            files, outdated server versions, and many other security issues.
          </p>
          <a
            href="https://cirt.net/Nikto2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </div>

        <div className="service-card">
          <h3>SSLyze</h3>
          <p>
            SSLyze is a fast and powerful SSL/TLS scanning tool that analyzes
            the security of a server's SSL/TLS configuration. It's used for
            auditing SSL implementations.
          </p>
          <a
            href="https://github.com/nabla-c0d3/sslyze"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </div>

        <div className="service-card">
          <h3>SQLMap</h3>
          <p>
            SQLMap is an open-source penetration testing tool that automates the
            process of detecting and exploiting SQL injection flaws and taking
            over database servers.
          </p>
          <a
            href="http://sqlmap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}

export default Services;
