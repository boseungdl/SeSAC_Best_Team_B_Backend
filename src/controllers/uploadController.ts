import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import exifParser from "exif-parser";
import Image from "../models/tables/image";
import Record from "../models/tables/record";
import exifr from 'exifr';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3'
import axios from 'axios';

const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY as string
  }
})

const s3_storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET_NAME as string,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    console.log(ext)
    if (!['jpg', 'jpeg', 'heic'].includes(ext)) {
      return cb(new Error('only jpg and heic are allowed'), '');
    }
    cb(null, Date.now() + '-' + path.basename(file.originalname));
  },
  acl: 'public-read-write'
})

const upload = multer({ storage: s3_storage }).array("images");

export const uploadImages = async (req: Request, res: Response) => {
  try {
    upload(req, res, async (err) => {
      // 이미지를 S3에 업로드합니다.
      if (err) {
        console.error("Error uploading images to S3:", err);
        return res.status(500).json({ error: "Error uploading images to S3" });
      }

      // 이미지가 성공적으로 업로드되면 요청에서 파일 정보를 추출할 수 있습니다.
      const uploadedFiles = req.files as Express.MulterS3.File[];

      console.log(req.files)
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Upload failed",
          error: err.message,
        });
      }

      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ success: false, message: "No files uploaded" });
      }

      if (!req.user) {
        return res.status(400).json({ success: false, message: "User information is missing" });
      }

      // 이미지 메타데이터 DB에 업로드합니다.
      try {
        const record = await Record.create({
          recordValue: req.body.text,
          kakaoId: req.user,
        });

        const metaData = await Promise.all(
          (req.files as Express.MulterS3.File[]).map(async (file) => {
            try {
              const getObjectCommand = new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME as string,
                Key: file.key // S3에서 가져올 파일의 키 (경로)
              });

              const getObjectOutput = await s3.send(getObjectCommand);

              if (!getObjectOutput.Body) {
                throw new Error('Failed to fetch S3 object');
              }

              // Construct the URL manually
              const s3ObjectUrl = file.location;

              // Fetch the image using Axios
              const response = await axios.get(s3ObjectUrl, {
                responseType: 'arraybuffer', // Specify binary response type
              });

              if (response.status !== 200) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
              }

              const buffer = Buffer.from(response.data);

              let fileName = file.key;

              if (path.extname(file.originalname).toLowerCase() === ".heic") {
                let result = await exifr.parse(buffer); // HEIC 파일의 원본 버퍼에 대해 호출
                console.log('Original HEIC Exif Data:', result);

                return {
                  fileName: fileName,
                  GPSLongitude: result.longitude,
                  GPSLatitude: result.latitude,
                  CreateDate: new Date(result.GPSDateStamp.replace(/:/g, '-')),
                };
              } else {
                const parser = exifParser.create(buffer);
                const result = parser.parse();
                console.log('result', result)
                return {
                  fileName: fileName,
                  GPSLongitude: result.tags.GPSLongitude || null,
                  GPSLatitude: result.tags.GPSLatitude || null,
                  CreateDate: result.tags.CreateDate ? new Date(result.tags.CreateDate * 1000) : null,
                };
              }

            } catch (error) {
              console.error("File processing error:", error);
              throw error;
            }
          })
        );

        console.log('req.files', req.files)
        const imagesData = metaData.map((file, i) => ({
          imageName: file.fileName,
          GPSLongitude: file.GPSLongitude,
          GPSLatitude: file.GPSLatitude,
          CreateDate: file.CreateDate,
          recordId: record.recordId,
        }));

        await Image.bulkCreate(imagesData);

        res.status(200).json({
          success: true,
          message: "Uploaded and saved successfully",
          filepaths: metaData,
          files: uploadedFiles
        });
      } catch (error: any) {
        console.error("DB insert failed:", error);
        res.status(500).json({
          success: false,
          message: "DB insert failed",
          error: error.message,
        });
      }
    })
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.status(500).json({ error: "Error uploading images" });
  }
};