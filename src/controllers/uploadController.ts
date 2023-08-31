import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import exifParser from "exif-parser";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).array("images");

export const uploadImages = (req: Request, res: Response) => {
  upload(req, res, (err) => {
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

      console.log("result", result, "end"); // Exif data
      return file.path;
    });

    res.status(200).json({
      success: true,
      message: "Uploaded successfully",
      filepaths: filepaths,
    });
  });
};
