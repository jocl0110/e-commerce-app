import NodeMailer from "nodemailer";
import { EMAIL_PORT } from "../constants/env";

const transporter = NodeMailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;
