"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3({
    region: process.env.AWS_REGION,
    useDualstackEndpoint: true,
});
const uploadMiddleware = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        acl: "public-read",
        key: function (req, file, cb) {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, `uploads/${uniqueName}`);
        },
    }),
    limits: { fileSize: 50 * 1024 * 1024 },
});
exports.default = uploadMiddleware;
//# sourceMappingURL=upload_middleware.js.map