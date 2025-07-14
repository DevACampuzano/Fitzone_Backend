import { DataTypes, type Sequelize } from "sequelize";
import type { ModelSeq } from "../common/interface/db";
export default (sequelize: Sequelize) => {
  const Payment: ModelSeq<PaymentModel> = sequelize.define<PaymentModel>(
    "Payment",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      id_user_schedule: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
        allowNull: false,
      },
    },
    {
      tableName: "payment",
      timestamps: false,
    }
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.UserSchedule, {
      foreignKey: "id_user_schedule",
      as: "userSchedule",
    });
  };

  return Payment;
};
