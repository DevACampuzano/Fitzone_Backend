interface IUserSchedule {
  id: number;
  id_user: number;
  id_schedule: number;
  id_payment?: number;
  status: number;
}

type ICreationUserSchedule = Optional<IUserSchedule, "id" | "status">;
type UserScheduleModel = Model<IUserSchedule, ICreationUserSchedule>;
