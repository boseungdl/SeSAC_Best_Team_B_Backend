import { Request, Response } from "express";
import User from "../models/tables/user"; // User 모델의 경로에 따라 조정
import Room from "../models/tables/room";

export const createRoom = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { name, relationship, genderOrGroup, slogan, userId } = req.body;

    const newRoom = await Room.create({
      name,
      relationship,
      genderOrGroup,
      slogan,
      kakaoId: req.user,
    });
    console.log(newRoom)
    res.status(201).send(newRoom);
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: "Server error" });
  }
};
