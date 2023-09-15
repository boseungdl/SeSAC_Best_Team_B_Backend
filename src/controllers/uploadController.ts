import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import exifParser from "exif-parser";
import Image from "../models/tables/image";
import Record from "../models/tables/record";
import exifr from "exifr";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import axios from "axios";
import sharp from "sharp";
import heicConvert from 'heic-convert';

// S3 Client initialization


const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY as string,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array("images");



const convertHEICToJPG = async (buffer: Buffer) => {
  try {
    const jpgBuffer = await heicConvert({
      buffer: buffer, // the HEIC file buffer
      format: 'JPEG',   // output format
    });
    return jpgBuffer;
  } catch (error) {
    console.error("Error converting HEIC to JPG:", error);
    throw error;
  }
};



const extractMetadata = async (file: any) => {
  let buffer = file.buffer;
  let fileName = Date.now() + "-" + path.basename(file.originalname);

  let result;
  if (path.extname(file.originalname).toLowerCase() === ".heic") {
    result = await exifr.parse(buffer);
    buffer = await convertHEICToJPG(buffer);
    fileName += ".jpg";
  } else {
    fileName += path.extname(file.originalname);
    const parser = exifParser.create(buffer);
    result = parser.parse();
  }
  console.log(result, buffer, fileName)
  return { result, buffer, fileName };
};


const uploadToS3 = async (fileData: any, file: any) => {
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: fileData.fileName,
    Body: fileData.buffer,
    ACL: 'public-read-write',
    ContentType: file.mimetype,
  });

  await s3.send(putObjectCommand);
  if(!fileData.hasOwnProperty("tags")){
    return {
      fileName: fileData.fileName,
      GPSLongitude: fileData.result?.longitude || null,
      GPSLatitude: fileData.result?.latitude || null,
      CreateDate: fileData.result?.CreateDate 
    };
  }
  return {
    fileName: fileData.fileName,
    GPSLongitude: fileData.result.tags?.GPSLongitude || null,
    GPSLatitude: fileData.result.tags?.GPSLatitude || null,
    CreateDate: fileData.result.tags?.CreateDate ? new Date(fileData.result.tags.CreateDate * 1000) : null,
  };
};

export const uploadImages = async (req: Request, res: Response) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Error uploading images", details: err });
      }

      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ success: false, message: "No files uploaded" });
      }

      if (!req.user) {
        return res.status(400).json({ success: false, message: "User information is missing" });
      }

      try {
      
        
        const metaData = await Promise.all(
          (req.files as Array<any>).map(async (file) => {
            try {
              const fileData = await extractMetadata(file);
              const data = await uploadToS3(fileData, file);
              return data;
            } catch (error) {
              console.error("File processing error:", error);
              throw error;
            }
          })
        );

        const imagesData = metaData.filter(file => file.GPSLongitude !== null || file.GPSLatitude !== null);

        if (imagesData.length === 0) {
          return res.status(400).json({ success: false, message: "No files contain metadata" });
        }
        const record = await Record.create({
          recordValue: req.body.text,
          kakaoId: req.user,
          roomId: req.body.roomId,
        });
        const imagesDataToInsert  = metaData
          .map((file) => ({
            imageName: file.fileName,
            GPSLongitude: file.GPSLongitude,
            GPSLatitude: file.GPSLatitude,
            CreateDate: file.CreateDate,
            recordId: record.recordId,
          }))
          .sort((a, b) => {
            const dateA = new Date(a.CreateDate || 0).getTime();
            const dateB = new Date(b.CreateDate || 0).getTime();
            return dateA - dateB;
          });

        await Image.bulkCreate(imagesDataToInsert );

        res.status(200).json({
          record: record,
          images: imagesDataToInsert ,
        });
      } catch (error: any) {
        console.error("DB insert failed:", error);
        res.status(500).json({
          success: false,
          message: "DB insert failed",
          error: error.message,
        });
      }
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.status(500).json({ error: "Error uploading images", details: error });
  }
};
