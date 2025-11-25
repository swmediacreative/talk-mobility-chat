import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { conversation, timestamp } = req.body || {};

  if (!conversation || !Array.isArray(conversation)) {
    return res.status(400).json({ error: 'Invalid or missing conversation data' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const transcript = conversation
    .map((m) => `${m.role === 'user' ? 'User' : 'Talk Mobility'}: ${m.content}`)
    .join('\n\n');

  try {
    await resend.emails.send({
      from: 'Talk Mobility <noreply@talkmobility.co.uk>',
      to: 'hello@talkmobility.co.uk',
      subject: `New Talk Mobility Conversation – ${timestamp || new Date().toISOString()}`,
      text: transcript,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Email send failed', details: error.message });
  }
}
