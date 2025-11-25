// api/sendTranscript.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  // --- CORS headers for Hostinger frontend ---
  res.setHeader('Access-Control-Allow-Origin', 'https://talkmobility.co.uk');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --- Handle preflight (OPTIONS) ---
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { conversation, timestamp } = req.body || {};

    if (!Array.isArray(conversation) || conversation.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty conversation array' });
    }

    // --- Format transcript nicely ---
    const lines = conversation.map((m, i) => {
      const who = m.role === 'user' ? 'User' : 'Talk Mobility';
      const content = String(m.content || '').trim();
      return `${i + 1}. ${who}: ${content}`;
    });
    const transcript = lines.join('\n\n');

    // --- Limit to avoid oversized emails ---
    const MAX_CHARS = 15000;
    const textOut = transcript.length > MAX_CHARS
      ? transcript.slice(0, MAX_CHARS) + '\n\n[...] (truncated)'
      : transcript;

    // --- Init Resend ---
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ Missing RESEND_API_KEY environment variable');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const subject = `New Talk Mobility Conversation – ${timestamp || new Date().toISOString()}`;

    // --- Send the email ---
    const result = await resend.emails.send({
      from: 'Talk Mobility <onboarding@resend.dev>',
      to: 'hello@talkmobility.co.uk',
      subject,
      text: textOut,
    });

    console.log('📧 Email sent successfully:', result?.id);
    return res.status(200).json({ success: true, id: result?.id || null });
  } catch (err) {
    console.error('❌ Error in sendTranscript:', err);
    return res.status(500).json({
      error: 'Email send failed',
      details: err?.message || String(err),
    });
  }
}
