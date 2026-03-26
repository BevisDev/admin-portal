export interface Response<T> {
  success: boolean;
  data: T;
  responseAt: string;
}
