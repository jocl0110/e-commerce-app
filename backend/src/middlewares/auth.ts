import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../constants/env";
import User, { IUser } from "../models/User";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends express.Request {
  user?: IUser | null;
}

async function ProtectedRoute(
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "No token, authorization denied" });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

      if (!decoded.userId) {
        return res.status(401).json({ message: "Invalid token format" });
      }

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      return next();
    }
    return res.status(401).json({ message: "No authorization header" });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid token signature" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ message: "Token has expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
}
async function isAdmin(
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    } else {
      return res.status(403).json({ message: "You are not an admin" });
    }
  } catch (error) {
    return res.status(403).json({ message: error });
  }
}
module.exports = { isAdmin, ProtectedRoute };
