import type { ModelCtor } from "sequelize";

interface IGeneralObj {
  [key: string]: ModelSeq | Sequelize;
}

interface ModelSeq extends ModelCtor<Model<any, any>> {
  associate?: (db: DbModels) => void;
}
