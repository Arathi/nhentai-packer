import * as JsonRpc from "./JsonRpc";

export type ParamList = any[];
export type Aria2Request = JsonRpc.Request<ParamList>;
export type Aria2Response<R> = JsonRpc.Response<R, any>;

export interface Version {
  enabledFeatures: string[];
  version: string;
}

export interface SessionInfo {
  sessionId: string;
}

export type StringResponse = Aria2Response<string>;
export type VersionResponse = Aria2Response<Version>;
export type SessionInfoResponse = Aria2Response<SessionInfo>;

export type Aria2StatusValue = "active" | "waiting" | "paused" | "error" | "complete" | "removed";
export type Aria2EventType = "connected" | "taskCreated" | "progressChanged" | "versionReceived" | "sessionInfoReceived";
export const Aria2StatusKeys = ["gid", "status", "totalLength", "completedLength"];

export interface TaskCreatedDetail {
  gid: string;
  // TODO 需要和任务的其他唯一信息产生关联
}

export interface Aria2Status {
  gid: string;
  status: Aria2StatusValue;
  totalLength: number;
  completedLength: number;
}

export enum Aria2Events {
  /**
   * 连接到Aria2服务器
   *
   * websocket客户端创建成功后的open事件
   *
   * http客户端创建成功后直接触发
   */
  connected,

  /**
   * 下载任务创建完成
   *
   * aria2.addUri请求收到响应报文
   */
  taskCreated,

  /**
   * 下载任务开始执行
   *
   * websocket客户端收到aria2.onDownloadStart请求
   *
   * http客户端暂不实现
   */
  downloadStart,

  /**
   * 下载任务暂停执行
   *
   * websocket客户端收到aria2.onDownloadPause请求
   *
   * http客户端暂不实现
   */
  downloadPause,

  /**
   * 下载任务停止执行
   *
   * websocket客户端收到aria2.onDownloadStop请求
   *
   * http客户端暂不实现
   */
  downloadStop,

  /**
   * 下载任务进度发生变化
   *
   * 定时调用aria2.tellActive检查任务进度
   */
  progressChanged,

  /**
   * 下载任务执行完成
   *
   * websocket客户端收到aria2.onDownloadComplete请求
   *
   * http客户端暂不实现
   */
  downloadCompleted,

  /**
   * 下载任务执行出错
   *
   * websocket客户端收到aria2.onDownloadError请求
   *
   * http客户端暂不实现
   */
  downloadError,
}

export type TaskCreatedEvent = CustomEvent<TaskCreatedDetail>;
export type ProgressChangedEvent = CustomEvent<Aria2Status>;
export type VersionReceivedEvent = CustomEvent<Version>;

export interface TaskCreatedEventListener {
  (event: TaskCreatedEvent): void;
}

export interface ProgressChangedEventListener {
  (event: ProgressChangedEvent): void;
}

export interface VersionReceivedEventListener {
  (event: VersionReceivedEvent): void;
}

export interface CustomEventListener<D> {
  (event: CustomEvent<D>): void;
}
