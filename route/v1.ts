import * as express from "express";
import UserController from '../controller/v1/user.controller';
import auth from '../middleware/auth';
import otp from "../middleware/otp";
const multer = require('multer');


const route = express.Router();



route.post("/register", UserController.register);
route.post("/otp", otp, UserController.checkOtp);
route.post("/login", UserController.login);

route.post("/forget/password", UserController.forget);
route.post("/verify/password", UserController.verifyPassword);
route.use(auth);

route.get("/profile", UserController.getProfile);
route.put("/update", UserController.update);


export default route;