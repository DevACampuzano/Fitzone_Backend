import { DataTypes, type Sequelize } from "sequelize";
import type { ModelSeq } from "../common/interface/db";
export default (sequelize: Sequelize) => {
  const Category: ModelSeq<CategoryModel> = sequelize.define<CategoryModel>(
    "Category",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
        allowNull: false,
      },
    },
    {
      tableName: "categories",
      timestamps: false,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Class, {
      foreignKey: "id_category",
      as: "classes",
    });
  };

  return Category;
};
