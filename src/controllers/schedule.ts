import type { ModelSeq } from "../common/interface/db";
import db from "../models";

export class ScheduleController {
  private scheduleModel: ModelSeq;
  private userScheduleModel: ModelSeq;
  private usersModel: ModelSeq;
  private classModel: ModelSeq;

  constructor() {
    this.scheduleModel = db.Schedule;
    this.userScheduleModel = db.UserSchedule;
    this.usersModel = db.Users;
    this.classModel = db.Class;
  }

  async getSchedules(limit: number, offset: number = 0) {
    try {
      const schedules = await this.scheduleModel
        .findAll({
          limit,
          offset,
          where: { status: true },
          include: [
            {
              model: this.userScheduleModel,
              as: "userSchedules",
              attributes: ["id", "id_user", "id_schedule"],
              // where: { status: true },
            },
            {
              model: this.classModel,
              as: "class",
              attributes: ["name", "photo", "capacity"],
              where: { status: true },
            },
          ],
        })
        .then((schedules) => {
          return schedules.map((schedule) => ({
            ...schedule.toJSON(),
          }));
        });

      const data = schedules.map(
        ({ class: Class, userSchedules, ...schedule }) => {
          let spots = Class.capacity - userSchedules.length;

          return {
            id: schedule.id,
            name: Class.name,
            image: Class.photo,
            time: schedule.startTime,
            spots,
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
}
