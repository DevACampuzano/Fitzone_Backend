import { Router, type Request, type Response } from "express";
import { NotificationController } from "../controllers";
import { validateJWT } from "../common/middlewares";
import { check } from "express-validator";

enum NotificationErrorCodes {
  Error_1 = "NOTIFICATION_001",
  Error_2 = "NOTIFICATION_002",
  Error_3 = "NOTIFICATION_003",
}

const notificationController = new NotificationController();
const router = Router();

router.get("/", [validateJWT], async (req: Request, res: Response) => {
  try {
    const { decoded } = req;
    const { code, response } = await notificationController.sendNotification({
      decoded,
      title: "New Notification",
      body: "You have a new notification",
    });
    res.status(code).json(response);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      status: false,
      message: "Error fetching notifications",
      error: error instanceof Error ? error.message : "Unknown error",
      code: NotificationErrorCodes.Error_1,
    });
  }
});

router.post(
  "/add-fcm-token",
  [
    validateJWT,
    check("token").notEmpty().isString().withMessage("Invalid token"),
  ],
  async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const { id: id_user } = req.decoded;

      const { code, response } = await notificationController.addFCMToken(
        id_user,
        token
      );
      res.status(code).json(response);
    } catch (error) {
      console.error("Error adding FCM token:", error);
      res.status(500).json({
        status: false,
        message: "Error adding FCM token",
        error: error instanceof Error ? error.message : "Unknown error",
        code: NotificationErrorCodes.Error_2,
      });
    }
  }
);

export default router;
