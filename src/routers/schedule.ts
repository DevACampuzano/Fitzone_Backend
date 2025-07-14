import { Router, type Request, type Response } from "express";
import { ScheduleController } from "../controllers";
import { validateFields, validateJWT } from "../common/middlewares";
import { check } from "express-validator";
// import { validateJWT } from "../common/middlewares/";

enum ScheduleErrorCodes {
  Error_1 = "SCHEDULE_001",
  Error_2 = "SCHEDULE_002",
  Error_3 = "SCHEDULE_003",
  Error_4 = "SCHEDULE_004",
  Error_5 = "SCHEDULE_005",
  Error_6 = "SCHEDULE_006",
  Error_7 = "SCHEDULE_007",
}
const scheduleController = new ScheduleController();
const router = Router();

router.get(
  "/",
  [
    validateJWT,
    check("limit")
      .optional()
      .isNumeric()
      .withMessage("El límite debe ser un número"),
    check("offset")
      .optional()
      .isNumeric()
      .withMessage("El offset debe ser un número"),
    validateFields,
  ],
  async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const offset = parseInt(req.query.offset as string) || 0;

      if (isNaN(limit) || isNaN(offset)) {
        return res.status(400).json({
          status: false,
          message: "Invalid limit or offset",
          code: ScheduleErrorCodes.Error_1,
        });
      }
      const { code, response } = await scheduleController.getSchedules(
        limit,
        offset
      );
      res.status(code).json(response);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      res.status(500).json({
        status: false,
        message: "Error fetching schedules",
        error: error instanceof Error ? error.message : "Unknown error",
        code: ScheduleErrorCodes.Error_2,
      });
    }
  }
);

router.get(
  "/get-my-schedules",
  [validateJWT],
  async (req: Request, res: Response) => {
    try {
      const userId = req["decoded"].id;
      const { code, response } = await scheduleController.getMySchedule(userId);
      res.status(code).json(response);
    } catch (error) {
      console.error("Error fetching user schedules:", error);
      res.status(500).json({
        status: false,
        message: "Error fetching user schedules",
        error: error instanceof Error ? error.message : "Unknown error",
        code: ScheduleErrorCodes.Error_3,
      });
    }
  }
);

router.get(
  "/get-my-stats",
  [validateJWT],
  async (req: Request, res: Response) => {
    try {
      const userId = req["decoded"].id;
      const { code, response } = await scheduleController.getMyStats(userId);
      res.status(code).json(response);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({
        status: false,
        message: "Error fetching user stats",
        error: error instanceof Error ? error.message : "Unknown error",
        code: ScheduleErrorCodes.Error_4,
      });
    }
  }
);

router.get(
  "/:id",
  [
    validateJWT,
    check("id")
      .notEmpty()
      .withMessage("El id es requerido")
      .isNumeric()
      .withMessage("El id debe ser un número"),
    validateFields,
  ],
  async (req: Request, res: Response) => {
    try {
      const scheduleId = parseInt(req.params.id ?? "");
      if (isNaN(scheduleId)) {
        return res.status(400).json({
          status: false,
          message: "Invalid schedule ID",
          code: ScheduleErrorCodes.Error_5,
        });
      }
      const { code, response } = await scheduleController.getScheduleById(
        scheduleId
      );
      res.status(code).json(response);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      res.status(500).json({
        status: false,
        message: "Error fetching schedule",
        error: error instanceof Error ? error.message : "Unknown error",
        code: ScheduleErrorCodes.Error_6,
      });
    }
  }
);

router.post(
  "/pay-reservation",
  [
    validateJWT,
    check("id_schedule")
      .notEmpty()
      .isNumeric()
      .withMessage("El id_schedule es requerido y debe ser un número"),
    validateFields,
  ],
  async (req: Request, res: Response) => {
    try {
      const userId = req["decoded"].id;
      const { id_schedule } = req.body;

      const { code, response } = await scheduleController.createPayment(
        userId,
        id_schedule
      );
      res.status(code).json(response);
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({
        status: false,
        message: "Error processing payment",
        error: error instanceof Error ? error.message : "Unknown error",
        code: ScheduleErrorCodes.Error_7,
      });
    }
  }
);

export default router;
