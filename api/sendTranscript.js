// api/sendTranscript.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { conversation, timestamp } = req.body || {};
  if (!conversation || !Array.isArray(conversation)) {
    return res
      .status(400)
      .json({ error: 'Invalid or missing conversation data' });
  }

  console.log('Loaded RESEND_API_KEY:', !!process.env.RESEND_API_KEY);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const transcript = conversation
    .map((m) => {
      const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
      const who = m.role === 'user' ? 'User' : 'Talk Mobility';
      return `[${time}] ${who}: ${m.content}`;
    })
    .join('\n\n');

  try {
    await resend.emails.send({
      from: 'Talk Mobility <onboarding@resend.dev>', // safer test sender
      to: 'hello@talkmobility.co.uk',
      subject: `New Talk Mobility Conversation – ${
        timestamp || new Date().toISOString()
      }`,
      text: transcript,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    res
      .status(500)
      .json({ error: 'Email send failed', details: error.message });
  }
}
