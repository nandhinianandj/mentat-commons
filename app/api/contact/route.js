import nodemailer from 'nodemailer';

// Global transporter cache to prevent per-request instantiation across Vercel serverless warm states
let cachedTransporter = null;

function getTransporter() {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 100
    });
  }
  return cachedTransporter;
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), { status: 400 });
    }

    const transporter = getTransporter();
    const toEmail = process.env.TO_EMAIL || 'nandhini.jeyahar@gmail.com';

    await transporter.sendMail({
      from: `"Mentat Commons Site" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Contact: ${name} — Mentat Commons`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message.replace(/\n/g,'<br/>')}</p>`
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('Contact API error', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
