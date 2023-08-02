import {Aria2Client} from "./Aria2Client";
import Axios, {AxiosInstance} from "axios";
import {Aria2Request, Aria2Response} from "./types";

export class Aria2HttpClient extends Aria2Client {
  axios: AxiosInstance;

  constructor(
    secret?: string,
    baseURL: string = "http://127.0.0.1:6800/jsonrpc",
    timeout: number = 5000,
  ) {
    super(secret, baseURL);
    this.axios = Axios.create({
      timeout: timeout,
    });
  }

  async sendRequest<R>(request: Aria2Request): Promise<R|null> {
    const axiosResp = await this.axios.post<R>(this.baseURL, request);
    if (axiosResp.status !== 200) {
      console.warn(`调用Aria2 JSON-RPC出错，状态码：${axiosResp.status}(${axiosResp.statusText})，请求报文如下：`, request);
      return null;
    }
    return axiosResp.data;
  }
}