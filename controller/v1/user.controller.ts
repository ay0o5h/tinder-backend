import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Twilio } from "twilio";
import * as validate from "validate.js";
import CONFIG from "../../config";
import { MusicCategory } from "../../src/entity/MusicCategory";
import { MusicFavourit } from "../../src/entity/MusicFavourit";
import { User } from "../../src/entity/User";
import { UserPassion } from "../../src/entity/UserPassion";
import PhoneFormat from "../../utility/phoneFormat.service";
import { errRes, getOtp, okRes } from "../../utility/util.service";
import Validator from '../../utility/validation';
export default class UserController {
    /**
     *
     * @param req
     * @param res
     * @returns
     */
    static async register(req: Request, res: Response): Promise<object> {

        const body = req.body;

        let notValid = validate(body, Validator.register());
        if (notValid) return errRes(res, notValid);
        let email = body.email;


        // hash the password
        let salt = await bcrypt.genSalt(12);
        let password = await bcrypt.hash(body.password, salt);
        // create otp
        let otp = getOtp();
        body.password = password;
        body.otp = otp;

        // check if the user already exists
        let user;
        user = await User.findOne({ where: { email } });
        // if exists but not verified
        if (user) {
            if (!user.isVerified) {
                Object.keys(body).forEach((key) => {
                    user[key] = body[key];
                });
            } else return errRes(res, `User ${email} is already exist`);
        } else {
            user = await User.create({
                firstName: body.firstName,
                lastName: body.lastName,
                username: body.username,
                age: body.age,
                email: body.email,
                password: body.password,
                gender: body.gender,
                otp: body.otp,
                gender_Love: body.gender_Love
            });
        }


        await user.save();

        // send otp email TODO:
        const accountSid = "AC1ec944609532d00468cecce1145b5575";
        const authToken = "cb6f14425becfcea726e09609b765829";
        const client = new Twilio(accountSid, authToken);
        client.messages
            .create({
                body: `your vervication code is ${otp}`,
                to: 'aayosh553@gmail.com',
                from: "+18066066506"
            })
            .then(message => console.log(message.sid))


        let token = jwt.sign({ id: user.id }, CONFIG.jwtUserSecret);


        return okRes(res, { token, user });
    }

    /**
     *
     * @param req
     * @param res
     * @returns
     */
    static async checkOtp(req, res): Promise<object> {

        let body = req.body;
        let otp = body.otp;
        if (!otp) return errRes(res, `Otp is required`);

        let user = req.user;


        if (user.otp != otp) {
            user.otp = null;
            await user.save();
            return errRes(res, "otp is incorrect");
        }

        user.isVerified = true;
        await user.save();

        return okRes(res, { user });
    }

    /**
     *
     * @param req
     * @param res
     * @returns
     */
    static async login(req, res): Promise<object> {

        let body = req.body;

        let notValid = validate(body, Validator.login());
        if (notValid) return errRes(res, notValid);
        let email = body.email;

        let password = body.password;
        // get user from db by phone + isVerified
        let user = await User.findOne({ where: { email, isVerified: true } });
        if (!user) return errRes(res, `Please complete the registration process`);


        let check = await bcrypt.compare(password, user.password);
        if (!check) return errRes(res, "Incorrect credentials");

        let token = jwt.sign({ id: user.id }, CONFIG.jwtUserSecret);

        return okRes(res, { token, user });
    }

    /**
     *
     * @param req
     * @param res
     * @returns
     */
    static async check(req, res) {
        return okRes(res, { msg: "you are logged in" });
    }

    /**
     *
     * @param req
     * @param res
     * @returns
     */
    static async forget(req, res) {

        let body = req.body;

        let notValid = validate(body, Validator.forget());
        if (notValid) return errRes(res, notValid);

        let email = body.email;


        let user = await User.findOne({
            where: { email, isVerified: true, active: true },
        });
        if (!user) return errRes(res, `Please complete the registration process`);

        // create passwordOtp & save
        let passwordOtp = getOtp();

        user.passwordOtp = passwordOtp;
        await user.save();

        // send sms

        // create token
        let token = jwt.sign({ email: user.email }, CONFIG.jwtPasswordSecret);

        return okRes(res, { token });
    }

