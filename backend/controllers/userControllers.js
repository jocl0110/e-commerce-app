import User from "..//models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { transporter } from "../config/nodeMailer.js";

dotenv.config();

export const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({
      username,
    });
    if (existingUser) {
      return res.status(404).json({
        message: "Username already exists",
      });
    }
    const existingEmail = await User.findOne({
      email,
    });
    if (existingEmail) {
      return res.status(404).json({
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );

    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to E-COMMERCE APP</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
                font-size: 24px;
            }
            p {
                color: #555;
                font-size: 16px;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hello ${firstName},</h1>
            <p>Thank you for subscribing to **E-COMMERCE APP**!</p>
            <p>Your account has been successfully created. We are thrilled to have you on board. Here are some things you can expect:</p>
            <ul>
                <li>Explore our collection of products at unbeatable prices.</li>
                <li>Track your order history easily.</li>
                <li>Enjoy exclusive discounts and offers for registered users.</li>
            </ul>
            <p>To get started, click the button below to visit your profile:</p>
            <a href="https://www.fakestoreapp.com/profile" class="button">Visit Profile</a>
            <p>If you have any questions or need help, feel free to reach out to us at <a href="mailto:support@fakestoreapp.com">support@fakestoreapp.com</a>.</p>
            <p>Best regards,</p>
            <p>The E-COMMERCE APP Team</p>
        </div>
    </body>
    </html>
  `;
    const info = await transporter.sendMail({
      from: "E-COMMERCE APP Management",
      to: email,
      subject: "Welcome and Thanks for choosing E-COMMERCE APP",
      html: htmlContent,
    });
    console.log(`Message sent: ${info.messageId}`);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "customer",
    });
    res.status(201).json({
      message: "Signup successfully",
    });
  } catch (error) {
    console.log(`Error registering user: ${error}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
