import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, getRepository, getConnection } from "typeorm";
import { findEntity, rawQuery } from "./services";
import { TypeormUser } from "./User";

export async function exampleController(req, res, next) {
    await findEntity();

    
    await rawQuery();

    await composite();

    res.json({});
}

async function composite() {
    await findEntity();
    await rawQuery();
}