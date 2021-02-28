import {Request,response,Response} from "express"
import { getCustomRepository } from "typeorm";
import { SurveysRepostory } from "../repositories/SurveysRepositories";

class SurveysController{
    async create(req: Request, res: Response){
        const {title, description} = req.body;
        
        const surveysRepostory = getCustomRepository(SurveysRepostory)

        const survey = surveysRepostory.create({
            title,
            description
        });

        await surveysRepostory.save(survey);

        return res.status(201).json(survey);
    }
    async show(req: Request, res: Response){
        const surveysRepostory = getCustomRepository(SurveysRepostory)

        const all = await surveysRepostory.find();

        return res.json(all)
    }
}

export{SurveysController}