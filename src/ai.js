async function callAI(prompt) {
  try {
    const response = await fetch("http://localhost:3001/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error("Malformed AI response:", data);
      throw new Error("Invalid AI response format");
    }

    return data.content[0].text;
  } catch (err) {
    console.error("AI Call Error:", err);
    throw err;
  }
}

export async function rewriteWithAI(section, content) {
  return await callAI(`You are a professional resume writer. Rewrite the following "${section}" section into strong, ATS-optimized resume content using action verbs and quantified results where possible. Keep it concise and impactful. Return only the rewritten content, nothing else.

Content to rewrite:
${content}`);
}

export async function checkATS(resumeData, jobDescription) {
  const resumeText = Object.entries(resumeData)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const result = await callAI(`You are an ATS expert. Compare this resume against the job description and return ONLY a JSON object with no markdown, no backticks, just raw JSON:
{
  "score": <number 0-100>,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestion": "<one short sentence tip>"
}

Resume:
${resumeText}

Job Description:
${jobDescription}`);

  try {
    // Clean potential markdown if AI ignored instructions
    const cleanedResult = result.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedResult);
  } catch (e) {
    console.error("JSON Parse Error (ATS):", result);
    throw new Error("AI returned invalid JSON for ATS check");
  }
}

export async function roastResume(resumeData) {
  const resumeText = Object.entries(resumeData)
    .filter(([, v]) => v.trim() !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const result = await callAI(`You are a brutally honest senior software engineer doing a resume review. Roast this resume hard but helpfully. Be specific, funny, and direct. For each problem, give the exact fix. Return ONLY a JSON array, no markdown, no backticks:
[
  { "roast": "your roast here", "fix": "exact fix here" }
]

Resume:
${resumeText}`);

  try {
    const cleanedResult = result.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedResult);
  } catch (e) {
    console.error("JSON Parse Error (Roast):", result);
    throw new Error("AI returned invalid JSON for Roast");
  }
}

export async function analyzeJob(resumeData, jobDescription) {
  const resumeText = Object.entries(resumeData)
    .filter(([, v]) => v.trim() !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const result = await callAI(`You are a senior career coach. Analyze this job description against the candidate's resume and return ONLY a JSON object, no markdown, no backticks:
{
  "companyVibe": "<what this company really wants in 1 sentence>",
  "highlight": ["skill to emphasize 1", "skill 2", "skill 3"],
  "remove": ["thing to remove 1", "thing 2"],
  "rewrittenSummary": "<summary tailored for this job>",
  "verdict": "<one honest sentence: are they a good fit and why>"
}

Resume:
${resumeText}

Job Description:
${jobDescription}`);

  try {
    const cleanedResult = result.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedResult);
  } catch (e) {
    console.error("JSON Parse Error (Analyzer):", result);
    throw new Error("AI returned invalid JSON for Job Analysis");
  }
}