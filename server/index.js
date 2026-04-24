const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/claude", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: req.body.messages,
        max_tokens: 1000,
      }),
    });
    console.log("Groq status:", response.status);
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Groq API error:", data);
      return res.status(response.status).json({ error: data.error?.message || "Groq API error", raw: data });
    }

    if (!data.choices || !data.choices[0]) {
      console.error("Unexpected Groq response structure:", data);
      return res.status(500).json({ error: "Invalid Groq response structure", raw: data });
    }

    res.json({
      content: [{ text: data.choices[0].message.content }]
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("✅ Proxy server running on port 3001"));