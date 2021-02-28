import {Request, Response } from 'express'
import { getCustomRepository , Not, IsNull} from 'typeorm'
import { SurveyUsersRepository } from '../repositories/SurveysUsersRepository'

class NpsController {
    /** 0- 10
     * Detratores => 0 - 6
     * Passivos = > 7 - 8
     * Promotores => 9 - 10
     * (Promotores - detratores) / (respondentes) x 100
     */
    async execute(req:Request, res: Response){
        const {survey_id} = req.params;
        const surveyUsersRepostitory = getCustomRepository(SurveyUsersRepository);

        const surveyUsers = await surveyUsersRepostitory.find({
            survey_id,
            value: Not(IsNull())
        })

        const detractor = surveyUsers.filter(
             (survey)=> survey.value >= 0 && survey.value <= 6
            ).length
        const promoters = surveyUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length
        const passive = surveyUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length
        const totalAwnsers = surveyUsers.length;

        const calculate = Number(((promoters - detractor) / totalAwnsers) * 100).toFixed(2);

        return res.json({
            detractor,
            promoters,
            passive,
            totalAwnsers,
            nps: calculate
        })
    }
}

export {NpsController}