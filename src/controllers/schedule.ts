import { Op } from "sequelize";
import type { ModelSeq } from "../common/interface/db";
import db from "../models";

export class ScheduleController {
  private scheduleModel: ModelSeq<ScheduleModel>;
  private userScheduleModel: ModelSeq<UserScheduleModel>;
  private userModel: ModelSeq<UserModel>;
  private classModel: ModelSeq<ClassModel>;
  private categoryModel: ModelSeq<CategoryModel>;
  private paymentModel: ModelSeq<PaymentModel>;

  constructor() {
    this.scheduleModel = db.Schedule;
    this.userScheduleModel = db.UserSchedule;
    this.userModel = db.Users;
    this.classModel = db.Class;
    this.categoryModel = db.Category;
    this.paymentModel = db.Payment;
  }

  async getSchedules(limit: number, offset: number = 0) {
    try {
      const now = new Date();
      // If id_user is provided, fetch only schedules for that not user
      const schedules = (await this.scheduleModel
        .findAll({
          limit,
          offset,
          where: {
            status: true,
            startTime: { [Op.gt]: now },
          },
          include: [
            {
              model: this.userScheduleModel,
              as: "userSchedules",
              attributes: ["id", "id_user", "id_schedule"],
            },
            {
              model: this.classModel,
              as: "class",
              attributes: [
                "name",
                "photo",
                "capacity",
                "difficulty",
                "price",
                "duration",
              ],
              where: { status: true },
              include: [
                {
                  model: this.categoryModel,
                  as: "category",
                  attributes: ["id", "name"],
                  where: { status: true },
                },
              ],
            },
          ],
        })
        .then((schedules) => {
          return schedules.map((schedule) => ({
            ...schedule.toJSON(),
          }));
        })) as IScheduleWithRelations[];

      const data = schedules.map(
        ({ class: Class, userSchedules, ...schedule }) => {
          return {
            id: schedule.id,
            name: Class!.name,
            image: Class!.photo,
            time: schedule.startTime,
            spots: userSchedules?.length || 0,
            spotsAvailable: Class!.capacity - (userSchedules?.length || 0),
            maxSpots: Class!.capacity,
            duration: Class!.duration,
            difficulty: Class!.difficulty,
            price: Class!.price,
            category: Class!.category,
          };
        }
      );
      return {
        code: 200,
        response: {
          status: true,
          data,
        },
      };
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw new Error("Error fetching schedules");
    }
  }

  async getMySchedule(id_user: number) {
    try {
      const userSchedule = (await this.userScheduleModel
        .findAll({
          where: { id_user },
          include: [
            {
              model: this.scheduleModel,
              as: "schedule",
              attributes: ["id", "startTime"],
              where: { status: true },
              include: [
                {
                  model: this.classModel,
                  as: "class",
                  attributes: ["id", "name", "photo", "price", "location"],
                  where: { status: true },
                },
              ],
            },
          ],
        })
        .then((userSchedule) =>
          userSchedule.map((us) => us.toJSON())
        )) as IUserScheduleWithRelations[];

      const data = userSchedule.map(({ id, schedule }) => {
        const dateStart = new Date(schedule!.startTime);
        const date = dateStart.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const time = dateStart.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          id,
          className: schedule!.class!.name,
          image: schedule!.class!.photo,
          price: schedule!.class!.price,
          location: schedule!.class!.location,
          date,
          time,
        };
      });

      return {
        code: 200,
        response: {
          status: true,
          data,
        },
      };
    } catch (error) {
      console.error("Error fetching user schedule:", error);
      throw new Error("Error fetching user schedule");
    }
  }

  async getMyStats(id_user: number) {
    try {
      const totalClasses = await this.userScheduleModel.count({
        where: { id_user },
        include: [
          {
            model: this.scheduleModel,
            as: "schedule",
            attributes: ["id", "startTime"],
            where: { status: true },
            required: true,
          },
        ],
      });

      return {
        code: 200,
        response: {
          status: true,
          data: {
            totalClasses,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw new Error("Error fetching user stats");
    }
  }

  async getScheduleById(id: number) {
    try {
      const schedule = (await this.scheduleModel
        .findOne({
          where: { id, status: true },
          include: [
            {
              model: this.classModel,
              as: "class",
              where: { status: true },
            },
          ],
        })
        .then((schedule) =>
          schedule?.toJSON()
        )) as IScheduleWithRelations | null;

      if (!schedule) {
        return {
          code: 404,
          response: {
            status: false,
            message: "Schedule not found",
          },
        };
      }

      const spots = await this.userScheduleModel.count({
        where: { id_schedule: schedule.id },
      });
      const dateStart = new Date(schedule.startTime);
      const data = {
        id: schedule.id,
        name: schedule.class!.name,
        description: schedule.class!.description,
        time: dateStart.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: dateStart.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        duration: schedule.class!.duration,
        difficulty: schedule.class!.difficulty,
        spots: schedule.class!.capacity - spots,
        maxSpots: schedule.class!.capacity,
        price: schedule.class!.price,
        image: schedule.class!.photo,
        location: schedule.class!.location,
        equipment: JSON.parse(schedule.class!.equipment),
        benefits: JSON.parse(schedule.class!.benefits),
        requirements: JSON.parse(schedule.class!.requirements),
      };

      return {
        code: 200,
        response: {
          status: true,
          data,
        },
      };
    } catch (error) {
      console.error("Error fetching schedule:", error);
      throw new Error("Error fetching schedule");
    }
  }

  async createPayment(id_user: number, id_schedule: number) {
    const transaction = await db.sequelize.transaction();
    try {
      const isUser = await this.userModel.findOne({
        where: {
          id: id_user,
          status: true,
        },
        transaction,
      });
      if (!isUser) {
        return {
          code: 404,
          response: {
            status: false,
            message: "Usuario no encontrado",
          },
        };
      }
      const scheduleInstance = await this.scheduleModel.findOne({
        where: {
          id: id_schedule,
          status: true,
        },
        include: [
          {
            model: this.classModel,
            as: "class",
            attributes: ["id", "price"],
          },
        ],
        transaction,
      });
      const schedule: IScheduleWithRelations | null = scheduleInstance
        ? (scheduleInstance.toJSON() as IScheduleWithRelations)
        : null;
      if (!schedule) {
        return {
          code: 404,
          response: {
            status: false,
            message: "Clase no encontrada",
          },
        };
      }

      const isUserSchedule = await this.userScheduleModel.findOne({
        where: {
          id_user,
          id_schedule,
        },
        transaction,
      });
      if (isUserSchedule) {
        return {
          code: 400,
          response: {
            status: false,
            message: "Usted ya ha reservado esta clase",
          },
        };
      }

      const userSchedule = await this.userScheduleModel
        .create(
          {
            id_user,
            id_schedule,
          },
          {
            transaction,
          }
        )
        .then((us) => us.toJSON());

      const payment = await this.paymentModel
        .create(
          {
            id_user_schedule: userSchedule.id,
            value: schedule.class!.price,
            date: new Date(),
          },
          {
            transaction,
          }
        )
        .then((payment) => payment.toJSON());

      await transaction.commit();
      return {
        code: 201,
        response: {
          status: true,
          data: {
            id: payment.id,
            value: payment.value,
            date: payment.date,
            userScheduleId: payment.id_user_schedule,
          },
        },
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating payment:", error);
      throw new Error("Error creating payment");
    }
  }
}
