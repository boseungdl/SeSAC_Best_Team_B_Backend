import { Request, Response } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 'uploads/' 폴더에 이미지를 저장합니다.
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름을 현재 시간 + 원래 확장자로 설정합니다.
  },
});

const upload = multer({ storage: storage }).array("images", 12); // 최대 12개의 이미지를 'images' 필드로 받습니다.

export const uploadImages = (req: Request, res: Response) => {
  upload(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Upload failed", error: err.message });
    }

    // req.files가 정의되었는지 확인
    if (!req.files) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const filepaths = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Uploaded successfully",
        filepaths: filepaths,
      });
  });
};
