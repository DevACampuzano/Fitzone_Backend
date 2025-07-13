enum IClassDifficulty {
  Principiante = "Principiante",
  Intermedio = "Intermedio",
  Avanzado = "Avanzado",
}

interface IClass {
  id: number;
  duration: number;
  capacity: number;
  price: number;
  difficulty: IClassDifficulty;
  name: string;
  photo?: string;
  id_category: number;
  status: number;
}

type ICreationClass = Optional<IClass, "id" | "status">;

type ClassModel = Model<IClass, ICreationClass>;
