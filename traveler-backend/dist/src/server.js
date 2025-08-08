"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const posts_1 = __importDefault(require("./routes/posts"));
const comments_1 = __importDefault(require("./routes/comments"));
const users_1 = __importDefault(require("./routes/users"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const mysql = require("mysql");
const app = (0, express_1.default)();
var db = mysql.createConnection({
    host: process.env.DB_LOCATION,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timezone: "ist"
});
db.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
        return;
    }
    console.log("Connected to database");
    db.query('SHOW TABLES', (err, results) => {
        if (err) {
            console.error('Query error:', err);
        }
        else {
            console.log('Data from your_table:', results);
        }
    });
});
app.use((req, res, next) => {
    req.db = db;
    next();
});
app.use((0, cors_1.default)({
    origin: process.env.DOMAIN_BASE,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
}));
app.use((0, cors_1.default)());
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
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/', express_1.default.static("front"));
app.get('/ui/*', (req, res) => { res.sendFile(path_1.default.join("front", 'index.html')); });
app.use("/posts", posts_1.default);
app.use("/comments", comments_1.default);
app.use("/auth", users_1.default);
const publicDir = path_1.default.resolve(process.cwd(), 'public');
const uploadsDir = path_1.default.resolve(process.cwd(), 'public/uploads');
const profilePicturesDir = path_1.default.resolve(process.cwd(), 'public/profile-pictures');
app.use('/public', express_1.default.static(publicDir));
app.use('/public/uploads', express_1.default.static(uploadsDir));
app.use('/public/profile-pictures', express_1.default.static(profilePicturesDir));
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
app.use(upload.single("image"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Web Dev 2025 - D - REST API",
            version: "1.0.0",
            description: "REST server including authentication using JWT",
        },
        servers: [{ url: "http://localhost:" + process.env.CLIENT_PORT, },],
    },
    apis: ["./src/routes/*.ts"],
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.listen(process.env.CLIENT_PORT, () => {
    console.log(`Server running on port ${process.env.CLIENT_PORT}`);
});
//# sourceMappingURL=server.js.map