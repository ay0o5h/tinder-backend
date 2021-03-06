import * as express from "express";
import InterstedController from '../controller/v1/intersted.controller';
import MatchController from "../controller/v1/match.controller";
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

route.get("/passions", InterstedController.getAll)
route.post("/passion/add", InterstedController.add)
route.put("/passion/edit/:id", InterstedController.edit)
route.delete("/passion/delete/:id", InterstedController.deletePassion)

route.get("/music-categories", InterstedController.getAllMusicCat)
route.post("/music-category/add", InterstedController.addMusicCat)
route.put("/music-category/edit/:id", InterstedController.editMusicCat)
route.delete("/music-category/delete/:id", InterstedController.deleteMusicCat)


route.use(auth);

route.get("/profile", UserController.getProfile);
route.put("/update", UserController.update);

// passion of user
route.get("/user-passion", UserController.getPassions)
route.post("/user/addPassion", UserController.addPassion)
route.put("/user/editPassion/:id", UserController.editPassion)
route.delete("/user/deletePassion/:id", UserController.deletePassion)
// music of user
route.get("/music-favourit", UserController.getMusic)
route.post("/music-favourit/add", UserController.addMusic)
route.put("/music-favourit/edit/:id", UserController.editMusic)
route.delete("/music-favourit/delete/:id", UserController.deleteMusic)

// match 
route.get("/suggestions", MatchController.suggestions)
route.post("/request", MatchController.request)
route.post("/response", MatchController.response)
route.get("/match", MatchController.getMatch)



export default route;