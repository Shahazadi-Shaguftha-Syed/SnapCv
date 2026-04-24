import { useState } from "react";
import { checkATS } from "../ai";

export default function ATSChecker({ formData }) {
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!jobDesc.trim()) return alert("Paste a job description first!");
    setLoading(true);
    setResult(null);
    try {
      const data = await checkATS(formData, jobDesc);
      setResult(data);
    } catch (err) {
      alert("ATS check failed. Try again!");
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#4ade80";
    if (score >= 50) return "#facc15";
    return "#f87171";
  };

  return (
    <div className="ats-box">
      <h2>🎯 ATS Score Checker</h2>
      <p className="ats-subtitle">Paste a job description to see how well your resume matches</p>

      <textarea
        className="ats-textarea"
        rows={5}
        placeholder="Paste the job description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button className="ats-btn" onClick={handleCheck} disabled={loading}>
        {loading ? "Analyzing..." : "⚡ Check ATS Score"}
      </button>

      {result && (
        <div className="ats-result">
          {/* Score Circle */}
          <div className="ats-score-wrapper">
            <div
              className="ats-score-circle"
              style={{ borderColor: getScoreColor(result.score) }}
            >
              <span className="ats-score-number" style={{ color: getScoreColor(result.score) }}>
                {result.score}%
              </span>
              <span className="ats-score-text">ATS Match</span>
            </div>
          </div>

          {/* Suggestion */}
          <div className="ats-suggestion">
            💡 {result.suggestion}
          </div>

          {/* Matched Keywords */}
          {result.matchedKeywords?.length > 0 && (
            <div className="ats-keywords">
              <p className="kw-title">✅ Matched Keywords</p>
              <div className="kw-grid">
                {result.matchedKeywords.map((kw, i) => (
                  <span key={i} className="kw-tag matched">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {result.missingKeywords?.length > 0 && (
            <div className="ats-keywords">
              <p className="kw-title">❌ Missing Keywords</p>
              <div className="kw-grid">
                {result.missingKeywords.map((kw, i) => (
                  <span key={i} className="kw-tag missing">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}