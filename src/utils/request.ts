import { request as req } from 'umi';

type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';

interface Cancel {
  message: string;
}

interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  throwIfRequested(): void;
}

interface ResponseError<D = any> extends Error {
  name: string;
  data: D;
  response: Response;
  request: {
    url: string;
    options: RequestOptionsInit;
  };
  type: string;
}

interface RequestOptionsInit extends RequestInit {
  charset?: 'utf8' | 'gbk';
  requestType?: 'json' | 'form';
  data?: any;
  params?: object | URLSearchParams;
  paramsSerializer?: (params: object) => string;
  responseType?: ResponseType;
  useCache?: boolean;
  ttl?: number;
  timeout?: number;
  errorHandler?: (error: ResponseError) => void;
  prefix?: string;
  suffix?: string;
  throwErrIfParseFail?: boolean;
  parseResponse?: boolean;
  cancelToken?: CancelToken;
  getResponse?: boolean;
  validateCache?: (url: string, options: RequestOptionsInit) => boolean;
  __umiRequestCoreType__?: string;
  [key: string]: any;
}

interface RequestOptionsWithResponse extends RequestOptionsInit {
  getResponse?: true;
}

type Options = RequestOptionsWithResponse & { skipErrorHandler?: boolean };

export type RequestOptions<ExtraOptions = {}> = Options & Partial<ExtraOptions>;

export default function request<T>(url: any, options: RequestOptions) {
  return req(url, options) as unknown as Promise<T>;
}
