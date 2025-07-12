import * as joi from "joi";
import type { Dialect } from "sequelize";

const envSchema = joi
  .object({
    PORT: joi.number().default(3000),
    AUTH_JWT_SECRET: joi.string().required(),
    NODE_ENV: joi
      .string()
      .valid("production", "development", "test")
      .default("development"),
    DB_NAME: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_DIALECT: joi
      .string()
      .valid("mysql", "mariadb", "postgres", "sqlite")
      .default("mysql"),
    DB_PORT: joi.number().default(3306),
    SQ_LOGGING: joi.string().allow("").valid("true", "false").default("false"),
    URL_CERTIFICADO: joi.string().allow("").optional(),
    NODEMAILER_SERVICE: joi
      .string()
      .valid("gmail", "outlook", "yahoo")
      .required(),
    NODEMAILER_USER: joi.string().required(),
    NODEMAILER_PASSWORD: joi.string().required(),
  })
  .unknown(true);

const { error, value: env } = envSchema.validate(process.env, {
  abortEarly: true,
});

if (error) {
  throw new Error(`Environment variable validation error: ${error.message}`);
}

export const config = {
  server: {
    port: env.PORT,
    secret: env.AUTH_JWT_SECRET,
    dev: env.NODE_ENV !== "production",
    urlCertificado: env.URL_CERTIFICADO,
  },
  db: {
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    dialect: env.DB_DIALECT as Dialect,
    port: env.DB_PORT,
    logging: env.SQ_LOGGING === "true" ? console.log : false,
  },
  email: {
    service: env.NODEMAILER_SERVICE,
    auth: {
      user: env.NODEMAILER_USER,
      pass: env.NODEMAILER_PASSWORD,
    },
  },
};
