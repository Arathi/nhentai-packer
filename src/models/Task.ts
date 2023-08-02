export enum TaskStatus {
  Pending = 0,
  Created = 1,
  Running = 2,
  Success = 3,
  Failure = 9,
}

export interface ITask {
  fileName: string;
  url: string;
  status: TaskStatus;
  progress: number;
}

export class Task implements ITask {
  fileName: string;
  url: string;
  status: TaskStatus;
  progress: number;

  constructor(options: ITask) {
    this.fileName = options.fileName;
    this.url = options.url;
    this.status = options.status;
    this.progress = options.progress;
  }
}