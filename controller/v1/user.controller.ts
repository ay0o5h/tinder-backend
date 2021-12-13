import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as validate from "validate.js";
import CONFIG from "../../config";
import { User } from "../../src/entity/User";
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

        // send sms TODO:


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
        let username = body.username;

        let password = body.password;
        // get user from db by phone + isVerified
        let user = await User.findOne({ where: { email, isVerified: true } });
        if (!user) return errRes(res, `Please complete the registration process`);
        let user1 = await User.findOne({ where: { username, isVerified: true } });
        if (!user1) return errRes(res, `Please complete the registration process`);

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
}