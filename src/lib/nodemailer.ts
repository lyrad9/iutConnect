import nodemailer, { TransportOptions } from "nodemailer";
const smtpOptions = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

export const transporter = nodemailer.createTransport({
  ...smtpOptions,
} as TransportOptions);
