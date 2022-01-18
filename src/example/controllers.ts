import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, getRepository, getConnection } from "typeorm";
import { findEntity, rawQuery, sleep } from "./services";
import { TypeormUser } from "./User";

export async function exampleController(req, res, next) {
    await findEntity();
    await rawQuery();
    await sleep(2);

    await composite();

    res.json({});
}

async function composite() {
    await findEntity();
    await rawQuery();
    await sleep(1);
}