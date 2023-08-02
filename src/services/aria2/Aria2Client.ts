import {
  Aria2Request,
  ParamList, StringResponse, VersionResponse
} from './types';

export abstract class Aria2Client {
  secret?: string;
  baseURL: string;
  sequence: number;

  protected constructor(
    secret?: string,
    baseURL: string = "http://127.0.0.1:6800/jsonrpc",
  ) {
    this.secret = secret;
    this.baseURL = baseURL;
    this.sequence = 0;
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

  abstract sendRequest<R>(request: Aria2Request): Promise<R|null>;

  async addUri(uris: string[], options?: any, position?: number) {
    let params: ParamList = [];
    const request = this.buildRequest("aria2.addUri", params);
    return await this.sendRequest<StringResponse>(request);
  }

  async getVersion() {
    const request = this.buildRequest("aria2.getVersion");
    return await this.sendRequest<VersionResponse>(request);
  }
}