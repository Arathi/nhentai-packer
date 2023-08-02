<script setup lang="ts">
import {useAria2Store} from "../../stores/Aria2Store";
import {Aria2WebSocketClient} from "../../services/aria2/Aria2WebSocketClient";
import {onMounted} from "vue";

const store = useAria2Store();

const aria2client = new Aria2WebSocketClient(
  store.secret,
  store.baseURL
);

function addUri() {
  console.info("测试添加URI");
}

function getVersion() {
  console.info("测试获取版本号");
  aria2client.getVersion().then((version) => {
    if (version != null) {
      console.info("获取版本信息：", version);
    }
    else {
      console.warn("版本信息获取失败");
    }
  });
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
    <div class="test-module getVersion">
      <button @click="getVersion">getVersion</button>
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