<script setup lang="ts">
import {provide, onMounted} from 'vue';
import {NHentaiCrawler} from "../services/nhentai/NHentaiCrawler";
import {useNHentaiStore} from "../stores/NHentaiStore";
import TaskInfo from "./TaskInfo.vue";

const store = useNHentaiStore();

const crawler = new NHentaiCrawler();
provide('crawler', crawler);

onMounted(() => {
  console.info("任务列表挂载完成，开始加载任务");
  const group = crawler.generateTaskGroup();
  console.info("任务信息如下：", group);
  store.setGroup(group);
});
</script>

<template>
  <div class="task-list">
    <div class="list-item" v-for="task in store.tasks.values()" :key="task.id">
      <task-info :task="task" />
    </div>
  </div>
</template>

<style scoped>
.task-list {
  /* 滚动 */
  height: 100%;
  overflow-y: auto;

  /* 弹性布局容器 */
  display: flex;
  flex-direction: column;
}

.list-item {
  flex: auto;
}

::-webkit-scrollbar {
  width: 3px;
}
::-webkit-scrollbar-track {
  background-color: rgba(13, 13, 13, 0.2);
}
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>