import {Task, ITask} from "./Task";

export class TaskGroup {
  name: string;
  referer: string;
  tasks: Task[];

  constructor(name: string, referer: string, tasks: ITask[]) {
    this.name = name;
    this.referer = referer;
    this.tasks = tasks.map((options) => new Task(options));
  }
}