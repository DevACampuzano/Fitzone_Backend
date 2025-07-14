import { DataTypes, type Sequelize } from "sequelize";
import type { ModelSeq } from "../common/interface/db";
export default (sequelize: Sequelize) => {
  const UserSchedule: ModelSeq<UserScheduleModel> =
    sequelize.define<UserScheduleModel>(
      "UserSchedule",
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        id_user: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        id_schedule: {
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
        tableName: "user_schedule",
        timestamps: false,
      }
    );

  UserSchedule.associate = (models) => {
    UserSchedule.belongsTo(models.Schedule, {
      foreignKey: "id_schedule",
      as: "schedule",
    });
    UserSchedule.belongsTo(models.Users, {
      foreignKey: "id_user",
      as: "user",
    });
    UserSchedule.hasOne(models.Payment, {
      foreignKey: "id_user_schedule",
      as: "payment",
    });
  };

  return UserSchedule;
};
