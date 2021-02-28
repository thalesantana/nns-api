import {Request, Response} from "express"
import { getCustomRepository } from "typeorm";
import { SurveysRepostory } from "../repositories/SurveysRepositories";
import { SurveyUsersRepository   } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";

import {resolve} from 'path'
import SendMailService from "../services/SendMailService";
import { AppError } from "../errors/AppError";

class SendMailController{
    async execute(req: Request, res: Response){
        const { email, survey_id} = req.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepostory = getCustomRepository(SurveysRepostory);
        const surveyUsersRepostitory = getCustomRepository(SurveyUsersRepository);

        const user = await usersRepository.findOne({email});

        if (!user) {
            throw new AppError("User does not exists")
        }
        const survey = await surveysRepostory.findOne({id:survey_id})

        if (!survey) {
            throw new AppError("Survey does not exists")
        };
        

        const npsPath = resolve(__dirname, "../","views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveyUsersRepostitory.findOne({
            where: {user_id: user.id, value:null},
            relations: ["user","survey"],
        });

        const variables = {
            name: user.name,
            title:survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        };
        if(surveyUserAlreadyExists){
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables,npsPath);
            return res.json(surveyUserAlreadyExists)
        }

        //Salvar as informações na tabela surveyUser
        const surveyUser = surveyUsersRepostitory.create({
            user_id: user.id,
            survey_id,
        })
        await surveyUsersRepostitory.save(surveyUser);
        
        //Enviar e-mail para o usuário
        variables.id = surveyUser.id
        await SendMailService.execute(email,survey.title,variables,npsPath,);

        return res.json(surveyUser);
    }
}

export { SendMailController }