<script setup lang="ts">
import TaskList from './TaskList.vue';

import {useNHentaiStore} from "../stores/NHentaiStore";
import {computed, onMounted, ref} from "vue";
import {TaskStatus} from "../models/Task";

const store = useNHentaiStore();

let hotKeyRegistered = false;
const show = ref(true);

onMounted(() => {
  console.debug("任务窗口挂载完成");
  if (!hotKeyRegistered) {
    addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.altKey && event.key.toUpperCase() === "T") {
        show.value = !show.value;
      }
    });
  }
  hotKeyRegistered = true;
});

const taskAmount = computed(() => {
  return store.tasks.size;
});

const successTaskAmount = computed(() => {
  return store.successTaskAmount;
});

function downloadAll() {
  console.info("开始下载");
}

function pack() {
  console.info("开始打包");
}

</script>

<template>
  <div class="task-view" v-show="show">
    <div class="view-item buttons">
      <button @click="downloadAll" disabled>全部下载</button>
      <button @click="pack" disabled>打包保存</button>
    </div>
    <div class="view-item overall-progress">
      <progress :value="successTaskAmount" :max="taskAmount" class="fill" />
    </div>
    <div class="view-item task-list">
      <task-list />
    </div>
  </div>
</template>

<style scoped>
.task-view {
  /* 悬浮 */
  position: fixed;
  left: 10px;
  bottom: 10px;
  width: 25%;
  height: 75%;

  /* 基础样式 */
  background-color: #0D0D0D;
  border: 2px solid #4D4D4D;
  border-radius: 7px;
  padding: 10px;
  opacity: 0.75;

  /* 弹性布局容器 */
  display: flex;
  flex-direction: column;
}

.view-item {

}

.task-list {
  height: calc(100% - 20px);
}

.fill {
  width: 100%;
}
</style>