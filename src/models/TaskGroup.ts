import {ITask} from "./Task";

export interface ITaskGroup {
  id: string;
  name: string;
  referer: string;
  tasks: ITask[];
}

export class TaskGroup {
  id: string;
  name: string;
  referer: string;
  taskIds: number[];

  constructor(options: ITaskGroup) {
    this.id = options.id;
    this.name = options.name;
    this.referer = options.referer;
    this.taskIds = options.tasks.map(t => t.id);
  }
}