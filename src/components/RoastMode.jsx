import { useState } from "react";
import { roastResume } from "../ai";

export default function RoastMode({ formData }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRoast = async () => {
    const filled = Object.values(formData).filter((v) => v.trim() !== "");
    if (filled.length < 3) return alert("Fill at least 3 fields in your resume first!");
    setLoading(true);
    setResult(null);
    try {
      const data = await roastResume(formData);
      setResult(data);
    // } catch (err) {
    //   alert("Roast failed. Try again!");
    // }
    } catch (err) {
      console.error("Roast error:", err);
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="roast-box">
      <div className="roast-header">
        <h2>🔥 Resume Roast Mode</h2>
        <p className="roast-subtitle">
          Get brutally honest feedback from a senior engineer. No sugarcoating. Just truth + fixes.
        </p>
        <button
          className="roast-btn"
          onClick={handleRoast}
          disabled={loading}
        >
          {loading ? "Roasting your resume... 👀" : "🔥 Roast My Resume"}
        </button>
      </div>

      {result && (
        <div className="roast-results">
          {result.map((item, i) => (
            <div className="roast-card" key={i}>
              <div className="roast-flame">🔥</div>
              <div className="roast-content">
                <p className="roast-text">"{item.roast}"</p>
                <div className="roast-fix">
                  <span className="fix-label">✅ Fix:</span>
                  <span className="fix-text">{item.fix}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="roast-footer">
            <p>Now go fix these and come back for another roast 😤</p>
          </div>
        </div>
      )}
    </div>
  );
}