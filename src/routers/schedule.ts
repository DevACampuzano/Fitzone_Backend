import { Router, type Request, type Response } from "express";
import { ScheduleController } from "../controllers";
import { validateJWT } from "../common/middlewares";
// import { validateJWT } from "../common/middlewares/";

enum ScheduleErrorCodes {
  Error_1 = "SCHEDULE_001",
  Error_2 = "SCHEDULE_002",
}
const scheduleController = new ScheduleController();
const router = Router();

router.get("/", [validateJWT], async (req: Request, res: Response) => {
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
});

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
        code: ScheduleErrorCodes.Error_2,
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
        code: ScheduleErrorCodes.Error_2,
      });
    }
  }
);

export default router;
