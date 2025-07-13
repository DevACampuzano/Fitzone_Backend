import { DataTypes, type Sequelize } from "sequelize";
import type { ModelSeq } from "../common/interface/db";
export default (sequelize: Sequelize) => {
  const Schedule: ModelSeq = sequelize.define<ScheduleModel>(
    "Schedule",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      id_class: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
        allowNull: false,
      },
    },
    {
      tableName: "schedule",
      timestamps: false,
    }
  );

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Class, {
      foreignKey: "id_class",
      as: "class",
    });
    Schedule.hasMany(models.UserSchedule, {
      foreignKey: "id_schedule",
      as: "userSchedules",
    });
  };

  return Schedule;
};
