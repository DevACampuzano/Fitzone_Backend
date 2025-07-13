import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { config } from "../config/environment";
import type { IGeneralObj, ModelSeq } from "../common/interface/db";

const basename = path.basename(__filename);

const db: IGeneralObj = {};

const sequelize = new Sequelize({
  database: config.db.database,
  username: config.db.username,
  password: config.db.password,
  host: config.db.host,
  dialect: config.db.dialect,
  port: config.db.port,
  logging: config.db.logging,
  timezone: "-05:00",
  pool: {
    max: 1000,
    min: 0,
    acquire: 600000,
    idle: 600000,
  },
});

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  const model = db[modelName] as ModelSeq;
  if (model.associate) {
    model.associate(db as DbModels);
  }
});

db["sequelize"] = sequelize;

export type DbModels = {
  sequelize: Sequelize;
  Sequelize: Sequelize;
  Users: ModelSeq;
  Class: ModelSeq;
  Category: ModelSeq;
  Schedule: ModelSeq;
  UserSchedule: ModelSeq;
};

export default db as DbModels;
