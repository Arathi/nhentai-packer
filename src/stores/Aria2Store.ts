import {defineStore} from "pinia";
import {GM_getValue, GM_setValue} from "$";

interface State {
  secret?: string;
  baseURL: string;
  proxy?: string;
}

export const useAria2Store = defineStore('aria2', {
  state: (): State => ({
    secret: GM_getValue("aria2.secret", undefined),
    baseURL: GM_getValue("aria2.baseURL", "http://127.0.0.1:6800/jsonrpc"),
    proxy: GM_getValue("aria2.proxy", undefined),
  }),
  getters: {},
  actions: {
    setSecret(value: string) {
      GM_setValue("aria2.secret", value);
      this.secret = value;
    },
    setBaseURL(value: string) {
      GM_setValue("aria2.baseURL", value);
      this.baseURL = value;
    },
    setProxy(value: string) {
      GM_setValue("aria2.proxy", value);
      this.proxy = value;
    }
  },
});