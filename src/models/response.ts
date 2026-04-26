/**
 * Generic base response wrapper for all API responses.
 *
 * @template T - The type of the response payload.
 *
 * @property rid - Unique request identifier for tracing/debugging.
 * @property success - Indicates whether the request was successful.
 * @property data - The actual response payload of type `T`.
 * @property response_at - date time indicating when the response was generated.
 */
export interface Response<T> {
  rid: string;
  success: boolean;
  data?: T;
  response_at: string;
  code: string;
  message: string;
  error?: ErrResponse;
}

export interface ErrResponse {
  code: string;
  message: string;
}
