import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/NodeMailer";
import catchErrors from "../utils/catchErrors";
import User from "../models/User";
import { JWT_SECRET, SALT } from "../constants/env";

// User Registration
export const RegisterUser = catchErrors(
  async (req: express.Request, res: express.Response) => {
    const { firstName, lastName, username, email, password, role } = req.body;
    const isAdmin = role === "admin";
    if (isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to register as an admin",
      });
    }
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

      if (!process.env.SALT) {
        throw new Error("The salt is undefined in environment variables");
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
      await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role: "customer",
      });
      return res.status(201).json({
        message: "Signup successfully",
      });
    } catch (error) {
      console.log(`Error registering user: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);
// Admin Registration
export const RegisterAdmin = catchErrors(
  async (req: express.Request, res: express.Response) => {
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
      const hashedPassword = await bcrypt.hash(password, parseInt(SALT));
      const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the Admin Team! ${firstName} ${lastName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .email-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: #007BFF;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          line-height: 1.6;
        }
        .footer {
          background-color: #f1f1f1;
          padding: 10px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
        .cta-button {
          display: inline-block;
          background-color: #007BFF;
          color: white;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .cta-button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Welcome to the Admin Team at E-COMMERCE APP!</h1>
        </div>
        <div class="content">
          <p>Hi ${firstName} ${lastName},</p>
          <p>Congratulations! You have been granted admin access to E-COMMERCE APP.</p>
          <p>As an admin, you now have the ability to manage users, content, and various settings. Please use your access responsibly.</p>
          <h3>Your Admin Dashboard:</h3>
          <ul>
            <li><a href="[Link to Dashboard]" class="cta-button">Go to Admin Dashboard</a></li>
            <li><a href="[Link to Documentation]" class="cta-button">View Documentation</a></li>
          </ul>
          <p>If you have any questions, feel free to reach out. We're here to support you!</p>
        </div>
        <div class="footer">
          <p>If you did not request admin access or believe this to be an error, please contact us immediately at [Support Email].</p>
        </div>
      </div>
    </body>
    </html>`;
      const info = await transporter.sendMail({
        from: "E-COMMERCE APP Management",
        to: email,
        subject: "Welcome and Thanks for choosing E-COMMERCE APP",
        html: htmlContent,
      });
      console.log(`Message sent: ${info.messageId}`);
      const admin = await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role: "admin",
      });
      return res.status(201).json({
        admin: admin.firstName,
        message: "Admin registered successfully",
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  }
);

// User Login
export const LoginUser = catchErrors(
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({
          message: "User does not exist",
        });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "invalid Credentials" });
      }
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 24 * 60 * 60 * 1000, //24 hours
      });
      return res.status(200).json({
        message: "Login successfully",
        user: {
          name: user.firstName,
          id: user._id,
          token,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.log(`Error logging in user: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// User Logout
export const LogoutUser = catchErrors(
  async (_req: express.Request, res: express.Response) => {
    res.clearCookie("access_token");
    res.status(200).json({
      message: "Logout successfully",
    });
  }
);
