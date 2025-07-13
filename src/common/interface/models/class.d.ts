enum IClassDifficulty {
  Principiante = "Principiante",
  Intermedio = "Intermedio",
  Avanzado = "Avanzado",
}

interface IClass {
  id: number;
  name: string;
  description: string;
  duration: number;
  capacity: number;
  price: number;
  difficulty: IClassDifficulty;
  photo: string;
  location: string;
  equipment: string;
  benefits: string;
  requirements: string;
  id_category: number;
  status: number;
}

type ICreationClass = Optional<IClass, "id" | "status">;

type ClassModel = Model<IClass, ICreationClass>;
