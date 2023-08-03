import {defineStore} from "pinia";
import {Task, ITask, TaskStatus} from "../models/Task";
import {ITaskGroup, TaskGroup} from "../models/TaskGroup";

interface State {
  group: TaskGroup | null;
  tasks: Map<number, Task>;
  gidMap: Map<string, number>;
}

export const useNHentaiStore = defineStore('nhentai', {
  state: (): State => ({
    group: null,
    tasks: new Map(),
    gidMap: new Map(),
  }),
  getters: {
    successTaskAmount(state): number {
      let successCounter = 0;
      state.tasks.forEach((t) => {
        if (t.status == TaskStatus.Success) {
          successCounter++;
        }
      });
      return successCounter;
    },
  },
  actions: {
    /**
     * 设置任务组信息
     * @param options 任务组信息
     */
    setGroup(options: ITaskGroup) {
      this.group = new TaskGroup(options);
      this.addTasks(...options.tasks);
    },

    /**
     * 添加下载任务
     *
     * 尽量要在外部调用
     *
     * @param optionsList 任务信息
     */
    addTasks(...optionsList: ITask[]) {
      optionsList.forEach (options => {
        const task = new Task(options);
        this.tasks.set(task.id, task);
      });
    },

    /**
     * 任务创建完成
     * @param taskId 任务ID
     * @param gid Aria2任务ID
     */
    taskCreated(taskId: number, gid: string) {
      const task = this.tasks.get(taskId);
      if (task != undefined) {
        task.gid = gid;
        this.gidMap.set(gid, taskId);
        console.info(`更新任务${taskId}的gid为${gid}：`, task);
      }
      else {
        console.warn(`未找到编号为${taskId}的任务`);
      }
    },

    /**
     * 更新任务进度
     *
     * @param gid Aria2任务ID
     * @param completedLength 已下载大小
     * @param length 文件大小
     * @param status 状态值
     */
    updateProgress(gid: string, completedLength?: number, length?: number, status?: TaskStatus) {
      // 通过gid获取任务
      const taskId = this.gidMap.get(gid);
      if (taskId == undefined) {
        console.warn(`当前任务组未找到gid为${gid}的任务`);
        return;
      }
      const task = this.tasks.get(taskId);
      if (task == undefined) {
        console.warn(`通过 ${gid} => ${taskId} 获取任务失败`);
        return;
      }

      // 更新下载进度
      if (completedLength != undefined) {
        task.completedLength = completedLength;
        if (length != undefined) {
          task.length = length;
        }
        console.info(`已将任务${task.fileName}已下载${completedLength}B`);
      }

      // 更新状态
      if (status != undefined) {
        task.status = status;
        console.info(`已将任务${task.fileName}的状态更新为${TaskStatus[status]}(${status})`)
      }
    }
  }
});