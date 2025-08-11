import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

export async function enviarOTP(correo, codigo) {
  const info = await transporter.sendMail({
    from: `"Recetario K-pop" <${process.env.MAIL_USER}>`,
    to: correo,
    subject: "Tu código OTP de verificación",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Verifica tu correo</h2>
        <p>Tu código es:</p>
        <div style="font-size:28px;font-weight:700;letter-spacing:4px">${codigo}</div>
        <p>Vence en 10 minutos.</p>
      </div>
    `,
  });
  return info;
}
