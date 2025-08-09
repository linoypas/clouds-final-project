"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const posts_1 = __importDefault(require("./routes/posts"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const upload_middleware_1 = __importDefault(require("./common/upload_middleware"));
// Import your Sequelize instance
const db_1 = __importDefault(require("./db")); // adjust path to your db.ts
// Import models (to ensure they are registered)
require("./models/posts");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    next();
});
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/", express_1.default.static("front"));
app.get("/ui/*", (req, res) => {
    res.sendFile(path_1.default.join("front", "index.html"));
});
app.use("/posts", posts_1.default);
app.post("/upload-image", upload_middleware_1.default.single("image"), (req, res) => {
    res.json({ url: req.file.location });
});
// Start the server AFTER Sequelize connects and syncs
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.default.authenticate();
            console.log("Sequelize connected to DB");
            yield db_1.default.sync(); // Or use { force: true } for dev to reset tables
            app.listen(process.env.CLIENT_PORT, () => {
                console.log(`Server running on port ${process.env.CLIENT_PORT}`);
            });
        }
        catch (error) {
            console.error("Unable to connect to DB:", error);
        }
    });
}
startServer();
//# sourceMappingURL=server.js.map