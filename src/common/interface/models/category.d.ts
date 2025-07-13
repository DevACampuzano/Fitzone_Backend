interface ICategory {
  id: number;
  name: string;
  status: number;
}

type ICreationCategory = Optional<ICategory, "id" | "status">;

type CategoryModel = Model<ICategory, ICreationCategory>;
