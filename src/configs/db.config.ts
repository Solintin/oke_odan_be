import { config } from "dotenv";
config();

const DB_URI = process.env.MONGO_URI;

export default DB_URI;
