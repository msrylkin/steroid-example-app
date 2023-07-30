import { createConnection } from "typeorm";
import { TypeormUser } from "./User";

export async function connectToDb() {
    await createConnection({
        type: 'sqlite',
        database: ':memory:',
        entities: [ TypeormUser ],
    });
}