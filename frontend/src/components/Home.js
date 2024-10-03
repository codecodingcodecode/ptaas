import React, { useState } from "react";
import axios from "axios";

function Home() {
  const [showInput, setShowInput] = useState(false);
  const [url, setUrl] = useState("");
  const [results, setResults] = useState({
    nmap: null,
    nikto: null,
    sslyze: null,
    sqlmap: null,
  });
  const [loading, setLoading] = useState({
    nmap: false,
    nikto: false,
    sslyze: false,
    sqlmap: false,
  });
  const [error, setError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track submit

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleSubmit = async () => {
    setHasSubmitted(true); // Set this to true once Submit is clicked
    setError("");

    // Start each scan and show results independently
    startScan("nmap", "/nmap-scan/");
    startScan("nikto", "/nikto-scan/");
    startScan("sslyze", "/sslyze-scan/");
    startScan("sqlmap", "/sqlmap-scan/");
  };

  const startScan = async (scanName, endpoint) => {
    setLoading((prev) => ({ ...prev, [scanName]: true }));
    try {
      const response = await axios.post(`http://127.0.0.1:8000${endpoint}`, {
        url,
      });

      // Save results for each scan
      setResults((prev) => ({ ...prev, [scanName]: response.data.result }));
    } catch (err) {
      setError(`Failed to run the ${scanName} scan. Please try again.`);
    } finally {
      setLoading((prev) => ({ ...prev, [scanName]: false }));
    }
  };

  const renderNmapResult = (result) => {
    if (!result) return "No Nmap data available.";
    // Format key Nmap result data
    return (
      <div>
        <p>
          <strong>Summary:</strong>{" "}
          {result.nmaprun?.runstats?.finished?.["@summary"] || "Not available"}
        </p>
        <p>
          <strong>Hosts up:</strong>{" "}
          {result.nmaprun?.runstats?.hosts?.["@up"] || "0"}
        </p>
        <p>
          <strong>Total hosts:</strong>{" "}
          {result.nmaprun?.runstats?.hosts?.["@total"] || "0"}
        </p>
      </div>
    );
  };

  const renderNiktoResult = (result) => {
    if (!result) return "No Nikto data available.";

    // Split the result by lines for easier parsing
    const lines = result.split("\n");

    // Extracting key sections based on patterns in the text
    const startTime =
      lines.find((line) => line.includes("Start Time")) || "Not available";
    const server = lines.find((line) => line.includes("Server")) || "Unknown";
    const targetIP =
      lines.find((line) => line.includes("Target IP")) || "Unknown";
    const hostname =
      lines.find((line) => line.includes("Target Hostname")) || "Unknown";

    // Extract SSL Info block
    const sslInfoStart = lines.findIndex((line) => line.includes("SSL Info"));
    const sslInfoLines = lines.slice(sslInfoStart, sslInfoStart + 5);

    const sslInfo = {
      subject: sslInfoLines[1]?.replace("+ SSL Info:        Subject: ", ""),
      altnames: sslInfoLines[2]?.replace("Altnames: ", ""),
      ciphers: sslInfoLines[3]?.replace("Ciphers: ", ""),
      issuer: sslInfoLines[4]?.replace("Issuer: ", ""),
    };

    const vulnerabilities = lines
      .filter(
        (line) =>
          line.startsWith("+ /") ||
          (line.startsWith("+") && line.includes("header"))
      )
      .map((line, index) => <li key={index}>{line}</li>);

    const endTime =
      lines.find((line) => line.includes("End Time")) || "Not available";

    return (
      <div>
        <p>
          <strong>Start Time:</strong> {startTime.replace("+ Start Time:", "")}
        </p>
        <p>
          <strong>Target IP:</strong> {targetIP.replace("+ Target IP:", "")}
        </p>
        <p>
          <strong>Target Hostname:</strong>{" "}
          {hostname.replace("+ Target Hostname:", "")}
        </p>
        <p>
          <strong>Server:</strong> {server.replace("+ Server:", "")}
        </p>
        <p>
          <strong>SSL Info:</strong>
        </p>
        <div style={{ paddingLeft: "20px" }}>
          <p>
            <strong>Subject:</strong> {sslInfo.subject}
          </p>
          <p>
            <strong>Altnames:</strong> {sslInfo.altnames}
          </p>
          <p>
            <strong>Ciphers:</strong> {sslInfo.ciphers}
          </p>
          <p>
            <strong>Issuer:</strong> {sslInfo.issuer}
          </p>
        </div>
        <p>
          <strong>Vulnerabilities:</strong>
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "40px" }}>
          {vulnerabilities}
        </ul>
        <p>
          <strong>End Time:</strong> {endTime.replace("+ End Time:", "")}
        </p>
      </div>
    );
  };

  const renderSSLyzeResult = (response) => {
    if (!response) return "Keine SSLyze-Daten verfügbar.";

    // Überprüfen Sie, ob der Scan erfolgreich war
    if (response.status !== "Completed") {
      return `Scan fehlgeschlagen: ${response.error || "Unbekannter Fehler"}`;
    }

    const result = response.result;
    const leafCert = result.certificates?.[0]?.leaf_certificate;
    const vulnerabilities = result.vulnerabilities;

    return (
      <div>
        <h3>Zertifikatsinformationen</h3>
        {leafCert ? (
          <div>
            <p>
              <strong>Common Name:</strong>{" "}
              {leafCert.subject?.common_name?.[0] || "Nicht verfügbar"}
            </p>
            <p>
              <strong>Aussteller:</strong>{" "}
              {leafCert.issuer?.common_name?.[0] || "Unbekannt"}
            </p>
            <p>
              <strong>Gültig von:</strong>{" "}
              {leafCert.validity?.not_before || "Unbekannt"}
            </p>
            <p>
              <strong>Gültig bis:</strong>{" "}
              {leafCert.validity?.not_after || "Unbekannt"}
            </p>
          </div>
        ) : (
          <p>Keine Zertifikatsinformationen verfügbar.</p>
        )}

        <h3>Unterstützte Protokolle</h3>
        {result.protocols && result.protocols.length > 0 ? (
          <ul>
            {result.protocols.map((protocol, index) => (
              <li key={index}>{protocol}</li>
            ))}
          </ul>
        ) : (
          <p>Keine unterstützten Protokolle gefunden.</p>
        )}

        <h3>Schwachstellen</h3>
        {vulnerabilities && Object.keys(vulnerabilities).length > 0 ? (
          <ul>
            {Object.entries(vulnerabilities).map(([vuln, status], index) => (
              <li key={index}>
                <strong>{vuln}:</strong> {status}
              </li>
            ))}
          </ul>
        ) : (
          <p>Keine Informationen zu Schwachstellen verfügbar.</p>
        )}

        <h3>Scan-Zeit</h3>
        <p>{result.scan_time || "Unbekannt"}</p>
      </div>
    );
  };

  const renderSQLMapResult = (result) => {
    if (!result) return "No SQLMap data available.";
    return (
      <div>
        <p>
          <strong>Injections Found:</strong>{" "}
          {result.injections_found ? "Yes" : "No"}
        </p>
        <p>
          <strong>Details:</strong>
        </p>
        <ul>
          {result.details?.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderResult = (scanName, label, result, renderFunc) => {
    return (
      <div className="result">
        <h4>{label}</h4>
        {loading[scanName] ? (
          <div className="placeholder">
            <div className="loading-spinner" />
            <p>{label} scan is running...</p>
          </div>
        ) : result ? (
          renderFunc(result) // Display formatted results using the corresponding render function
        ) : (
          <p>No data available</p>
        )}
      </div>
    );
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
            <button className="url-submit cta-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}
      </div>

      {/* Display error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Display results only after submission */}
      {hasSubmitted && (
        <div className="results-section">
          {renderResult("nmap", "Nmap Results", results.nmap, renderNmapResult)}
          {renderResult(
            "nikto",
            "Nikto Results",
            results.nikto,
            renderNiktoResult
          )}
          {renderResult(
            "sslyze",
            "SSLyze Results",
            results.sslyze,
            renderSSLyzeResult
          )}
          {renderResult(
            "sqlmap",
            "SQLMap Results",
            results.sqlmap,
            renderSQLMapResult
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
