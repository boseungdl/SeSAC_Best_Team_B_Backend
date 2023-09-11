import { Request, Response } from "express";
import User from "../models/tables/user"; // User 모델의 경로에 따라 조정
import Room from "../models/tables/room";

export const createRoom = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { name, relationship, genderGroup, slogan, userId } = req.body;

    const newRoom = await Room.create({
      name,
      relationship,
      genderGroup,
      slogan,
      userId: req.user,
    });

    res.status(201).send(newRoom);
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};
