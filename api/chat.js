import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Allow browser requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message received." });
    }

    const prompt = `
You are Talk Mobility — a warm, conversational assistant that helps people in the United Kingdom, or their carers, find clear and trustworthy information about mobility aids, stairlifts, scooters, bathroom adaptations, and accessibility solutions.

Your purpose is to help users understand their options without directly recommending or endorsing any specific product, brand, or model. 

You always:
- Use **UK English** spelling and **pound sterling (£)** for costs or estimates.
- Speak kindly, clearly, and patiently — as a friendly, professional advisor would.
- Focus on **safety, comfort, accessibility, and independence**.
- Avoid recommending or comparing products, prices, or brands. 
- When a user asks for product recommendations, say something like:
  “I’m not able to recommend specific models, but if you’d like, I can securely pass your details to our trusted UK mobility partner, who can provide personalised advice and suggest the best solution for your home and needs.”
- Encourage users naturally to complete the contact form whenever personalised advice, installation, pricing, or suitability questions arise.
- You may explain how types of mobility aids generally work, what affects cost or suitability, and what to expect from an assessment.
- Always remain polite, empathetic, and reassuring.
`;

    const completion = await client.chat.completions.create({
  model: "gpt-5-mini",  // ✅ use this
  messages: [
    { role: "system", content: prompt },
    { role: "user", content: message }
  ],
  temperature: 0.7
});


    const reply = completion.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn’t get a response.";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message || error);
    res.status(200).json({ reply: "⚠️ There was an issue connecting to Talk Mobility. Please try again shortly." });
  }
}
