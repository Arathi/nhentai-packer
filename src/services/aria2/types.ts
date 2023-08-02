import * as JsonRpc from "./JsonRpc";

export type ParamList = any[];
export type Aria2Request = JsonRpc.Request<ParamList>;
export type Aria2Response<R> = JsonRpc.Response<R, any>;

export interface Version {
  enabledFeatures: string[];
  version: string;
}

export type StringResponse = Aria2Response<string>;
export type VersionResponse = Aria2Response<Version>;
