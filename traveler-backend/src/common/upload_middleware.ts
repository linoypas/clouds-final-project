import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });



const uploadMiddleware = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE, // <-- This automatically sets Content-Type based on file mimetype
    key: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, `uploads/${uniqueName}`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
});



export default uploadMiddleware;
