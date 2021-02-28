import {Request,Response} from 'express'
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveyUsersRepository } from '../repositories/SurveysUsersRepository';

class AnswerController{
    async execute(req: Request, res: Response){
        const {value} = req.params;
        const {u} = req.query;

        const surveyUsersRepostitory = getCustomRepository(SurveyUsersRepository);

        const surveyUser = await surveyUsersRepostitory.findOne({
            id: String(u)
        })
        if(!surveyUser){
            throw new AppError("Survey User Does not exists!")

        }
        surveyUser.value = Number(value);

        await surveyUsersRepostitory.save(surveyUser);

        return res.json(surveyUser)
    }
}

export {AnswerController}