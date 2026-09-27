export type IHttpResponse<T = any> = {
  ok?: boolean;
  data: T;
  headers: Record<string, any>;
  total?: number;
};

export type IViewConfig = {
  id: string;
  [key: string]: any;
};
