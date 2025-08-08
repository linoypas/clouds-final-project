"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.resolve(__dirname, "/public/uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const uploadMiddleware = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
});
exports.default = uploadMiddleware;
//# sourceMappingURL=upload_middleware.js.map