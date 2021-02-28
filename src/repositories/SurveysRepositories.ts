import { EntityRepository, Repository } from "typeorm";
import { Survey } from "../models/Survey";


@EntityRepository(Survey)
class SurveysRepostory extends Repository<Survey>{}

export { SurveysRepostory }