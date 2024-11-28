import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./home.css"; // Assuming you have home-specific styles

Modal.setAppElement("#root");

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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(true); // Modal open by default

  // Close the modal when user accepts the disclaimer
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
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

      // Save the entire response data
      setResults((prev) => ({ ...prev, [scanName]: response.data }));
    } catch (err) {
      setError(`Failed to run the ${scanName} scan. Please try again.`);
    } finally {
      setLoading((prev) => ({ ...prev, [scanName]: false }));
    }
  };

  const renderNmapResult = (response) => {
    if (!response) return "No Nmap data available.";

    if (response.status !== "Completed") {
      return `Scan failed: ${response.error || "Unknown error"}`;
    }

    const result = response.result;

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

  const renderNiktoResult = (response) => {
    if (!response) return "No Nikto data available.";

    if (response.status !== "Completed") {
      return `Scan failed: ${response.error || "Unknown error"}`;
    }

    const result = response.result;

    return (
      <div>
        <h4>Version: Nikto v2.5.0</h4>
        <p>
          <strong>Target IP:</strong> {result.target?.ip || "N/A"}
        </p>
        <p>
          <strong>Target Hostname:</strong> {result.target?.hostname || "N/A"}
        </p>
        <p>
          <strong>Target Port:</strong> {result.target?.port || "N/A"}
        </p>

        <h4>SSL Info:</h4>
        <div className="ssl-info">
          <p>
            <strong>Subject:</strong> {result.ssl_info?.subject || "N/A"}
          </p>
          <div className="ssl-subsection">
            <p>
              <strong>Altnames:</strong> {result.ssl_info?.altnames || "N/A"}
            </p>
            <p>
              <strong>Ciphers:</strong> {result.ssl_info?.ciphers || "N/A"}
            </p>
            <p>
              <strong>Issuer:</strong> {result.ssl_info?.issuer || "N/A"}
            </p>
          </div>
        </div>

        <h4>Vulnerabilities:</h4>
        <ul className="vulnerabilities">
          {result.vulnerabilities && result.vulnerabilities.length > 0 ? (
            result.vulnerabilities.map((vuln, index) => (
              <li key={index}>
                {vuln.description}{" "}
                {vuln.link && <a href={vuln.link}>Reference</a>}
              </li>
            ))
          ) : (
            <li>No vulnerabilities found.</li>
          )}
        </ul>

        <p>
          <strong>Server:</strong> {result.server || "N/A"}
        </p>
        <p>
          <strong>Start Time:</strong>{" "}
          {result.scan_summary?.start_time || "N/A"}
        </p>
        <p>
          <strong>End Time:</strong> {result.scan_summary?.end_time || "N/A"}
        </p>
        <p>
          <strong>Termination Info:</strong>{" "}
          {result.scan_summary?.termination_info || "N/A"}
        </p>
        <p>
          <strong>Hosts Tested:</strong> {result.hosts_tested || "N/A"}
        </p>
      </div>
    );
  };

  const renderSSLyzeResult = (response) => {
    if (!response) return "No SSLyze data available.";

    if (response.status !== "Completed") {
      return `Scan failed: ${response.error || "Unknown error"}`;
    }

    const serverResult = response.result.server_scan_results?.[0] || {};
    const certInfo = serverResult.scan_result?.certificate_info?.result || {};
    const protocols = serverResult.connectivity_result || {};

    return (
      <div>
        <h3>Server Information</h3>
        <p>
          <strong>Hostname:</strong>{" "}
          {serverResult.server_location?.hostname || "Unknown"}
        </p>
        <p>
          <strong>Port:</strong>{" "}
          {serverResult.server_location?.port || "Unknown"}
        </p>

        <h3>Certificate Information</h3>
        {certInfo.certificate_deployments ? (
          certInfo.certificate_deployments.map((cert, index) => (
            <div key={index}>
              <p>
                <strong>Common Name:</strong>{" "}
                {cert.received_certificate_chain?.[0]?.subject
                  ?.rfc4514_string || "Not available"}
              </p>
              <p>
                <strong>Issuer:</strong>{" "}
                {cert.received_certificate_chain?.[0]?.issuer?.rfc4514_string ||
                  "Unknown"}
              </p>
              <p>
                <strong>Valid From:</strong>{" "}
                {cert.received_certificate_chain?.[0]?.not_valid_before ||
                  "Unknown"}
              </p>
              <p>
                <strong>Valid Until:</strong>{" "}
                {cert.received_certificate_chain?.[0]?.not_valid_after ||
                  "Unknown"}
              </p>
            </div>
          ))
        ) : (
          <p>No certificate information available.</p>
        )}

        <h3>Supported Protocols</h3>
        <p>
          <strong>Highest TLS Version Supported:</strong>{" "}
          {protocols.highest_tls_version_supported || "Unknown"}
        </p>
        <p>
          <strong>Cipher Suite Supported:</strong>{" "}
          {protocols.cipher_suite_supported || "Unknown"}
        </p>

        <h3>Vulnerabilities</h3>
        {serverResult.scan_result?.vulnerabilities ? (
          <ul>
            {Object.entries(serverResult.scan_result.vulnerabilities).map(
              ([vuln, status], index) => (
                <li key={index}>
                  <strong>{vuln}:</strong> {status}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No vulnerability information available.</p>
        )}
      </div>
    );
  };

  const renderSQLMapResult = (response) => {
    if (!response) return "No SQLMap data available.";

    if (response.status !== "Completed") {
      return `Scan failed: ${response.error || "Unknown error"}`;
    }

    const result = response.result;

    return (
      <div>
        <p>
          <strong>Injections Found:</strong>{" "}
          {result.injections_found ? "Yes" : "No"}
        </p>

        {result.injections_found ? (
          <>
            <p>
              <strong>Injection Details:</strong>
            </p>
            <ul>
              {result.details?.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>
            No SQL injection vulnerabilities found in the tested parameters.
          </p>
        )}
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

  const downloadTextFile = () => {
    if (!results.nmap && !results.nikto && !results.sslyze && !results.sqlmap) {
      alert("No results available for download.");
      return;
    }

    let content = "==== Penetration Testing Results ====\n\n";

    content += "=== Nmap Results ===\n";
    if (results.nmap?.status === "Completed") {
      const result = results.nmap.result;
      content += `Summary: ${
        result.nmaprun?.runstats?.finished?.["@summary"] || "Not available"
      }\n`;
      content += `Hosts up: ${
        result.nmaprun?.runstats?.hosts?.["@up"] || "0"
      }\n`;
      content += `Total hosts: ${
        result.nmaprun?.runstats?.hosts?.["@total"] || "0"
      }\n\n`;

      content += "Ports:\n";
      if (result.nmaprun?.host?.ports?.port) {
        result.nmaprun.host.ports.port.forEach((port) => {
          content += `  Port: ${port.portid}, State: ${
            port.state.state
          }, Service: ${port.service?.name || "Unknown"}\n`;
        });
      } else {
        content += "  No port information available.\n";
      }
    } else {
      content += "Nmap scan failed.\n";
    }
    content += "\n";

    content += "=== Nikto Results ===\n";
    if (results.nikto?.status === "Completed") {
      const result = results.nikto.result;
      content += `Target IP: ${result.target?.ip || "N/A"}\n`;
      content += `Target Hostname: ${result.target?.hostname || "N/A"}\n`;
      content += `Target Port: ${result.target?.port || "N/A"}\n`;

      content += "\nSSL Info:\n";
      content += `  Subject: ${result.ssl_info?.subject || "N/A"}\n`;
      content += `  Altnames: ${result.ssl_info?.altnames || "N/A"}\n`;
      content += `  Ciphers: ${result.ssl_info?.ciphers || "N/A"}\n`;
      content += `  Issuer: ${result.ssl_info?.issuer || "N/A"}\n`;

      content += "\nVulnerabilities:\n";
      if (result.vulnerabilities && result.vulnerabilities.length > 0) {
        result.vulnerabilities.forEach((vuln) => {
          content += `  - ${vuln.description}\n`;
        });
      } else {
        content += "  No vulnerabilities found.\n";
      }
    } else {
      content += "Nikto scan failed.\n";
    }
    content += "\n";

    content += "=== SSLyze Results ===\n";
    if (results.sslyze?.status === "Completed") {
      const serverResult = results.sslyze.result.server_scan_results?.[0] || {};
      const certInfo = serverResult.scan_result?.certificate_info?.result || {};
      const protocols = serverResult.connectivity_result || {};

      content += `Hostname: ${
        serverResult.server_location?.hostname || "Unknown"
      }\n`;
      content += `Port: ${serverResult.server_location?.port || "Unknown"}\n\n`;

      content += "Certificate Information:\n";
      if (certInfo.certificate_deployments) {
        certInfo.certificate_deployments.forEach((cert) => {
          content += `  Common Name: ${
            cert.received_certificate_chain?.[0]?.subject?.rfc4514_string ||
            "N/A"
          }\n`;
          content += `  Issuer: ${
            cert.received_certificate_chain?.[0]?.issuer?.rfc4514_string ||
            "Unknown"
          }\n`;
          content += `  Valid From: ${
            cert.received_certificate_chain?.[0]?.not_valid_before || "Unknown"
          }\n`;
          content += `  Valid Until: ${
            cert.received_certificate_chain?.[0]?.not_valid_after || "Unknown"
          }\n\n`;
        });
      } else {
        content += "  No certificate information available.\n";
      }

      content += "Supported Protocols:\n";
      content += `  Highest TLS Version Supported: ${
        protocols.highest_tls_version_supported || "Unknown"
      }\n`;
      content += `  Cipher Suite Supported: ${
        protocols.cipher_suite_supported || "Unknown"
      }\n`;

      content += "\nVulnerabilities:\n";
      if (serverResult.scan_result?.vulnerabilities) {
        Object.entries(serverResult.scan_result.vulnerabilities).forEach(
          ([vuln, status]) => {
            content += `  ${vuln}: ${status}\n`;
          }
        );
      } else {
        content += "  No vulnerabilities found.\n";
      }
    } else {
      content += "SSLyze scan failed.\n";
    }
    content += "\n";

    content += "=== SQLMap Results ===\n";
    if (results.sqlmap?.status === "Completed") {
      const result = results.sqlmap.result;
      content += `Injections Found: ${
        result.injections_found ? "Yes" : "No"
      }\n`;
      if (result.details) {
        content += "Details:\n";
        result.details.forEach((detail) => {
          content += `  - ${detail}\n`;
        });
      }
    } else {
      content += "SQLMap scan failed.\n";
    }
    content += "\n";

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "scan_results.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-content">
      {/* Disclaimer Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Disclaimer"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Legal Disclaimer</h2>
        <p>
          This website provides tools for penetration testing. By accessing or
          using these tools, you agree that:
        </p>
        <ul>
          <li>
            You are solely responsible for ensuring that you have obtained
            proper authorization from the owner of the website before conducting
            any penetration testing.
          </li>
          <li>
            The website, its creators, and any associated parties disclaim any
            and all liability for the use or misuse of the provided tools.
          </li>
          <li>
            Unauthorized use of these tools to conduct penetration tests on
            websites without explicit consent is illegal and may result in legal
            consequences.
          </li>
          <li>
            You agree to comply with all applicable laws and regulations related
            to the use of penetration testing tools.
          </li>
        </ul>
        <p>
          By clicking "I Agree", you acknowledge and accept these terms and
          agree to use the tools provided only for ethical and legal purposes.
        </p>
        <button className="agree-button" onClick={closeModal}>
          I Agree
        </button>
      </Modal>
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

          {/* Download Button */}
          <button
            className="cta-button download-button"
            onClick={downloadTextFile}
            disabled={Object.values(loading).some((isLoading) => isLoading)}
          >
            Download Results as Text File
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
