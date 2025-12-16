import express from "express";
import RegisterController from "../controllers/users/RegisterController";
import loginController from "../controllers/users/loginController";

const v4usersRoutes = express.Router();

v4usersRoutes.post("/register", RegisterController);
v4usersRoutes.post("/login", loginController);

export default v4usersRoutes;
