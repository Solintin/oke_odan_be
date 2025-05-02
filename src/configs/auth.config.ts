import { config } from "dotenv";
config();

const AuthConfig = {
  AUTH_SECRET: process.env.AUTH_SECRET,

  PRIVATE_AUTH_KEY: process.env.PRIVATE_AUTH_KEY,

  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS),

  ACCESS_TOKEN_EXPIRES_IN: "1h",

  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  TOTP_SECRET_KEY: process.env.TOTP_SECRET_KEY,
};

export default AuthConfig;
