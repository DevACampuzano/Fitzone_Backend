import type { ModelSeq } from "../common/interface/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../models";
import { config } from "../config";
import { Op } from "sequelize";

export class UserController {
  private userModel: ModelSeq<UserModel>;
  private scheduleModel: ModelSeq<ScheduleModel>;
  private userScheduleModel: ModelSeq<UserScheduleModel>;

  constructor() {
    this.userModel = db.Users;
    this.scheduleModel = db.Schedule;
    this.userScheduleModel = db.UserSchedule;
  }

  async getUserByEmail(email: string) {
    return await this.userModel.findOne({ where: { email, status: true } });
  }

  async createUser(data: ICreationUser) {
    try {
      const existingUser = await this.getUserByEmail(data.email);
      if (existingUser) {
        return {
          code: 409,
          response: {
            status: false,
            message: "El correo electrónico ya está en uso.",
          },
        };
      }
      const hashedPassword = await bcrypt.hash(data.password, 12);
      data.password = hashedPassword;
      await this.userModel.create(data);
      return {
        code: 201,
        response: {
          status: true,
          message: "Usuario creado con éxito",
          // data: user,
        },
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Error creating user");
    }
  }

  async login(email: string, password: string) {
    try {
      const isUser = await this.getUserByEmail(email);
      if (!isUser) {
        return {
          code: 404,
          response: {
            status: false,
            message: "Usuario no encontrado",
          },
        };
      }
      const user = isUser.toJSON();
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          code: 401,
          response: {
            status: false,
            message: "Contraseña incorrecta",
          },
        };
      }

      const token = jwt.sign({ id: user.id }, config.server.secret, {
        expiresIn: "12h",
      });

      return {
        code: 200,
        response: {
          status: true,
          message: "Inicio de sesión exitoso",
          data: {
            user: {
              name: user.name,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
            },
            token,
          },
        },
      };
    } catch (error) {
      console.error("Error logging in user:", error);
      throw new Error("Error logging in user");
    }
  }

  async getMyProgress(userId: number) {
    try {
      console.log("Fetching user progress for userId:", userId);
      const user = await this.userModel.findByPk(userId, {
        attributes: ["id", "name", "lastName", "email", "phone"],
      });

      if (!user) {
        return {
          code: 404,
          response: {
            status: false,
            message: "Usuario no encontrado",
          },
        };
      }

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      const userShedule = await this.userScheduleModel
        .findAll({
          where: { id_user: userId, status: true },
          include: [
            {
              model: this.scheduleModel,
              as: "schedule",
              attributes: ["id", "startTime"],
              where: {
                status: true,
                startTime: {
                  [Op.between]: [startOfMonth, endOfMonth],
                },
              },
            },
          ],
        })
        .then(
          (schedules) =>
            schedules.map((schedule) =>
              schedule.toJSON()
            ) as IUserScheduleWithRelations[]
        );

      const nextClasses = userShedule.filter(
        ({ schedule }) => new Date(schedule!.startTime) > now
      ).length;

      return {
        code: 200,
        response: {
          status: true,
          data: {
            totalClasses: userShedule.length - nextClasses,
            nextClasses,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching user progress:", error);
      throw new Error("Error fetching user progress");
    }
  }
}
