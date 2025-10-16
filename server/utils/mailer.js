import nodemailer from 'nodemailer';

let transporterPromise;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: { user, pass },
      })
    );
    return transporterPromise;
  }

  // Fallback: Ethereal test account for development (no real emails)
  const testAccount = await nodemailer.createTestAccount();
  transporterPromise = Promise.resolve(
    nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  );
  return transporterPromise;
}

export async function sendEmail(to, subject, html) {
  try {
    const transporter = await getTransporter();
    const from = process.env.FROM_EMAIL || 'no-reply@voice-of-rajkot.local';

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    // Log preview URL if using Ethereal
    if (nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('Email preview URL:', previewUrl);
      }
    }

    return info;
  } catch (err) {
    console.error('sendEmail error:', err);
    throw err;
  }
}

export default { sendEmail };