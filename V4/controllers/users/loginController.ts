import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { readFileSync } from "fs";
import { IUser } from "../../../type/types";
import generateToken from "../../../utils/generateToken";
import logger from "../../../utils/logger/logger";
const loginController = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password }: IUser = req.body;
    const allUsers = JSON.parse(readFileSync("./allUsers.json", "utf8"));
    const isExists = allUsers.find(
      (u: IUser) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!isExists) {
      res.status(401).json({ error: "Invalid Email" });
      return;
    }
    const isPasswordCorrect =
      password && (await bcrypt.compare(password, isExists.password));
    if (!isPasswordCorrect) {
      res.status(401).json({ error: "Invalid Passowrd" });
      return;
    }
    if (email && password) {
      // @ts-ignore
      delete isExists.password;
      res.json({ ...isExists, token: generateToken(isExists.id) });
    } else {
      res.status(401).json({ error: "Please add all details" });
    }
  } catch (error) {
    res.status(500).json(error);
    logger.logError("Add employee", error);
  }
});

export default loginController;
