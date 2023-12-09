import { Pool } from "pg";

export const connect = async () => {
  const con = new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: parseInt(process.env.PGSQL_PORT!),
    database: process.env.PGSQL_DATABASE,
  });

  return con;
};

export const disconnect = async (con: Pool) => {
  await con.end();
};
