import { DataTypes, type Sequelize } from "sequelize";
import type { ModelSeq } from "../common/interface/db";
export default (sequelize: Sequelize) => {
  const Users: ModelSeq = sequelize.define<UserModel>(
    "Users",
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
      lastName: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      password: {
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
      tableName: "users",
      timestamps: false,
    }
  );

  Users.associate = (models) => {
    Users.hasMany(models.UserSchedule, {
      foreignKey: "id_user",
      as: "userSchedules",
    });
    // Users.hasMany(models.Payment, {
    //   foreignKey: "id_user",
    //   as: "payments",
    // });
  };

  return Users;
};
