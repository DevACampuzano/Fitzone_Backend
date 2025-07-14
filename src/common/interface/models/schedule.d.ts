interface ISchedule {
  id: number;
  id_class: number;
  startTime: Date;
  status: number;
}

interface IScheduleWithRelations extends ISchedule {
  userSchedules?: IUserSchedule[];
  class?: IClass & {
    category?: ICategory;
  };
}

type ICreationSchedule = Optional<ISchedule, "id" | "status">;

type ScheduleModel = Model<ISchedule, ICreationSchedule>;
