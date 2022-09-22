export interface ErrorRequestServiceI<T = any | unknown> {
  name: string;
  options: any;
  statusCode: number;
  error: T;
  message: string;
}
