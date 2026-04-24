import { useState } from "react";
import Form from "./components/Form";
import ResumePreview from "./components/ResumePreview";
import DownloadBtn from "./components/DownloadBtn";
import ATSChecker from "./components/ATSChecker";
import RoastMode from "./components/RoastMode";
import JobAnalyzer from "./components/JobAnalyzer";
import "./App.css";

const defaultData = {
  name: "",
  email: "",
  phone: "",
  linkedin: "",
  github:"",
  summary: "",
  skills: "",
  education: "",
  projects: "",
  experience: "",
};

function getCompleteness(formData) {
  const fields = Object.values(formData);
  const filled = fields.filter((v) => v.trim() !== "").length;
  return Math.round((filled / fields.length) * 100);
}

function getScoreLabel(score) {
  if (score <= 30) return { label: "Just Started 🌱", color: "#FF4D4D" };
  if (score <= 60) return { label: "Getting There 🔥", color: "#FF9F43" };
  if (score <= 89) return { label: "Almost Done ⚡", color: "#FDCB6E" };
  return { label: "Resume Ready! 🎉", color: "#00D2D3" };
}

const TABS = [
  { id: "builder", label: "📝 Builder" },
  { id: "ats", label: "📊 ATS Score" },
  { id: "roast", label: "🔥 Roast Mode" },
  { id: "analyzer", label: "🔍 Analyzer" },
];

export default function App() {
  const [formData, setFormData] = useState(defaultData);
  const [tab, setTab] = useState("builder");
  const score = getCompleteness(formData);
  const { label, color } = getScoreLabel(score);

  return (
    <div className="app-container">
      <div className="mesh-bg"></div>
      
      <header className="navbar">
        <div className="navbar-logo">⚡ SnapCV</div>
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Completeness Bar */}
      <div className="score-wrapper">
        <div className="score-top">
          <span className="score-label">{label}</span>
          <span className="score-percent" style={{ color }}>{score}%</span>
        </div>
        <div className="score-bar-bg">
          <div
            className="score-bar-fill"
            style={{ width: `${score}%`, background: color }}
          />
        </div>
      </div>

      {/* Tab Content */}
      {tab === "builder" && (
        <div className="main-layout">
          <div className="left-panel">
            <Form formData={formData} setFormData={setFormData} />
            <DownloadBtn />
          </div>
          <div className="right-panel">
            <ResumePreview formData={formData} />
          </div>
        </div>
      )}
      {tab === "ats" && <ATSChecker formData={formData} />}
      {tab === "roast" && <RoastMode formData={formData} />}
      {tab === "analyzer" && <JobAnalyzer formData={formData} />}
    </div>
  );
}