import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import express from "express";
import postsRoute from "./routes/posts";
import commentsRoute from "./routes/comments";
import authRoutes from "./routes/users";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import path from "path";
import multer from "multer";
import passport from "passport";
import session from "express-session";

// Import your Sequelize instance
import sequelize from "./db";  // adjust path to your db.ts

// Import models (to ensure they are registered)
import "./models/users";
import "./models/posts";
import "./models/comments";

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

app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);
app.use("/auth", authRoutes);

const publicDir = path.resolve(process.cwd(), "public");
const uploadsDir = path.resolve(process.cwd(), "public/uploads");
const profilePicturesDir = path.resolve(process.cwd(), "public/profile-pictures");

app.use("/public", express.static(publicDir));
app.use("/public/uploads", express.static(uploadsDir));
app.use("/public/profile-pictures", express.static(profilePicturesDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
app.use(upload.single("image"));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 - D - REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:" + process.env.CLIENT_PORT }],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Start the server AFTER Sequelize connects and syncs
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected to DB");

    await sequelize.sync(); // Or use { force: true } for dev to reset tables

    app.listen(process.env.CLIENT_PORT, () => {
      console.log(`Server running on port ${process.env.CLIENT_PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to DB:", error);
  }
}

startServer();
