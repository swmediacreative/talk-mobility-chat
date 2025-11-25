// api/sendTranscript.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  // --- CORS (allows your Hostinger front-end to call this) ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel parses JSON automatically with proper headers; fallback if needed
    const body = req.body ?? {};
    const { conversation, timestamp } = body;

    if (!Array.isArray(conversation) || conversation.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty conversation array' });
    }

    // Build readable transcript
    const lines = conversation.map((m) => {
      const who = m.role === 'user' ? 'User' : 'Talk Mobility';
      const content = String(m.content ?? '').trim();
      return `${who}: ${content}`;
    });

    const transcript = lines.join('\n\n');

    // Basic size guard (avoid huge emails)
    const MAX_CHARS = 15000;
    const textOut = transcript.length > MAX_CHARS
      ? transcript.slice(0, MAX_CHARS) + '\n\n[...] (truncated)'
      : transcript;

    // Init Resend
    const apiKeyPresent = !!process.env.RESEND_API_KEY;
    if (!apiKeyPresent) {
      console.error('❌ RESEND_API_KEY is missing');
      return res.status(500).json({ error: 'Server email configuration missing' });
    }
    const resend = new Rese
