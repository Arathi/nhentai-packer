import {defineStore} from "pinia";
import {ITask, TaskStatus} from "../models/Task";
import {TaskGroup} from "../models/TaskGroup";

interface State {
  taskGroup: TaskGroup | null;
  gidMap: Map<string, number>;
}

export const useNHentaiStore = defineStore('nhentai', {
  state: (): State => ({
    taskGroup: null,
    gidMap: new Map(),
  }),
  getters: {
    tasks(state): ITask[] {
      if (state.taskGroup != null) {
        return state.taskGroup.tasks as ITask[];
      }
      return [];
    }
  },
  actions: {
    /**
     * 任务创建完成
     * @param fileName
     * @param gid
     */
    taskCreated(fileName: string, gid: string) {
      const index = this.tasks.findIndex((task) => task.fileName == fileName);
      if (index >= 0 && index < this.tasks.length) {
        console.info(`更新任务${fileName}的gid为${gid}`);
        this.gidMap.set(gid, index);
        this.tasks[index].status = TaskStatus.Created;
      }
      else {
        console.warn(`未找到文件名为${fileName}的任务，获取到的索引为${index}`);
      }
    },

    /**
     * 更新任务进度
     * @param gid
     * @param progress
     * @param status
     */
    updateProgress(gid: string, progress?: number, status?: TaskStatus) {
      // 通过gid获取任务
      const index = this.gidMap.get(gid);
      if (index == undefined) {
        console.warn(`当前任务组未找到gid为${gid}的任务`);
        return;
      }
      if (index < 0 || index >= this.tasks.length) {
        console.warn(`gid（${gid}）对应了无效的索引（${index}）`);
        return;
      }
      const task = this.tasks[index];
      if (task == undefined) {
        console.warn(`通过gid（${gid}）/索引（${index}）获取任务失败`);
        return;
      }

      // 更新进度
      if (progress != undefined) {
        task.progress = progress;
        console.info(`已将任务${task.fileName}的进度更新为${progress}`)
      }

      // 更新状态
      if (status != undefined) {
        task.status = status;
        console.info(`已将任务${task.fileName}的状态更新为${TaskStatus[status]}(${status})`)
      }
    }
  }
});