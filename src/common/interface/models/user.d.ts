interface IUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone?: string | null;
  password: string;
  token_FCM?: string | null;
  status: number;
}

type ICreationUser = Optional<IUser, "id" | "status">;

type UserModel = Model<IUser, ICreationUser>;
