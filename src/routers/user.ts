import { Router, type Request, type Response } from "express";
import { check } from "express-validator";
import { UserController } from "../controllers";

enum UserErrorCodes {
  Error_1 = "USER_001",
  Error_2 = "USER_002",
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

export default router;
