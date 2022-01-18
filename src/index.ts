import './tracing';
import { Sequelize, Dialect, Options, DataTypes } from 'sequelize';
import * as stackTrace from 'stack-trace';


const pgConfig = {
    dialect: 'postgres' as Dialect,
    host: 'localhost',
    port: 5432,
    database: 'osome-test',
    user: 'user',
    password: 'password',
    poolSize: 5,
};

const methodNames = ['findAll', 'query', 'count'];

async function run() {
    const query = 'SELECT * FROM "users" WHERE "id" = :id';
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
    // await patch(sequelize);
    const res = await sequelize.query(query, { replacements: {id: 1} });

    const User = sequelize.define('User', {
        passwordHash: DataTypes.STRING,
    }, { tableName: 'users' });

    while (true) {
        await sleep(10000); 
        const users = await User.findAll({ where: { id: 1 } });
        console.log('=========')
    }
}

async function patch(sequlize: Sequelize) {
    // console.log(sequlize)
    sequlize.addHook('beforeQuery' as any, function (options, queryObj) {
        queryObj.__steroid__ = {
            startTime: new Date(),
        };
        // const errTrace = new Error();
        // console.log(stackTrace.parse(errTrace));
        // console.log(arguments);
        // const traces = get();
        // for (const trace of traces) {
        //     console.log(trace.getFileName(), trace.getLineNumber(), trace.getColumnNumber(), trace.getFunctionName(), trace.getMethodName(), trace.getTypeName())
        // }
        // console.log(traces[0].getFileName(), traces[0].getFunctionName(), traces[0].getMethodName(), traces[0].getLineNumber());
        // console.log(traces[traces.length - 1].getFileName(), traces[traces.length - 1].getFunctionName(), traces[traces.length - 1].getMethodName());
        // const err = new Error();
        // console.log(new Error().stack);
        // console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    });
    sequlize.addHook('afterQuery' as any, function (options, queryObj) {
        const startTime = queryObj.__steroid__.startTime;

        if (!startTime) {
            console.log('no start time');
            return;
        }

        let res = 1 == 1;
        for (let i = 0; i < 100; i++) res = !res;

        const timeSpent = new Date().getTime() - startTime.getTime();

        var oldLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = Infinity;

        const errTrace = new Error();

        Error.stackTraceLimit = oldLimit;

        const traces = stackTrace.parse(errTrace);
        let calledPoint;

        for (let i = 0; i < traces.length; i++) {
            if (methodNames.includes(traces[i].getMethodName())) {
                calledPoint = traces[i + 1];
                break;
            }
        }

        console.log(calledPoint);
    });
}

function collectMesaurments() {}

async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

void run();