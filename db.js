import { Pool } from "pg";

const config = {
  user: process.env.AIVEN_POSTGRES_USER,
  password: process.env.AIVEN_POSTGRES_PASSWORD,
  host: process.env.AIVEN_POSTGRES_HOST,
  port: process.env.AIVEN_POSTGRES_PORT,
  database: process.env.AIVEN_POSTGRES_DB,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.AIVEN_POSTGRES_CA,
  },
};

let pool;

if (!pool) {
  pool = new Pool(config);
}

export default pool;
