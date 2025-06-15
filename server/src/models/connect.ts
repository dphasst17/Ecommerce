import mysql2 from "mysql2";
import type { Database } from "./types";
import { Kysely, MysqlDialect } from "kysely";

let pool = mysql2.createPool({
    connectionLimit: 15,
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.PORT_SQL)
});
const db = new Kysely<Database>({ dialect: new MysqlDialect({ pool }) })
db.selectFrom('products').selectAll().execute()
  .then(() => console.log('✅ Connect successfully'))
  .catch(error => console.error('❌ Connect failed', error))

export { db }
