import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { readFileSync, writeFileSync } from "fs";
import { IUser } from "../../../type/types";
import generateToken from "../../../utils/generateToken";
import logger from "../../../utils/logger/logger";
const RegisterController = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user: IUser = req.body;
    const allUsers = JSON.parse(readFileSync("./allUsers.json", "utf8"));
    const isExists = allUsers.find(
      (u: IUser) => u.email.toLowerCase() === user.email.toLowerCase()
    );
    if (isExists) {
      res.status(401).json({ error: "User already Exists" });
      return;
    }
    if (user.fullname && user.email && user.password) {
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(user.password, salt);
      const userTocreate = {
        ...user,
        password: newPassword,
        id: new Date().getTime().toString(),
        avatar: "https://i.pravatar.cc/300",
      };
      const newUsers = [...allUsers, userTocreate];
      writeFileSync("./allUsers.json", JSON.stringify(newUsers));
      // @ts-ignore
      delete userTocreate.password;
      res.json({ ...userTocreate, token: generateToken(userTocreate.id) });
    } else {
      res.status(401).json({ error: "Please add all details" });
    }
  } catch (error) {
    res.status(500).json(error);
    logger.logError("Add employee", error);
  }
});

export default RegisterController;
