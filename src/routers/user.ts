import { Router, type Request, type Response } from "express";
import { check } from "express-validator";
import { UserController } from "../controllers";
import { validateFields, validateJWT } from "../common/middlewares";

enum UserErrorCodes {
  Error_1 = "USER_001",
  Error_2 = "USER_002",
  Error_3 = "USER_003",
  Error_4 = "USER_004",
}

const userController = new UserController();
const router = Router();

router.post(
  "/create",
  [
    check("name").notEmpty().withMessage("El nombre es requerido"),
    check("lastName").notEmpty().withMessage("El apellido es requerido"),
    check("email")
      .isEmail()
      .withMessage("Se requiere un correo electrónico válido"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres"),
    validateFields,
  ],
  async (req: Request, res: Response) => {
    try {
      const { name, lastName, email, phone, password } = req.body;
      const { code, response } = await userController.createUser({
        name,
        lastName,
        email,
        phone,
        password,
      });
      res.status(code).json(response);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        status: false,
        message: "Error creating user",
        error: error instanceof Error ? error.message : "Unknown error",
        code: UserErrorCodes.Error_1,
      });
    }
  }
);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Se requiere un correo electrónico válido"),
    check("password").notEmpty().withMessage("La contraseña es requerida"),
    validateFields,
  ],
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { code, response } = await userController.login(email, password);
      res.status(code).json(response);
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({
        status: false,
        message: "Error logging in user",
        error: error instanceof Error ? error.message : "Unknown error",
        code: UserErrorCodes.Error_2,
      });
    }
  }
);

router.get(
  "/get-my-progress",
  [validateJWT],
  async (req: Request, res: Response) => {
    try {
      const userId = req["decoded"].id;
      if (!userId) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized",
          code: UserErrorCodes.Error_3,
        });
      }
      const { code, response } = await userController.getMyProgress(userId);
      res.status(code).json(response);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({
        status: false,
        message: "Error fetching user progress",
        error: error instanceof Error ? error.message : "Unknown error",
        code: UserErrorCodes.Error_4,
      });
    }
  }
);

export default router;
