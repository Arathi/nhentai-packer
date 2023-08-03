<script setup lang="ts">
import {useAria2Store} from "../../stores/Aria2Store";
import {Aria2WebSocketClient} from "../../services/aria2/Aria2WebSocketClient";
import {onMounted, ref} from "vue";
import {
  ProgressChangedEvent,
  SessionInfoReceivedEvent,
  TaskCreatedEvent,
  VersionReceivedEvent
} from "../../services/aria2/types";
import {useNHentaiStore} from "../../stores/NHentaiStore";
import {aria2statusToTaskStatus, Task, TaskStatus} from "../../models/Task";

const store = useAria2Store();
const nhStore = useNHentaiStore();

const enabled = ref(false);
const version = ref("");
const session = ref("");

const aria2client = new Aria2WebSocketClient(
  store.secret,
  store.baseURL,
  true,
);

aria2client.onConnected((evt) => {
  console.info("Aria2 WebSocket JSON-RPC 服务器连接成功");
  enabled.value = true;
});
aria2client.onTaskCreated((event: TaskCreatedEvent) => {
  console.info("Aria2下载任务创建成功：", event);
  nhStore.taskCreated(event.detail.taskId, event.detail.gid);
});
aria2client.onProgressChanged((event: ProgressChangedEvent) => {
  console.info("Aria2下载任务进度发生变化：", event);
  const taskStatus: TaskStatus = aria2statusToTaskStatus(event.detail.status);
  nhStore.updateProgress(
    event.detail.gid,
    event.detail.completedLength,
    event.detail.totalLength,
    taskStatus,
  );
});
aria2client.onVersionReceived((event: VersionReceivedEvent) => {
  console.info("获取到Aria2版本：", event);
  version.value = event.detail.version;
});
aria2client.onSessionInfoReceived((event: SessionInfoReceivedEvent) => {
  console.info("获取到Aria2 Session信息：", event);
  session.value = event.detail.sessionId;
});

function addUri() {
  console.info("测试添加URI");
  let task: Task | null = null;
  for (const t of nhStore.tasks.values()) {
    if (t.status == TaskStatus.Pending) {
      task = t;
      break;
    }
  }
  if (task != null) {
    console.info(`执行任务`, task);
    aria2client.addUri(
      [task.url],
      {
        "out": task.fileName,
        "dir": "D:\\Temp\\aria2client",
        "all-proxy": "http://127.0.0.1:8118",
      },
      undefined,
      task.id
    );
  }
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
    <div class="test-module">
      <span>Aria2版本：</span>
      <span>{{version}}</span>
    </div>
    <div class="test-module">
      <span>Session信息：</span>
      <span>{{session}}</span>
    </div>
    <div class="test-module addUri">
      <button @click="addUri" :disabled="!enabled">addUri</button>
    </div>
    <div class="test-module tellActive">
      <button @click="tellActive" :disabled="!enabled">tellActive</button>
    </div>
    <div class="test-module getVersion">
      <button @click="getVersion" :disabled="!enabled">getVersion</button>
    </div>
    <div class="test-module getSessionInfo">
      <button @click="getSessionInfo" :disabled="!enabled">getSessionInfo</button>
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

button {
  margin-left: 10px;
}

.test-module {
  margin-top: 10px;
}
</style>