import request from 'supertest';
import { app } from '../app';

import createConnection from '../database'

describe("Surveys",() =>{
    beforeAll( async() =>{
        const connetion = await createConnection();
        await connetion.runMigrations();
    });

    it("Should be able to create a new survey", async () =>{
    const response = await request(app).post("/surveys")
    .send({
        title:"Title Exemple",
        description:"Desciption Exemple",
    });
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id");
    });
    it("Should be able to create a all surveys", async () =>{
       await request(app).post("/surveys")
        .send({
            title:"Title Exemple2",
            description:"Desciption Exemple2",
        });
        const response = await request(app).get("/surveys");

        expect(response.body.length).toBe(2)
    });
});