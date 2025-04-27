import { config } from "dotenv";
config();

const googleConfig = {
  GOOGLE_EMAIL_USER: process.env.GOOGLE_EMAIL_USER,
  GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
  TOTP_SECRET_KEY: process.env.TOTP_SECRET_KEY,
};

export default googleConfig;
