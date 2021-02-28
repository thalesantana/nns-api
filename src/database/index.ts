import {Connection, createConnection, getConnectionOptions} from "typeorm";

export default async (): Promise<Connection> =>{
    const defaltOptions = await getConnectionOptions();

    return createConnection(
        Object.assign(defaltOptions, {
            database: 
            process.env.NODE_ENV === "test"
            ? "./src/database/database.test.sqlite" 
            : defaltOptions.database
        })
    )
}