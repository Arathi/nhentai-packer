import {Aria2Client} from "./Aria2Client";
import {Message as JsonRpcMessage} from "./JsonRpc";
import {
  Aria2EventType,
  Aria2Request,
  Aria2Response,
  Aria2Status,
  TaskCreatedDetail,
  TaskCreatedEvent,
  Version,
  GidParam
} from "./types";

export class Aria2WebSocketClient extends Aria2Client {
  _websocket?: WebSocket;
  requests: Map<number, Aria2Request>;
  responses: Map<number, Aria2Response<any>>;

  constructor(
    secret?: string,
    baseURL: string = "ws://127.0.0.1:6800/jsonrpc",
    connect: boolean = false,
  ) {
    super(
      secret,
      baseURL
    );
    this.requests = new Map();
    this.responses = new Map();
    if (connect) {
      this.connect();
    }
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
    this.emit(new CustomEvent("connected"));
  }

  onMessage(event: MessageEvent) {
    console.debug("接收到报文：", event);
    const json: string = event.data as string;
    // TODO 检测json是否为空

    const message = JSON.parse(json) as JsonRpcMessage;
    console.debug(`数据如下：`, message);
    if (message.jsonrpc == "2.0") {
      this.onJsonRpcMessage(event, message);
    }
    else {
      console.warn("接收到无效的报文");
    }
  }

  onError(event: Event) {
    console.debug("WebSocket通信发生错误：", event);
  }

  onClose(event: CloseEvent) {
    console.debug(`WebSocket连接关闭：状态码：${event.code}，原因：${event.reason}`);
  }

  onJsonRpcMessage(event: MessageEvent, message: JsonRpcMessage) {
    if (message.method != undefined) {
      // 请求报文，回调
      const callback = message as Aria2Request;
      this.onCallbackMessage(event, callback);
      return;
    }
    else if (message.result != undefined || message.error != undefined) {
      // 响应报文
      const id = message.id;
      if (id != undefined) {
        // 根据id获取请求报文
        const request = this.requests.get(id as number);
        if (request != undefined) {
          this.onResponseMessage(event, request, message);
          return;
        }
        else {
          console.warn(`找不到id为${id}的请求报文`);
        }
      }
    }
    console.warn("无效的JSON-RPC报文：", message);
  }

  onCallbackMessage(event: MessageEvent, request: Aria2Request) {
    console.info("接收到Aria2回调：", request);
    switch (request.method) {
      case "aria2.onDownloadComplete": {
        const gps = request.params as GidParam[];
        gps.forEach((gp) => {
          this.emit(this.buildEvent("progressChanged", {
            gid: gp.gid,
            totalLength: 0,
            completedLength: 0,
            status: "complete"
          } as Aria2Status));
        });
      }
    }
    // TODO 暂不处理其他回调报文
  }

  buildEvent<D>(type: Aria2EventType, detail: D) {
    return new CustomEvent(type, {
      detail: detail,
    });
  }

  onResponseMessage(event: MessageEvent, request: Aria2Request, message: JsonRpcMessage) {
    switch (request.method) {
      // 更新任务ID
      case "aria2.addUri": {
        const resp = message as Aria2Response<string>;
        const gid = resp.result;
        if (gid != undefined) {
          this.emit(this.buildEvent("taskCreated", {
            gid: gid,
            taskId: resp.id,
          }));
        }
        break;
      }

      // 更新任务进度
      case "aria2.tellActive": {
        // console.warn("暂不处理aria2.tellActive");
        const resp = message as Aria2Response<Aria2Status[]>;
        const statusList = resp.result;
        if (statusList != undefined) {
          statusList.forEach((status: Aria2Status) => {
            this.emit(this.buildEvent("progressChanged", status));
          });
        }
        break;
      }

      // 版本信息
      case "aria2.getVersion": {
        const resp = message as Aria2Response<Version>;
        const versionResult = resp.result;
        if (versionResult != undefined) {
          this.emit(this.buildEvent("versionReceived", versionResult));
        }
        break;
      }

      // 会话信息
      case "aria2.getSessionInfo": {
        const resp = message as Aria2Response<string>;
        const sessionId = resp.result;
        if (sessionId != undefined) {
          this.emit(this.buildEvent("sessionInfoReceived", sessionId));
        }
        break;
      }
    }
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

  connect() {
    console.info("正在创建WebSocket连接...");
    const ws = this.websocket;
  }

  call<R>(request: Aria2Request): void {
    const json = JSON.stringify(request);
    console.debug(`通过WebSocket发送报文：${json}`);
    this.websocket.send(json);
    if (request.id != undefined) {
      const id = request.id as number;
      this.requests.set(id, request);
    }
    else {
      console.warn("请求报文id未设置，无法到获取响应报文");
    }
  }

  async callAsync<R>(request: Aria2Request): Promise<R | null> {
    const json = JSON.stringify(request);
    console.debug(`通过WebSocket发送报文：${json}`);
    this.websocket.send(json);
    if (request.id != undefined) {
      const id = request.id as number;
      this.requests.set(id, request);
      return this.waitForResponse(id); // 就多了这句
    }
    else {
      console.warn("请求报文id未设置，无法到获取响应报文");
      return null;
    }
  }
}