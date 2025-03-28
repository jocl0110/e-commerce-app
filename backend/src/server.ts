import "dotenv/config";
import express from "express";
import userRouter from "./routes/userRoutes";
import connectDB from "./config/db";
import CookieParser from "cookie-parser";
import cors from "cors";
import { APP_ORIGIN, PORT } from "./constants/env";
import errorHandler from "./middlewares/errorHandler";
import productRouter from "./routes/productRoutes";

const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(CookieParser());

// Routes

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running in http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Connection to DB failed ${error}`);
    process.exit(1);
  });
