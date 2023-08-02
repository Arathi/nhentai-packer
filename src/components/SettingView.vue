<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useAria2Store} from "../stores/Aria2Store";

const aria2Store = useAria2Store();

let hotKeyRegistered = false;
const show = ref(false);

const aria2url = computed({
  get() {
    return aria2Store.baseURL;
  },
  set(value) {
    aria2Store.setBaseURL(value);
  }
});

const aria2secret = computed({
  get() {
    return aria2Store.secret;
  },
  set(value) {
    aria2Store.setSecret(value);
  }
});

const aria2proxy = computed({
  get() {
    return aria2Store.proxy;
  },
  set(value) {
    aria2Store.setProxy(value);
  }
});

onMounted(() => {
  console.info("设置窗口挂载完成");
  if (!hotKeyRegistered) {
    addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key.toUpperCase() === "S") {
        show.value = !show.value;
      }
    });
  }
  hotKeyRegistered = true;
});
</script>

<template>
  <div class="settings" v-show="show">
    <div class="group">Aria2</div>
    <div class="setting">
      <div class="field field-name">地址</div>
      <div class="field field-value">
        <input v-model="aria2url" class="fill" />
      </div>
    </div>
    <div class="setting">
      <div class="field field-name">secret</div>
      <div class="field field-value">
        <input v-model="aria2secret" class="fill" />
      </div>
    </div>
    <div class="setting">
      <div class="field field-name">代理服务器</div>
      <div class="field field-value">
        <input v-model="aria2proxy" class="fill" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings {
  /* 悬浮 */
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: 25%;
  height: 25%;

  /* 基础样式 */
  background-color: #0D0D0D;
  border: 2px solid #4D4D4D;
  border-radius: 7px;
  padding: 10px;

  /* 弹性布局容器 */
  display: flex;
  flex-direction: column;
}

.group {
  font-size: 1.5em;
}

.setting {
  display: flex;
  flex-direction: row;
  margin-top: 3px;
  margin-bottom: 3px;
}

.field {
  display: flex;
}

.field-name {
  width: 100px;
}

.field-value {
  flex: 1;
}

.fill {
  width: 100%;
}
</style>