import { install } from 'source-map-support';
install();
import './tracing';
import express from 'express';
import { Sequelize, Dialect, Options, DataTypes } from 'sequelize';
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

const sequelize = new Sequelize(pgConfig.database, pgConfig.user, pgConfig.password, {
    logging: false,
    host: pgConfig.host,
    dialect: 'postgres',
    dialectOptions: {
        application_name: `steroid`,
        idle_in_transaction_session_timeout: 900_000, // 15 min
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

app.get('/typeorm', exampleController);

connectToDb().then(() => app.listen(3077)).then(() => console.log('server started'));
