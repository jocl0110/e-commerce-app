import express from "express";
import {
  LoginUser,
  LogoutUser,
  RegisterAdmin,
  RegisterUser,
} from "../controllers/userControllers";
const { isAdmin, ProtectedRoute } = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.post("/register", RegisterUser);
userRouter.post("/register-admin", ProtectedRoute, isAdmin, RegisterAdmin);
userRouter.post("/login", LoginUser);
userRouter.post("/logout", LogoutUser);

export default userRouter;
