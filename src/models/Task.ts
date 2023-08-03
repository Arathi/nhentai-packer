import {Aria2Status} from "../services/aria2/types";

export enum TaskStatus {
  Pending = 0,
  Created, // waiting
  Running, // active
  Paused, // paused
  Success = 8, // complete
  Failure = 9, // error, removed
}

export function aria2statusToTaskStatus(aStatus: Aria2Status) {
  switch (aStatus) {
    case "waiting":
      return TaskStatus.Created;
    case "active":
      return TaskStatus.Running;
    case "paused":
      return TaskStatus.Paused;
    case "complete":
      return TaskStatus.Success;
    case "error":
    case "removed":
      return TaskStatus.Failure;
  }
  return TaskStatus.Pending;
}

export interface ITask {
  id: number;
  fileName: string;
  url: string;
}

export class Task implements ITask {
  /**
   * 任务ID
   */
  id: number;

  /**
   * 文件名
   */
  fileName: string;

  /**
   * 图片链接
   */
  url: string;

  /**
   * 状态
   */
  status: TaskStatus = TaskStatus.Pending;

  /**
   * 文件大小
   */
  length: number | null = null;

  /**
   * 已下载大小
   */
  completedLength: number = 0;

  /**
   * Aria2任务ID
   */
  gid: string | null = null;

  constructor(options: ITask) {
    this.id = options.id;
    this.fileName = options.fileName;
    this.url = options.url;
  }

  /**
   * 下载进度
   *
   * 取值范围：
   * 10000（任务已完成）
   * [0,10000]（任务未完成，长度已获取）
   * 0（任务未完成，长度未获取）
   */
  get progress(): number {
    // 任务完成，无条件设置为10000
    if (this.status == TaskStatus.Success) {
      return 10000;
    }
    // 长度已获取
    if (this.length != null && this.length > 0) {
      const rate = this.completedLength / this.length;
      return Math.round(rate * 10000);
    }
    // 长度未获取
    return 0;
  }
}