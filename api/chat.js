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
You are Talk Mobility, a warm, UK-based assistant that helps people find mobility solutions.
Always use clear formatting:
- Use bullet points (with "- " or "• ") for lists
- Use numbered lists when explaining steps
- Use bold for key terms (e.g., **independence**, **safety**, **comfort**)
- Separate ideas with line breaks for readability
Use UK English and pound sterling (£) for all currency references.
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
