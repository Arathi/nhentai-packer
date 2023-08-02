type JsonRpcVersion = '1.0' | '2.0';
type JsonRpcId = number | string;

export interface Message {
  jsonrpc?: JsonRpcVersion;
  id?: JsonRpcId;
  method?: string;
  result?: any;
  error?: any;
}

export interface Request<P> {
  jsonrpc: JsonRpcVersion;
  method: string;
  params?: P;
  id?: JsonRpcId;
}

export interface Response<R, D> {
  jsonrpc: JsonRpcVersion;
  result?: R;
  error?: Error<D>;
  id?: JsonRpcId;
}

export interface Error<D> {
  code: number;
  message: string;
  data?: D;
}
