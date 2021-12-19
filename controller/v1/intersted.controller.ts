import { Request, Response } from "express";
import * as validate from "validate.js";
import { MusicCategory } from "../../src/entity/MusicCategory";
import { Passion } from "../../src/entity/Passion";
import { User } from "../../src/entity/User";
import { errRes, okRes } from "../../utility/util.service";
import Validator from '../../utility/validation';
export default class InterstedController {
    /**
     *
     * @param req
     * @param res
     * @returns
     */
    static async getAll(req: Request, res: Response): Promise<object> {
        const passions = await Passion.find();

        return okRes(res, { passions });
    }
    static async add(req: Request, res: Response): Promise<object> {

        const body = req.body;
        let notValid = validate(body, Validator.passion());
        if (notValid) return errRes(res, notValid);

        let title = body.title;
        let passion;
        passion = await Passion.findOne({ where: { title } });
        if (passion) {
            return errRes(res, ` ${title} is already exist`);
        } else {
            passion = await Passion.create({
                title: body.title
            });
        }

        await passion.save();
        return okRes(res, { passion });
    }
    static async edit(req: Request, res: Response): Promise<object> {

        const body = req.body;
        const id = req.params.id
        let notValid = validate(body, Validator.passion(false));
        if (notValid) return errRes(res, notValid);
        let passion;
        passion = await Passion.findOne({ where: { id } });
        if (!passion) return errRes(res, ` not found this passion`);
        passion.title = body.title
        await passion.save();
        return okRes(res, { passion });
    }

    static async deletePassion(req: Request, res: Response): Promise<object> {

        const id = req.params.id
        await Passion.delete(id);
        return okRes(res, { msg: ' deleted succssfully' });
    }
    static async getAllMusicCat(req: Request, res: Response): Promise<object> {
        const musicCat = await MusicCategory.find();

        return okRes(res, { musicCat });
    }
    static async addMusicCat(req: Request, res: Response): Promise<object> {

        const body = req.body;
        let notValid = validate(body, Validator.music());
        if (notValid) return errRes(res, notValid);

        let type = body.type;
        let musicCat;
        musicCat = await MusicCategory.findOne({ where: { type } });
        if (musicCat) {
            return errRes(res, ` ${type} is already exist`);
        } else {
            musicCat = await MusicCategory.create({
                type: body.type
            });
        }

        await musicCat.save();
        return okRes(res, { musicCat });
    }
    static async editMusicCat(req: Request, res: Response): Promise<object> {

        const body = req.body;
        const id = req.params.id
        let notValid = validate(body, Validator.music(false));
        if (notValid) return errRes(res, notValid);
        let musicCat;
        musicCat = await MusicCategory.findOne({ where: { id } });
        if (!musicCat) return errRes(res, ` not found this passion`);
        musicCat.type = body.type
        await musicCat.save();
        return okRes(res, { musicCat });
    }

    static async deleteMusicCat(req: Request, res: Response): Promise<object> {

        const id = req.params.id
        await MusicCategory.delete(id);
        return okRes(res, { msg: ' deleted succssfully' });
    }
    static async suggestions(req, res): Promise<object> {
        let userPassionArr = [];
        let idGenderMatch = [];
        let idMatchPassion = [];
        let idMatchMusic = [];
        let passionResults = [];
        let userMusicArr = [];
        let result;
        let keys, values, uniqueArray;
        let finalMatchUserArr = [];
        let suggestUser = [];


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
        })
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
        })
        user.userPassion.map((u) => userPassionArr.push(u.passion.title));
        user.musicFav.map((u) => userMusicArr.push(u.musicCat.type));

        for (let i = 0; i < users.length; i++) {
            if (users[i].id !== req.user.id) {
                // check match gender
                if (users[i].gender === user.gender_Love && users[i].gender_Love === user.gender) idGenderMatch.push(users[i].id);
                // check match passion
                users[i].userPassion.map((c) => {
                    if (userPassionArr.includes(c.passion.title)) {
                        idMatchPassion.push(users[i].id)
                        result = idMatchPassion.reduce((acc, curr) => (acc[curr] = (acc[curr] || 0) + 1, acc), {});
                        values = Object.keys(result).map(key => result[key]);
                        keys = Object.keys(result).map(key => +key);
                        for (var j = 0; j < keys.length; j++) {
                            if (values[j] > 2) {
                                passionResults.push(keys[j])
                            }
                        }
                        uniqueArray = passionResults.filter(function (item, pos) {
                            return passionResults.indexOf(item) == pos;
                        })
                    }
                })
                // check match music
                users[i].musicFav.map((c) => {
                    if (userMusicArr.includes(c.musicCat.type)) {
                        idMatchMusic.push(users[i].id)
                    }
                })
                if (idGenderMatch.includes(users[i].id) && uniqueArray.includes(users[i].id)
                    && idMatchMusic.includes(users[i].id)) {
                    finalMatchUserArr.push(users[i].id)
                }
            }
        }
        for (let x of finalMatchUserArr) {
            let userfinal = await User.findOne({
                where: { id: x }
            })
            suggestUser.push(userfinal)
        }

        return okRes(res, { suggestUser });
    }

}