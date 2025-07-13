interface ISchedule {
  id: number;
  id_class: number;
  startTime: Date;
  status: number;
}
type ICreationSchedule = Optional<ISchedule, "id" | "status">;

type ScheduleModel = Model<ISchedule, ICreationSchedule>;
