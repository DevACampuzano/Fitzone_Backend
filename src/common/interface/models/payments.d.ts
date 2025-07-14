interface IPayment {
  id: number;
  id_user_schedule: number;
  value: number;
  date: Date;
  status: number;
}
type ICreationPayment = Optional<IPayment, "id" | "status">;

type PaymentModel = Model<IPayment, ICreationPayment>;
