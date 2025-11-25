// api/testEmail.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  // --- Allow CORS so you can call it from your browser ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' });

  try {
    // --- Ensure key exists ---
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ Missing RESEND_API_KEY');
      return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // --- Send test email ---
    const result = await resend.emails.send({
      from: 'Talk Mobility <onboarding@resend.dev>', // change later to your verified domain
      to: 'hello@talkmobility.co.uk',
      subject: '✅ Talk Mobility Test Email from Vercel',
      text: `This is a test email sent via your Talk Mobility Vercel backend at ${new Date().toISOString()}.`,
    });

    console.log('📧 Resend test email result:', result);
    return res.status(200).json({
      success: true,
      message: 'Test email sent (check your inbox or Resend dashboard)',
      result,
    });
  } catch (err) {
    console.error('❌ Error sending test email:', err);
    return res.status(500).json({
      success: false,
      error: err.message || String(err),
    });
  }
}
