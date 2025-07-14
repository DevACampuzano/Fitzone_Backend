import { DataTypes, type Sequelize } from "sequelize";
import type { ModelSeq } from "../common/interface/db";

export default (sequelize: Sequelize) => {
  const Class: ModelSeq<ClassModel> = sequelize.define<ClassModel>(
    "Class",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      duration: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.ENUM("Principiante", "Intermedio", "Avanzado"),
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      equipment: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "[]",
      },
      benefits: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "[]",
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "[]",
      },
      id_category: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
        allowNull: false,
      },
    },
    {
      tableName: "class",
      timestamps: false,
    }
  );

  Class.associate = (models) => {
    Class.belongsTo(models.Category, {
      foreignKey: "id_category",
      as: "category",
    });
    Class.hasMany(models.Schedule, {
      foreignKey: "id_class",
      as: "schedules",
    });
  };

  return Class;
};
