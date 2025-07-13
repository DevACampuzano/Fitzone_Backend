import { Model as SequelizeModel, Optional as SequelizeOptional } from "sequelize";

declare global {
  type Model<T, U> = SequelizeModel<T, U>;
  type Optional<T, K extends keyof T> = SequelizeOptional<T, K>;
}