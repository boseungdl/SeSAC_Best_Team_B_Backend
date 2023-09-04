import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import exifParser from "exif-parser";
import Image from "../models/tables/image";  // 모델 import 위치는 실제 경로에 따라 변경되어야 합니다.
import Record from "../models/tables/record";  // 모델 import 위치는 실제 경로에 따라 변경되어야 합니다.

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

    if (!req.files) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const filepaths = (req.files as Express.Multer.File[]).map((file) => {
      const buffer = fs.readFileSync(file.path);
      const parser = exifParser.create(buffer);
      const result = parser.parse();

      // console.log("result", result, "end"); // Exif data
      return file.path;
    })

    try {

      console.log(req.body.text)
      console.log('req.user12121',typeof req.user)
      // 여기서 기록(Record)을 먼저 저장합니다.
      const record = await Record.create({
        recordValue: req.body.text,
        kakaoId: req.user 
      });
      console.log('record', record)
      // 이제 이미지 데이터를 저장합니다.
      for (let file of filepaths) {
        const buffer = fs.readFileSync(file);
        const parser = exifParser.create(buffer);
        const result = parser.parse();
        console.log('result.tags.CreateDate', result.tags.CreateDate)
        await Image.create({
          GPSLongitude: result.tags.GPSLongitude,
          GPSLatitude: result.tags.GPSLatitude,
          CreateDate: new Date(result.tags.CreateDate*1000),
          recordId: record.recordId // 기록의 ID를 FK로 사용합니다.
          
        });
      }
      console.log(1)
      res.status(200).json({
        success: true,
        message: "Uploaded and saved successfully",
        filepaths: filepaths,
      });

    } catch (error : any ) {
      console.log(2)
      res.status(500).json({
        success: false,
        message: "DB insert failed",
        error: error.message,
      });
    }
  });
};
