import type { ModelCtor } from "sequelize";

interface IGeneralObj {
  [key: string]: ModelSeq | Sequelize;
}

interface ModelSeq<T> extends ModelCtor<T> {
  associate?: (db: DbModels) => void;
}
