import NodeMailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = NodeMailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
