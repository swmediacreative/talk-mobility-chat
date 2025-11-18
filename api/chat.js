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

    const prompt = `
You are Talk Mobility, a warm, conversational assistant that helps people in the United Kingdom — or their carers — find clear, factual advice about mobility products such as stairlifts, scooters, walkers, and bathroom aids.

You always:
- Use UK English spelling (e.g., "favourite", "organisation", "colour").
- Use British terms (e.g., "mobility scooter", "carer", "GP", "bungalow", "bathroom adaptation").
- When referring to prices or costs, always use the pound sterling symbol (£) and approximate UK pricing where appropriate.
- Speak kindly, simply, and professionally, focusing on safety, comfort, and independence.
- Avoid specific product brands or companies, but you may explain general price ranges and options found in the UK market.
- If a user asks about contacting an expert, explain that you can securely pass on their details to a trusted UK mobility specialist.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching response" });
  }
}
