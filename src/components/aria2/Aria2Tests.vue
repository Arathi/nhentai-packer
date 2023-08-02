<script setup lang="ts">
import {useAria2Store} from "../../stores/Aria2Store";
import {Aria2WebSocketClient} from "../../services/aria2/Aria2WebSocketClient";
import {onMounted} from "vue";
import {
  ProgressChangedEvent,
  TaskCreatedEvent,
  VersionReceivedEvent
} from "../../services/aria2/types";

const store = useAria2Store();

const aria2client = new Aria2WebSocketClient(
  store.secret,
  store.baseURL,
  true,
);

aria2client.onConnected((evt) => {
  console.info("Aria2 WebSocket JSON-RPC 服务器连接成功");
});

aria2client.onTaskCreated((event: TaskCreatedEvent) => {
  console.info("Aria2下载任务创建成功：", event);
});

aria2client.onProgressChanged((event: ProgressChangedEvent) => {
  console.info("Aria2下载任务进度发生变化：", event);
})

aria2client.onVersionReceived((event: VersionReceivedEvent) => {
  console.info("获取到Aria2版本：", event);
})

aria2client.onSessionInfoReceived((event: CustomEvent<string>) => {
  console.info("获取到Aria2 Session信息：", event);
})

function addUri() {
  console.info("测试添加URI");
}

function tellActive() {
  console.info("测试获取活动任务");
}

function getVersion() {
  console.info("测试获取版本号");
  aria2client.getVersion();
}

function getSessionInfo() {
  console.info("测试获取会话信息");
  aria2client.getSessionInfo();
}

onMounted(() => {
  console.info("Aria2测试窗口挂载完成");
});
</script>

<template>
  <div class="aria2-tests">
    <div class="test-module addUri">
      <button @click="addUri">addUri</button>
    </div>
    <div class="test-module tellActive">
      <button @click="tellActive">tellActive</button>
    </div>
    <div class="test-module getVersion">
      <button @click="getVersion">getVersion</button>
    </div>
    <div class="test-module getSessionInfo">
      <button @click="getSessionInfo">getSessionInfo</button>
    </div>
  </div>
</template>

<style scoped>
.aria2-tests {
  position: fixed;
  top: 10px;
  right: 10px;
  width: 25%;
  height: 25%;

  /* 基础样式 */
  background-color: #0D0D0D;
  border: 2px solid #4D4D4D;
  border-radius: 7px;
  padding: 10px;
  opacity: 0.75;

  display: flex;
  flex-direction: column;
}

.test-module {
  margin-top: 10px;
}
</style>