import Axios, {AxiosInstance} from "axios";
import {unsafeWindow} from "$";
import {ITask} from "../../models/Task";
import {ITaskGroup} from "../../models/TaskGroup";
import {Gallery, NApp} from "./types";

export class NHentaiCrawler {
  axios: AxiosInstance;

  constructor(timeout = 5000) {
    this.axios = Axios.create({
      timeout: timeout
    });
  }

  generateTaskGroup(): ITaskGroup | null {
    // @ts-ignore
    const _gallery: any = unsafeWindow._gallery;
    // @ts-ignore
    const _nApp: any = unsafeWindow._n_app;

    if (_gallery != undefined && _nApp != undefined) {
      const gallery = _gallery as Gallery;
      console.info("获取到gallery，信息如下：", gallery);
      const nApp = _nApp as NApp;
      console.info("获取到nApp，信息如下：", nApp);
      const mediaServer = nApp.options.media_server;
      console.info("获取到mediaServer为", mediaServer);
      const cdn = `i${mediaServer}`;

      const groupIdStr = gallery.id;
      const groupId = Number(groupIdStr);

      let name = gallery.title.japanese;
      if (name == undefined) gallery.title.english;
      if (name == undefined) {
        console.warn("无法获取作品的名称，使用ID作为名称");
        name = `${gallery.id}`;
      }

      const referer = unsafeWindow.location.href;
      const fileNameLength = Math.floor(Math.log10(gallery.num_pages)) + 1;
      const mediaId = gallery.media_id;

      let tasks: ITask[] = [];
      gallery.images.pages.forEach((p, index) => {
        const pageNum = index + 1;
        const taskId = groupId * 1000000 + pageNum;
        const pageNumStr = `${pageNum}`;
        let format: string = "";
        switch (p.t) {
          case "j": {
            format = "jpg";
            break;
          }
          default: {
            console.warn(`未知的文件格式：${p.t}`);
            format = "raw";
            break;
          }
        }
        const zeroAmount = fileNameLength - pageNumStr.length;
        const fileName = `${'0'.repeat(zeroAmount)}${pageNumStr}.${format}`;

        const url = `https://${cdn}.nhentai.net/galleries/${mediaId}/${pageNum}.${format}`;

        const task = {
          id: taskId,
          fileName: fileName,
          url: url
        } as ITask;
        tasks.push(task);
      });

      return {
        id: groupIdStr,
        name: name,
        referer: referer,
        tasks: tasks,
      } as ITaskGroup;
    }

    return null;
  }
}