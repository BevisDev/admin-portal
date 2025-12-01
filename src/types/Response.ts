export interface Response<T> {
  isSuccess: boolean;
  data: T;
  responseAt: string;
}