    /**
     *
     * @param req
     * @param res
     * @returns
     */
    static async verifyPassword(req, res) {
        let body = req.body;

        let notValid = validate(body, Validator.verifyPassword());
        if (notValid) return errRes(res, notValid);


        let token = req.headers.token;
        let email;

        try {
            let payload;
            payload = jwt.verify(token, CONFIG.jwtPasswordSecret);
            email = payload.email;
        } catch (error) {
            return errRes(res, "Invalid token");
        }

        let user = await User.findOne({ where: { email } });
        if (!user) return errRes(res, "User not found");


        // compaire the passwordOtp from db & body
        if (body.passwordOtp != user.passwordOtp)
            return errRes(res, "invalid one time password");

        // hash new password
        let salt = await bcrypt.genSalt(12);
        let password = await bcrypt.hash(body.newPassword, salt);

        // save new password
        user.password = password;
        await user.save();



        return okRes(res, { msg: "All good" });
    }
    static async getProfile(req, res): Promise<object> {
        let isSameGender = 0;
        let isSamePassion = 0;
        let isSameMusic = 0;
        let users = await User.find({
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    musicFav: "user.musicFav",
                    musicCat: "musicFav.musicCat",
                    userPassion: "user.userPassion",
                    passion: "userPassion.passion",

                },
            },
        });
        if (!users) return errRes(res, `there is no user`);
        let user = await User.findOne({
            where: { id: req.user.id },
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    musicFav: "user.musicFav",
                    musicCat: "musicFav.musicCat",
                    userPassion: "user.userPassion",
                    passion: "userPassion.passion",

                },
            },
        });
        if (!user) return errRes(res, `there is no user`);

        return okRes(res, { otherUsers: users, userData: user });
    }

    static async update(req, res): Promise<object> {

        const body = req.body;

        let notValid = validate(body, Validator.register(false));
        if (notValid) return errRes(res, notValid);


        // format to the number
        if (body.phone) {
            let phoneObj = PhoneFormat.getAllFormats(body.phone);
            if (!phoneObj.isNumber)
                return errRes(res, `Phone ${body.phone} is not valid`);

            body.phone = phoneObj.globalP;
            let phone = phoneObj.globalP;
        }
        if (body.password) {
            // hash the password
            let salt = await bcrypt.genSalt(12);
            let password = await bcrypt.hash(body.password, salt);
            // create otp
            body.password = password;
        }
        let data;

        try {
            data = await User.findOne({ where: { id: req.user.id, isVerified: true } });
            if (!data) return errRes(res, { msg: "not found" });
            Object.keys(data).forEach((key) => {
                if (body[key]) data[key] = body[key];
            });

            await data.save();
            return okRes(res, { data });
        } catch (error) {
            return errRes(res, { error });
        }
    }
    static async getPassions(req, res): Promise<object> {
        const user = await UserPassion.find({
            where: { user: req.user.id },
            join: {
                alias: "userPassion",
                leftJoinAndSelect: {
                    passion: "userPassion.passion",
                },
            },
        });

        return okRes(res, { user });

    }
    static async addPassion(req, res): Promise<object> {
        const body = req.body;

        if (!Array.isArray(body.passions) || body.passions.length < 1)
            return errRes(res, "passions must by array");
        let user
        for (const passion of body.passions) {
            user = await UserPassion.create({
                user: req.user.id,
                passion: passion
            });
            await user.save();
        }
        return okRes(res, { user });
    }
    static async editPassion(req, res): Promise<object> {
        const body = req.body;
        let id = req.params.id;
        let user = await UserPassion.findOne({ id, user: req.user.id })


        user.passion = body.passion
        await user.save();

        return okRes(res, { user });
    }
    static async deletePassion(req, res): Promise<object> {
        const body = req.body;
        let id = req.params.id;
        await UserPassion.delete({ id, user: req.user.id })




        return okRes(res, { msg: 'User deleted successfully' });
    }
    static async getMusic(req, res): Promise<object> {
        const musicCat = await MusicFavourit.find({ where: { user: req.user.id } });

        return okRes(res, { musicCat });
    }
    static async addMusic(req, res): Promise<object> {

        let body = req.body;
        let notValid = validate(body, Validator.musicFav());
        if (notValid) return errRes(res, notValid);

        let musicCat = body.musicCat;
        let musicFav = await MusicCategory.findOne({ where: { id: musicCat } });
        if (!musicFav) return errRes(res, `${musicCat} is not exist`);

        let data = await MusicFavourit.create({
            link: body.link,
            user: req.user.id,
            musicCat: body.musicCat
        })
        await data.save();
        return okRes(res, { data })
    }
    static async editMusic(req, res): Promise<object> {

        let body = req.body;
        let id = req.params.id;
        let notValid = validate(body, Validator.musicFav(false));
        if (notValid) return errRes(res, notValid);

        let data;

        try {
            data = await await MusicFavourit.findOne({ where: { id, user: req.user.id } });
            if (!data) return errRes(res, { msg: "not found" });
            data.musicCat = body.musicCat;
            data.link = body.link

            await data.save();
            return okRes(res, { data });
        } catch (error) {
            return errRes(res, { error });
        }
    }
    static async deleteMusic(req, res): Promise<object> {
        let id = req.params.id;
        await MusicFavourit.delete(id);
        return okRes(res, { msg: "deleted successfully" });
    }
}