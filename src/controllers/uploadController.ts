import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import exifParser from "exif-parser";
import Image from "../models/tables/image";
import Record from "../models/tables/record";
import exifr from 'exifr';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.basename(file.originalname));
  },
});

const upload = multer({ storage: storage }).array("images");

export const uploadImages = async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
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

    try {
      const record = await Record.create({
        recordValue: req.body.text,
        kakaoId: req.user,
      });

      const filepaths = await Promise.all(
        (req.files as Express.Multer.File[]).map(async (file) => {
          try {
            let buffer = await fs.readFile(file.path);
            let outputFilePath = file.path;

            if (path.extname(file.originalname).toLowerCase() === ".heic") {
              let result = await exifr.parse(buffer); // HEIC 파일의 원본 버퍼에 대해 호출
              console.log('Original HEIC Exif Data:', result);
            
              return {
                path: outputFilePath,
                GPSLongitude: result.longitude, 
                GPSLatitude: result.latitude, 
                CreateDate: new Date(result.GPSDateStamp.replace(/:/g, '-')),
              };
            } else {
              const parser = exifParser.create(buffer);
              const result = parser.parse();
              console.log('result',result)
              return {
                path: outputFilePath,
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
      type FileUploadInfo = {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        destination: string;
        filename: string;
        path: string;
        size: number;
      };
      
      type ReqFiles = FileUploadInfo[];
      let img :ReqFiles= req.files
      console.log('req.files', req.files)
      const imagesData = filepaths.map((file, i) => ({
        imageName: img[i].filename,
        GPSLongitude: file.GPSLongitude,
        GPSLatitude: file.GPSLatitude,
        CreateDate: file.CreateDate,
        recordId: record.recordId,
      }));

      await Image.bulkCreate(imagesData);

      res.status(200).json({
        success: true,
        message: "Uploaded and saved successfully",
        filepaths: filepaths,
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
};
