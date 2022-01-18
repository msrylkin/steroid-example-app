import { install } from 'source-map-support';
install();
import './tracing';
import express from 'express';
import { Sequelize, Dialect, Options, DataTypes } from 'sequelize';
import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, Db } from "typeorm";
import { TypeormUser } from './example/User';
import { exampleController } from './example/controllers';
import { connectToDb } from './example/db';

const pgConfig = {
    dialect: 'postgres' as Dialect,
    host: 'localhost',
    port: 5432,
    database: 'osome-test',
    user: 'user',
    password: 'password',
    poolSize: 5,
};

const app = express();


// @Entity({ name: 'users' })
// class TypeormUser {

//     @PrimaryGeneratedColumn()
//     id!: number;
// }

const sequelize = new Sequelize(pgConfig.database, pgConfig.user, pgConfig.password, {
    logging: false,
    host: pgConfig.host,
    dialect: 'postgres',
    dialectOptions: {
        application_name: `steroid`,
        idle_in_transaction_session_timeout: 900000, // 15 min
    },
    pool: {
        max: pgConfig.poolSize,
    },
} as Options);

const User = sequelize.define('User', {
    passwordHash: DataTypes.STRING,
}, { tableName: 'users' });

app.get('/hello', async (req, res) => {
    const query = 'SELECT * FROM "users" WHERE "id" = :id';

    await sequelize.query(query, { replacements: {id: 1} });

    await User.findAll({ where: { id: 1 } });

    res.send('finish');
});

let connection: Connection;

// app.get('/typeorm', async (req, res) => {
//     const query = 'SELECT * FROM "users" WHERE "id" = $1';

//     connection = connection || await createConnection({
//         type: 'postgres',
//         host: 'localhost',
//         port: 5432,
//         database: 'osome-test',
//         username: 'user',
//         password: 'password',
//         entities: [ TypeormUser ],
//     });

//     const userRepo = connection.getRepository(TypeormUser);

//     await userRepo.findOne({
//         where: {
//             id: 1,
//         },
//     });

//     await connection.query(query, [1]);
//     await connection.query(`SELECT pg_sleep(2)`);

//     res.json({});
// });

app.get('/typeorm', exampleController);

connectToDb().then(() => app.listen(3077)).then(() => console.log('server started'));
// app.listen(3077, () => console.log('server started'));