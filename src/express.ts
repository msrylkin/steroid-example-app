import { install } from 'source-map-support';
install();
import './tracing';
import express from 'express';
import { Sequelize, Dialect, Options, DataTypes } from 'sequelize';
import { exampleController } from './example/controllers';
import { connectToDb } from './example/db';
import { getConnection } from "typeorm";

const app = express();

// const sequelize = new Sequelize('sqlite::memory:', {
//     logging: false,
// } as Options);

// const User = sequelize.define('User', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
// }, { tableName: 'users', timestamps: false });

app.get('/hello', async (req, res) => {
    const query = 'SELECT * FROM "users" WHERE "id" = :id';

    // await sequelize.query(query, { replacements: {id: 1} });

    // await User.findAll({ where: { id: 1 } });

    res.send('finish');
});

app.get('/typeorm', exampleController);

connectToDb()
    .then(() => Promise.all([
        // sequelize.query('CREATE TABLE "users" ("id" SERIAL PRIMARY KEY);'),
        getConnection().query('CREATE TABLE "users" ("id" SERIAL PRIMARY KEY);'),
    ]))
    .then(() => app.listen(Number(process.env.PORT) || 3077))
    .then(() => console.log('server started'));
