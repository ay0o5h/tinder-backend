import * as validate from "validate.js";
import { User } from "../../src/entity/User";
import { UserMatch } from "../../src/entity/UserMatch";
import { errRes, okRes } from "../../utility/util.service";
import Validator from '../../utility/validation';
export default class MatchController {

    static async suggestions(req, res): Promise<object> {
        let userPassionArr = [];
        let idGenderMatch = [];
        let idMatchPassion = [];
        let idMatchMusic = [];
        let passionResults = [];
        let userMusicArr = [];
        let userMatchArr = [];
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
                    userMatch: "user.userMatch"

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
                    userMatch: "user.userMatch"

                },
            },
        })
        user.userPassion.map((u) => userPassionArr.push(u.passion.title));
        user.musicFav.map((u) => userMusicArr.push(u.musicCat.type));
        user.userMatch.map((u) => userMatchArr.push(u.matchId))

        for (let i = 0; i < users.length; i++) {

            if (users[i].id !== req.user.id && !userMatchArr.includes(users[i].id)) {
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
    static async request(req, res): Promise<object> {
        let body = req.body

        let notValid = validate(body, Validator.request);
        if (notValid) return errRes(res, { notValid })
        let send = await UserMatch.create({
            user: req.user.id,
            matchId: body.matchId,
            user_send: body.user_send,
            user_receive: body.user_receive,
            status: body.status

        })
        await send.save()
        return okRes(res, { send });
    }
    static async response(req, res): Promise<object> {
        let body = req.body

        let notValid = validate(body, Validator.response);
        if (notValid) return errRes(res, { notValid })
        let reply = await UserMatch.findOne({
            where: { user_send: body.user_send, user_receive: body.user_receive, }
        })
        if (!reply) return errRes(res, { msg: "something is wrong" })
        reply.status = body.status

        await reply.save()
        return okRes(res, { reply });
    }
    static async getMatch(req, res): Promise<object> {
        let user = await User.findOne({
            where: { id: req.user.id },
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    userMatch: "user.userMatch",


                },
            },
        })
        return okRes(res, { user });
    }

}
