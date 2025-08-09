import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  useDualstackEndpoint: true,
});

const uploadMiddleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET!,
    acl: "public-read",
    key: function (req, file, cb) {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, `uploads/${uniqueName}`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
});

export default uploadMiddleware;
