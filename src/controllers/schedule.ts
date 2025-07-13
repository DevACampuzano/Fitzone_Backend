import { Op } from "sequelize";
import type { ModelSeq } from "../common/interface/db";
import db from "../models";

export class ScheduleController {
  private scheduleModel: ModelSeq<ScheduleModel>;
  private userScheduleModel: ModelSeq<UserScheduleModel>;
  private userModel: ModelSeq<UserModel>;
  private classModel: ModelSeq<ClassModel>;
  private categoryModel: ModelSeq<CategoryModel>;

  constructor() {
    this.scheduleModel = db.Schedule;
    this.userScheduleModel = db.UserSchedule;
    this.userModel = db.Users;
    this.classModel = db.Class;
    this.categoryModel = db.Category;
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
}
