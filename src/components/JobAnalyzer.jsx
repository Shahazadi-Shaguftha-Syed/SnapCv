import { useState } from "react";
import { analyzeJob } from "../ai";

export default function JobAnalyzer({ formData }) {
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDesc.trim()) return alert("Paste a job description first!");
    const filled = Object.values(formData).filter((v) => v.trim() !== "");
    if (filled.length < 3) return alert("Fill at least 3 fields in your resume first!");
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeJob(formData, jobDesc);
      setResult(data);
    } catch (err) {
      alert("Analysis failed. Try again!");
    }
    setLoading(false);
  };

  return (
    <div className="analyzer-box">
      <h2>🕵️ Job Description Analyzer</h2>
      <p className="analyzer-subtitle">
        Paste any job description — get a personalized strategy to tailor your resume for that exact role.
      </p>

      <textarea
        className="ats-textarea"
        rows={6}
        placeholder="Paste the job description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button
        className="analyzer-btn"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? "Analyzing... 🔍" : "🕵️ Analyze This Job"}
      </button>

      {result && (
        <div className="analyzer-result">

          {/* Verdict */}
          <div className="verdict-box">
            <span className="verdict-label">⚖️ Honest Verdict</span>
            <p className="verdict-text">{result.verdict}</p>
          </div>

          {/* Company Vibe */}
          <div className="vibe-box">
            <span className="vibe-label">🎯 What They Really Want</span>
            <p className="vibe-text">{result.companyVibe}</p>
          </div>

          {/* Highlight vs Remove */}
          <div className="two-col">
            <div className="col-box highlight-box">
              <p className="col-title">✅ Emphasize These</p>
              <ul>
                {result.highlight.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="col-box remove-box">
              <p className="col-title">❌ Remove / Downplay</p>
              <ul>
                {result.remove.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rewritten Summary */}
          <div className="rewritten-box">
            <p className="rewritten-label">✍️ Your Rewritten Summary (Tailored for This Job)</p>
            <p className="rewritten-text">{result.rewrittenSummary}</p>
            <button
              className="copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(result.rewrittenSummary);
                alert("Copied to clipboard!");
              }}
            >
              📋 Copy to Resume
            </button>
          </div>

        </div>
      )}
    </div>
  );
}