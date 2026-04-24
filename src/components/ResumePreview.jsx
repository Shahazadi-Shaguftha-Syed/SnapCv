export default function ResumePreview({ formData }) {
  const { name, email, phone, linkedin,github, summary, skills, education, projects, experience } = formData;

  return (
    <div className="resume-preview" id="resume-preview">
      {/* Header */}
      <div className="resume-header">
        <h1>{name || "Your Name"}</h1>
        <div className="resume-contact">
          {email && <span>✉ {email}</span>}
          {phone && <span>📞 {phone}</span>}
          {linkedin && <a href={linkedin} target="_blank" rel="noreferrer">🔗 LinkedIn</a>}
          {github && <a href={github} target="_blank" rel="noreferrer">🔗 github</a>}
        </div>
      </div>

      {summary && (
        <Section title="Profile Summary">
          <p className="section-text">{summary}</p>
        </Section>
      )}

      {skills && (
        <Section title="Skills">
          <div className="skills-grid">
            {skills.split(",").map((s, i) => (
              <span key={i} className="skill-tag">{s.trim()}</span>
            ))}
          </div>
        </Section>
      )}

      {education && (
        <Section title="Education">
          <p className="section-text">{education}</p>
        </Section>
      )}

      {experience && (
        <Section title="Experience">
          <p className="section-text">{experience}</p>
        </Section>
      )}

      {projects && (
        <Section title="Projects">
          <p className="section-text">{projects}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="resume-section">
      <div className="section-title-row">
        <h3>{title}</h3>
        <div className="section-line" />
      </div>
      {children}
    </div>
  );
}