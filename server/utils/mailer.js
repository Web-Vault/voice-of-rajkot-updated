import nodemailer from 'nodemailer';

let transporterPromise;

async function getTransporter() {
      if (transporterPromise) return transporterPromise;

      const host = process.env.SMTP_HOST;
      const port = Number(process.env.SMTP_PORT || 587);
      const user = process.env.SMTP_USER;
      const rawPass = process.env.SMTP_PASS;
      const pass = (rawPass || '').replace(/\s+/g, ''); // trim spaces often present in app passwords

      if (host && user && pass) {
            const isGmail = /gmail\.com$/i.test(host);
            const transportOptions = isGmail
                  ? { service: 'gmail', auth: { user, pass } }
                  : { host, port, secure: port === 465, auth: { user, pass } };

            transporterPromise = Promise.resolve(
                  nodemailer.createTransport(transportOptions)
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
            const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@voice-of-rajkot.local';

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