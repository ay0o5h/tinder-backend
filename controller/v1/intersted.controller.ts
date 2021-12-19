import { Request, Response } from "express";
import * as validate from "validate.js";
import { MusicCategory } from "../../src/entity/MusicCategory";
import { Passion } from "../../src/entity/Passion";
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
}