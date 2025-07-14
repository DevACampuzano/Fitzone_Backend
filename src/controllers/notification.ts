import admin from "firebase-admin";
import { config } from "../config";
import type { ModelSeq } from "../common/interface/db";
import db from "../models";
import { Op } from "sequelize";
import type { Message } from "firebase-admin/messaging";

export class NotificationController {
  private app: admin.app.App;
  private userModel: ModelSeq<UserModel>;
  constructor() {
    this.userModel = db.Users;
    this.app = admin.initializeApp({
      credential: admin.credential.cert(
        config.firebase as admin.ServiceAccount
      ),
    });
  }

  async sendNotification({
    decoded,
    title,
    body,
  }: {
    decoded: { id: string };
    title: string;
    body: string;
  }) {
    try {
      const users = await this.userModel
        .findAll({
          where: {
            status: true,
            token_FCM: { [Op.ne]: null },
          },
          attributes: ["id", "token_FCM"],
        })
        .then((users) => users.map((user) => user.toJSON()));

      const messageList: Message[] = users.map(({ token_FCM: token }) => ({
        notification: {
          title,
          body,
        },
        token: token!,
      }));

      const res = await this.app.messaging().sendEach(messageList);
      return {
        code: 200,
        response: {
          status: true,
          message: "Notifications sent successfully",
          data: res,
        },
      };
    } catch (error) {
      console.log("Error sending message:", error);
      throw error;
    }
  }

  async addFCMToken(id_user: string, token: string) {
    const transaction = await db.sequelize.transaction();
    try {
      const user = await this.userModel.findOne({
        where: { id: id_user, status: true },
        transaction,
      });
      if (!user) {
        return {
          code: 404,
          response: {
            status: false,
            message: "User not found",
          },
        };
      }

      await user.update({ token_FCM: token }, { transaction });
      await transaction.commit();
      return {
        code: 200,
        response: {
          status: true,
          message: "FCM token added successfully",
        },
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error adding FCM token:", error);
      throw error;
    }
  }
}
