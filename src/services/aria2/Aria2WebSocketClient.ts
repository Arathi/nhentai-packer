import {Aria2Client} from "./Aria2Client";
import {Message as JsonRpcMessage} from "./JsonRpc";
import {Aria2Request, Aria2Response} from "./types";

export class Aria2WebSocketClient extends Aria2Client {
  _websocket?: WebSocket;
  requests: Map<number, Aria2Request>;
  responses: Map<number, Aria2Response<any>>;

  constructor(
    secret?: string,
    baseURL: string = "http://127.0.0.1:6800/jsonrpc",
  ) {
    super(
      secret,
      baseURL
    );
    this.requests = new Map();
    this.responses = new Map();
  }

  get websocket() {
    if (this._websocket != undefined) {
      return this._websocket;
    }
    console.debug(`创建WebSocket连接：${this.baseURL}`);
    this._websocket = new WebSocket(this.baseURL);
    this._websocket.onopen = (event) => this.onOpen(event);
    this._websocket.onmessage = (event) => this.onMessage(event);
    this._websocket.onerror = (event) => this.onError(event);
    this._websocket.onclose = (event) => this.onClose(event);
    return this._websocket;
  }

  onOpen(event: Event) {
    console.debug(`WebSocket连接成功：`, event);
  }

  onMessage(event: MessageEvent) {
    console.debug("接收到报文：", event);
    console.debug(`数据如下：`, event.data);
    const message = event.data as JsonRpcMessage;
    if (message.jsonrpc == "2.0") {
      if (message.method != undefined) {
        // 请求报文，回调
        const callbackRequest = event.data as Aria2Request;
        console.info("接收到Aria2回调：", callbackRequest);
        // TODO 处理回调
        return;
      }
      else if (message.result != undefined || message.error != undefined) {
        // 响应报文
        const id = message.id;
        const response = event.data as Aria2Response<any>;
        console.info(`接收到响应报文（${id}）：`, response);
        if (id != undefined) {
          this.responses.set(id as number, response);
          return;
        }
      }
    }
    console.warn("接收到无效的报文");
  }

  onError(event: Event) {
    console.debug("WebSocket通信发生错误：", event);
  }

  onClose(event: CloseEvent) {
    console.debug(`WebSocket连接关闭：状态码：${event.code}，原因：${event.reason}`);
  }

  async waitForResponse<R>(id?: number, interval = 1000, timeout = 30000): Promise<R | null> {
    if (id == undefined) return null;
    const startAt = Date.now();
    return new Promise<R | null>(resolve => {
      const timer = setInterval(() => {
        const duration = Date.now() - startAt;
        if (this.responses.has(id)) {
          const response = this.responses.get(id);
          clearInterval(timer);
          console.debug(`已收到请求${id}的响应报文，耗时${duration}ms，报文如下：`, response);
          resolve(response as R | null);
        }
        if (duration > timeout) {
          console.warn(`等待请求${id}的响应报文超时`);
        }
      }, interval);
    });
  }

  async sendRequest<R>(request: Aria2Request): Promise<R | null> {
    const json = JSON.stringify(request);
    console.debug(`通过WebSocket发送报文：${json}`);
    this.websocket.send(json);
    if (request.id != undefined) {
      const id = request.id as number;
      this.requests.set(id, request);
      return this.waitForResponse(id);
    }
    else {
      console.warn("请求报文id未设置，无法到获取响应报文");
      return null;
    }
  }
}