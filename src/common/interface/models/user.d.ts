interface IUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  status: number;
}

type ICreationUser = Optional<IUser, "id" | "status">;

type UserModel = Model<IUser, ICreationUser>;
