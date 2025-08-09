"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const s3 = new client_s3_1.S3Client({ region: process.env.AWS_REGION });
const uploadMiddleware = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3,
        bucket: process.env.S3_BUCKET,
        acl: "public-read",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE, // <-- This automatically sets Content-Type based on file mimetype
        key: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, `uploads/${uniqueName}`);
        },
    }),
    limits: { fileSize: 50 * 1024 * 1024 },
});
exports.default = uploadMiddleware;
//# sourceMappingURL=upload_middleware.js.map