import { useState } from "react";
import { rewriteWithAI } from "../ai";

export default function Form({ formData, setFormData }) {
  const [loadingField, setLoadingField] = useState(null);

  const handle = (e) => {
    let value = e.target.value;
    if (e.target.name === "phone") {
      value = value.replace(/[^0-9+]/g, ""); // Allow numbers and + for phone
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleRewrite = async (fieldName) => {
    if (!formData[fieldName].trim()) return;
    setLoadingField(fieldName);
    try {
      const rewritten = await rewriteWithAI(fieldName, formData[fieldName]);
      setFormData({ ...formData, [fieldName]: rewritten });
    } catch (err) {
      alert("AI rewrite failed. Try again!");
    }
    setLoadingField(null);
  };

  const fields = [
    { label: "Full Name", name: "name", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Phone", name: "phone", type: "tel" },
    { label: "LinkedIn URL", name: "linkedin", type: "url" },
    { label: "Github URL", name: "github", type: "url" },
  ];

  const textareas = ["summary", "skills", "education", "experience", "projects"];

  return (
    <div className="form-box">
      <h2>Your Details</h2>

      {fields.map((f) => (
        <div className="form-group" key={f.name}>
          <label>{f.label}</label>
          <input
            type={f.type}
            name={f.name}
            value={formData[f.name]}
            onChange={handle}
            placeholder={f.label}
            required={f.name === "email" || f.name === "name"}
          />
        </div>
      ))}

      {textareas.map((key) => (
        <div className="form-group" key={key}>
          <div className="label-row">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <button
              className="ai-btn"
              onClick={() => handleRewrite(key)}
              disabled={loadingField === key}
            >
              {loadingField === key ? "Rewriting..." : "✨ AI Rewrite"}
            </button>
          </div>
          <textarea
            name={key}
            value={formData[key]}
            onChange={handle}
            placeholder={`Enter your ${key}...`}
            rows={3}
          />
        </div>
      ))}
    </div>
  );
}