interface IUserSchedule {
  id: number;
  id_user: number;
  id_schedule: number;
  id_payment?: number;
  status: number;
}

interface IUserScheduleWithRelations extends IUserSchedule {
  schedule?: ISchedule & {
    class?: IClass;
  };
}

type ICreationUserSchedule = Optional<IUserSchedule, "id" | "status">;
type UserScheduleModel = Model<IUserSchedule, ICreationUserSchedule>;
