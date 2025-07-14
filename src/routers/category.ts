import { Router, type Request, type Response } from "express";
import { CategoryController } from "../controllers";
import { validateJWT } from "../common/middlewares";
// import { validateJWT } from "../common/middlewares/";

enum CategoryErrorCodes {
  Error_1 = "CATEGORY_001",
  Error_2 = "CATEGORY_002",
}

const categoryController = new CategoryController();
const router = Router();

router.get("/", [validateJWT], async (req: Request, res: Response) => {
  try {
    const { code, response } = await categoryController.getAllCategories();
    res.status(code).json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      status: false,
      message: "Error fetching categories",
      error: error instanceof Error ? error.message : "Unknown error",
      code: CategoryErrorCodes.Error_1,
    });
  }
});

export default router;
