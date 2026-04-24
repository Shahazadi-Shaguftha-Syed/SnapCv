const fetch = require('node-fetch');
require('dotenv').config({ path: '../server/.env' });

async function testGroq() {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: "Say hello" }],
      max_tokens: 10,
    }),
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

testGroq();
