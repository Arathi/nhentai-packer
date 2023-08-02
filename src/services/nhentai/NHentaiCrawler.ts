import Axios, {AxiosInstance} from "axios";
import {unsafeWindow} from "$";
import {ITask, TaskStatus} from "../../models/Task";
import {TaskGroup} from "../../models/TaskGroup";
import {Gallery} from "./types";

export class NHentaiCrawler {
  axios: AxiosInstance;

  constructor(timeout = 5000) {
    this.axios = Axios.create({
      timeout: timeout
    });
  }

  generateTasks(): TaskGroup | null {
    // @ts-ignore
    const _gallery: any = unsafeWindow._gallery;

    if (_gallery != undefined) {
      const gallery = _gallery as Gallery;
      console.info("获取到gallery，信息如下：", gallery);
      let name = gallery.title.japanese;
      if (name == undefined) gallery.title.english;
      if (name == undefined) {
        console.warn("无法获取作品的名称，使用ID作为名称");
        name = `${gallery.id}`;
      }

      const referer = unsafeWindow.location.href;

      const fileNameLength = Math.floor(Math.log10(gallery.num_pages)) + 1;
      const mediaId = gallery.media_id;
      const cdn = "i7";

      let tasks = gallery.images.pages.map((p, index) => {
        const pageNum = `${index + 1}`;
        let format: string = "";
        switch (p.t) {
          case "j": {
            format = "jpg";
            break;
          }
          default: {
            console.warn("未知的文件格式！");
            format = "raw";
            break;
          }
        }
        const zeroAmount = fileNameLength - pageNum.length;
        const fileName = `${'0'.repeat(zeroAmount)}${pageNum}.${format}`;

        // https://i7.nhentai.net/galleries/2478484/1.jpg
        const url = `https://${cdn}.nhentai.net/galleries/${mediaId}/${index+1}.${format}`
        const status = TaskStatus.Pending;
        const progress = 0;

        return {
          fileName,
          url,
          status,
          progress
        } as ITask;
      });

      return new TaskGroup(name, referer, tasks);
    }
    return null;
  }
}