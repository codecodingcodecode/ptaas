import React, { useState } from "react";
import axios from "axios";

// RegEx to validate URLs
const urlPattern = new RegExp(
  "^(https?:\\/\\/)?" + // protocol
    "((([a-zA-Z0-9\\-])+\\.)+([a-zA-Z]{2,})|" + // domain name
    "localhost|" + // OR localhost
    "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})" + // OR IPv4
    "(\\:\\d{2,5})?" + // port (optional)
    "(\\/.*)?$" // path (optional)
);

// Helper function to validate the URL
const isValidUrl = (url) => urlPattern.test(url);

function Home() {
  const [showInput, setShowInput] = useState(false);
  const [url, setUrl] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleSubmit = async () => {
    if (!isValidUrl(url)) {
      setError("Invalid URL format. Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/combined-scan/",
        {
          url,
        }
      );
      // Process the API response before showing it
      const processedResults = processResponse(response.data.results);
      setResults(processedResults);
    } catch (err) {
      setError("Failed to run the test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processResponse = (data) => {
    return {
      nmap: parseNmapResults(data["Nmap Results"]),
      nikto: parseNiktoResults(data["Nikto Results"]),
      sslyze: parseSSLyzeResults(data["SSLyze Results"]),
      sqlmap: parseSQLMapResults(data["SQLMap Results"]),
      wapiti: parseWapitiResults(data["Wapiti Results"]),
    };
  };

  const parseNmapResults = (nmapData) => {
    if (!nmapData || nmapData.includes("0 hosts up")) {
      return "No hosts found or scanned.";
    }
    return nmapData; // Further processing can be added here
  };

  const parseNiktoResults = (niktoData) => {
    if (niktoData.includes("Scan terminated")) {
      return "Nikto scan completed successfully with findings.";
    }
    return niktoData; // Further processing can be added here
  };

  const parseSSLyzeResults = (sslyzeData) => {
    return sslyzeData.includes("FAILED")
      ? "SSLyze scan failed compliance check."
      : "SSLyze scan passed.";
  };

  const parseSQLMapResults = (sqlmapData) => {
    return sqlmapData.includes("no usable links found")
      ? "No SQL injection vulnerabilities found."
      : "SQLMap found potential vulnerabilities.";
  };

  const parseWapitiResults = (wapitiData) => {
    return wapitiData.includes("██████")
      ? "Wapiti scan completed successfully."
      : "Wapiti scan did not return results.";
  };

  return (
    <div className="page-content">
      <h2 className="page-title">Simplify Your Penetration Testing</h2>
      <p className="page-text">
        Access real-time security assessments with ease.
      </p>

      <div className="cta-section">
        {!showInput && (
          <button className="cta-button" onClick={handleButtonClick}>
            Start a New Test
          </button>
        )}

        {showInput && (
          <div className="url-input-section">
            <input
              type="text"
              className="url-input full-width"
              placeholder="Enter the URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              className="url-submit cta-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Running Test..." : "Submit"}
            </button>
          </div>
        )}
      </div>

      {/* Display error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Display the results after submission */}
      {results && (
        <div className="results-section">
          <h3>Test Results</h3>
          <div className="result">
            <h4>Nmap Results</h4>
            <p>{results.nmap}</p>
          </div>
          <div className="result">
            <h4>Nikto Results</h4>
            <p>{results.nikto}</p>
          </div>
          <div className="result">
            <h4>SSLyze Results</h4>
            <p>{results.sslyze}</p>
          </div>
          <div className="result">
            <h4>SQLMap Results</h4>
            <p>{results.sqlmap}</p>
          </div>
          <div className="result">
            <h4>Wapiti Results</h4>
            <p>{results.wapiti}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
