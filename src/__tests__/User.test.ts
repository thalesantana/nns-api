import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database'

describe("Users",() =>{
    beforeAll( async() =>{
        const connetion = await createConnection();
        await connetion.runMigrations();
    });

    afterAll( async () => {
        const connetion = getConnection();
        await connetion.dropDatabase();
        await connetion.close();
    })

    it("Should be able to create a new user", async () =>{
    const response = await request(app).post("/users")
    .send({
        email:"User@exemple.com",
        name:"User Exemple"
    });
    expect(response.status).toBe(201);
    })
    it("Should be able to create a new user", async () =>{
        const response = await request(app).post("/users")
        .send({
            email:"User@exemple.com",
            name:"User Exemple"
        });
        expect(response.status).toBe(400);
        })
});