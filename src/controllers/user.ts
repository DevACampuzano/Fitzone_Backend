import type { ModelSeq } from "../common/interface/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../models";
import { config } from "../config";

export class UserController {
  private userModel: ModelSeq;

  constructor() {
    this.userModel = db.Users;
  }

  async getUserByEmail(email: string) {
    return await this.userModel.findOne({ where: { email } });
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
      const user = await this.getUserByEmail(email);
      if (!user) {
        return {
          code: 404,
          response: {
            status: false,
            message: "Usuario no encontrado",
          },
        };
      }
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
}
