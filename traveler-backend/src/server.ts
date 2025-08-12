import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import express from "express";
import postsRoute from "./routes/posts";
import cors from "cors";
import path from "path";
import multer from "multer";
import passport from "passport";
import session from "express-session";
import uploadMiddleware from "./common/upload_middleware";


// Import your Sequelize instance
import sequelize from "./db";  // adjust path to your db.ts

// Import models (to ensure they are registered)
import "./models/posts";

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static("front"));
app.get("/ui/*", (req, res) => {
  res.sendFile(path.join("front", "index.html"));
});

app.use("/api/posts", postsRoute);

app.post("/upload-image", uploadMiddleware.single("image"), (req, res) => {
  res.json({ url: (req.file as any).location });
});

// Start the server AFTER Sequelize connects and syncs
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected to DB");

    await sequelize.sync(); // Or use { force: true } for dev to reset tables

    app.listen(process.env.SERVER_PORT, () => {
      console.log(`Server running on port ${process.env.SERVER_PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to DB:", error);
  }
}

startServer();
