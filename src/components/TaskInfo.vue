<script setup lang="ts">
import {ITask, TaskStatus} from "../models/Task";
import {computed} from "vue";

const props = defineProps<{
  task: ITask
}>();

const statusTag = computed(() => {
  switch (props.task.status) {
    case TaskStatus.Pending:
      return "等待中";
    case TaskStatus.Created:
      return "已创建";
    case TaskStatus.Running:
      return "下载中";
    case TaskStatus.Success:
      return "完成";
    case TaskStatus.Failure:
      return "失败";
  }
  return "未知";
});
</script>

<template>
  <div class="task-info">
    <div class="field task-name">
      {{ task.fileName }}
    </div>
    <div class="field task-status">
      {{ statusTag }}
    </div>
    <div class="field task-progress">
      <progress :value="task.progress" :max="100" class="progress-bar" />
    </div>
  </div>
</template>

<style scoped>
.task-info {
  display: flex;
  flex-direction: row;
}

.task-name {
  width: 50px;
}
.task-status {
  width: 100px;
}
.task-progress {
  flex: 1;
}

.progress-bar {
  width: 100%;
}
</style>