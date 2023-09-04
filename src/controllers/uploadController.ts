import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import exifParser from "exif-parser";
import Image from "../models/tables/image";
import Record from "../models/tables/record";
import heicConvert from "heic-convert";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
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
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    if (!req.user) {
      return res
        .status(400)
        .json({ success: false, message: "User information is missing" });
    }
    console.log(req.user);
    console.log(req.body.text);
    console.log(req.files);
    try {
      const record = await Record.create({
        recordValue: req.body.text,
        kakaoId: req.user,
      });

      const filepaths = await Promise.all(
        (req.files as Express.Multer.File[]).map(async (file) => {
          try {
            const buffer = fs.readFileSync(file.path);
            const uint8Array = new Uint8Array(buffer);

            let outputFilePath = file.path;

            if (path.extname(file.originalname).toLowerCase() === ".heic") {
              const outputBuffer = await heicConvert({
                buffer: buffer,
                format: "JPEG",
              });
              outputFilePath = file.path.replace(".heic", ".jpg");
              fs.writeFileSync(outputFilePath, outputBuffer as any);
            }

            // EXIF 데이터 파싱을 HEIC 변환 후에 수행
            const newBuffer = fs.readFileSync(outputFilePath);
            const parser = exifParser.create(newBuffer);
            const result = parser.parse();
            console.log(result);
            return {
              path: outputFilePath,
              GPSLongitude: result.tags.GPSLongitude,
              GPSLatitude: result.tags.GPSLatitude,
              CreateDate: new Date(result.tags.CreateDate * 1000),
            };
          } catch (error) {
            console.error("File processing error:", error);
            return null;
          }
        })
      );

      const imagesData = filepaths
        .filter((file) => file !== null)
        .map((file: any) => ({
          GPSLongitude: file.GPSLongitude,
          GPSLatitude: file.GPSLatitude,
          CreateDate: file.CreateDate,
          recordId: record.recordId,
        }));
      console.log("imagesData", imagesData);
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
