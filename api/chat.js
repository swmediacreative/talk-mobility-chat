// /pages/api/chat.js   or   /api/chat.js

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, topic } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid request: message missing" });
    }

    // 🧠 Build Talk Mobility’s system prompt
    const baseContext = `
You are Talk Mobility, a warm, factual, and supportive assistant who helps people
choose and understand mobility products such as stairlifts, scooters, walkers,
and bathroom aids. You never collect personal data and never promote specific brands.
You always prioritise safety, independence, and comfort.
`;

    const topicHint = topic
      ? `The user is currently asking about ${topic}s. Please focus your advice on that area.`
      : `The user has not specified a topic yet. Offer friendly, general mobility advice.`;

    const messages = [
      { role: "system", content: `${baseContext}\n${topicHint}` },
      { role: "user", content: message }
    ];

    // --- Call the OpenAI API ---
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 350
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "I'm here to help with mobility advice.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Server error while contacting OpenAI." });
  }
}
