import {
  Aria2EventType,
  Aria2Request,
  Aria2Status,
  Aria2StatusKeys, CustomEventListener,
  ParamList,
  ProgressChangedEventListener,
  SessionInfoResponse,
  StringResponse,
  TaskCreatedEventListener,
  Version, VersionReceivedEvent, VersionReceivedEventListener,
  VersionResponse
} from './types';

export abstract class Aria2Client {
  secret?: string;
  baseURL: string;
  sequence: number;
  eventTarget: EventTarget;

  protected constructor(
    secret?: string,
    baseURL: string = "http://127.0.0.1:6800/jsonrpc",
  ) {
    this.secret = secret;
    this.baseURL = baseURL;
    this.sequence = 0;
    this.eventTarget = new EventTarget();
  }

  get token(): string | null {
    if (this.secret == undefined || this.secret.length == 0) {
      return null;
    }
    return `token:${this.secret}`;
  }

  get nextId(): number {
    return ++this.sequence;
  }

  // region 构建请求报文
  /**
   * 构建请求
   */
  buildRequest(method: string, params: ParamList[] = []): Aria2Request {
    let finalParams: ParamList = [];
    let token = this.token;
    if (token != null) {
      finalParams.push(token);
    }
    finalParams.push(...params);
    return {
      jsonrpc: "2.0",
      method: method,
      params: finalParams,
      id: this.nextId,
    } as Aria2Request;
  }

  // addUri
  buildAddUriRequest(uris: string[], options?: any, position?: number) {
    let params: ParamList = [uris];
    if (options != undefined) {
      params.push(options);
    }
    if (position != undefined) {
      if (options == undefined) {
        params.push({});
      }
      params.push(position);
    }
    return this.buildRequest("aria2.addUri", params);
  }

  // remove, forceRemove
  // pause, forcePause
  // unpause
  // getUris, getFiles, getServers
  // getOption
  buildGidRequest(method: string, gid: string) {
    let params: ParamList = [gid];
    return this.buildRequest(method, params);
  }

  // 获取状态
  // tellStatus (需要提供gid)
  // tellActive (没有gid)
  buildTellStatusRequest(method: string, gid?: string, keys?: string[]) {
    let params: ParamList = [];
    if (gid != undefined) {
      params.push(gid);
    }
    if (keys != undefined) {
      params.push(keys);
    }
    return this.buildRequest(method, params);
  }

  // 获取分页状态
  // tellWaiting
  // tellStopped
  buildPagedStatusRequest(method: string, offset: number, num: number, keys?: string[]) {
    let params: ParamList = [offset, num];
    if (keys != undefined) {
      params.push(keys);
    }
    return this.buildRequest(method, params);
  }
  // endregion

  // region 调用
  abstract connect(): void;
  abstract callAsync<R>(request: Aria2Request): Promise<R|null>;
  abstract call<R>(request: Aria2Request): void;
  // endregion

  // region 同步方法
  addUri(uris: string[], options?: any, position?: number) {
    const request = this.buildAddUriRequest(uris, options, position);
    this.call<string>(request);
  }

  tellActive(keys: string[] = Aria2StatusKeys) {
    const request = this.buildTellStatusRequest("aria2.tellActive", undefined, keys);
    this.call<Aria2Status[]>(request);
  }

  getVersion() {
    const request = this.buildRequest("aria2.getVersion");
    this.call<VersionResponse>(request);
  }

  getSessionInfo() {
    const request = this.buildRequest("aria2.getSessionInfo");
    this.call<SessionInfoResponse>(request);
  }
  // endregion

  // region 异步方法
  // endregion

  // region 事件相关
  /**
   * 注册事件监听
   * @param type
   * @param callback
   * @param options
   */
  on(type: Aria2EventType, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void {
    this.eventTarget.addEventListener(type, callback, options);
  }

  /**
   * 监听连接成功事件
   * @param callback
   */
  onConnected(callback: EventListener | null) {
    this.on("connected", callback);
  }

  /**
   * 监听任务创建完成事件
   * @param callback
   */
  onTaskCreated(callback: TaskCreatedEventListener | null) {
    this.on("taskCreated", callback as EventListener | null);
  }

  /**
   * 监听进度变化事件
   * @param callback
   */
  onProgressChanged(callback: ProgressChangedEventListener | null) {
    this.on("progressChanged", callback as EventListener | null);
  }

  onVersionReceived(callback: VersionReceivedEventListener | null) {
    this.on("versionReceived", callback as EventListener | null);
  }

  onSessionInfoReceived(callback: CustomEventListener<string> | null) {
    this.on("sessionInfoReceived", callback as EventListener | null);
  }

  /**
   * 分发事件
   * @param event
   */
  emit(event: Event): boolean {
    return this.eventTarget.dispatchEvent(event);
  }
  // endregion
}