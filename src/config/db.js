import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const query = (text, params) => pool.query(text, params);
export default query;