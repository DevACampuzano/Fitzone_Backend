import type { ModelSeq } from "../common/interface/db";
import db from "../models";

export class CategoryController {
  private categoryModel: ModelSeq<CategoryModel>;

  constructor() {
    this.categoryModel = db.Category;
  }

  async getAllCategories() {
    try {
      const categories = await this.categoryModel.findAll({
        where: { status: true },
        attributes: ["id", "name"],
      });
      return {
        code: 200,
        response: {
          status: true,
          message: "Categories fetched successfully",
          data: categories,
        },
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Error fetching categories");
    }
  }
}
