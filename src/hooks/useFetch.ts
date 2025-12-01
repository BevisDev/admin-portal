import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";

export interface Request<T> {
  url: string;
  headers?: Record<string, string>;
  body?: T;
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number | boolean>;
}

interface Response<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface Error {
  code: number;
  message: string;
}

export const GET = <TReq, TRes>(req: Request<TReq>): Response<TRes> => {
  return useFetch<TReq, TRes>("GET", req);
};

export const POST = <TReq, TRes>(req: Request<TReq>): Response<TRes> => {
  return useFetch<TReq, TRes>("POST", req);
};

/**
 * React hook to fetch data with Axios.
 *
 * @param {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} params.method - HTTP method.
 * @param {Object} params
 * @param {string} params.url - API endpoint.
 * @param {Record<string, string>} [params.headers] - Optional headers.
 * @param {object|string|FormData} [params.body] - Request payload.
 *
 * @returns {{
 *   data: any,
 *   error: { code: number, message: string } | null,
 *   isLoading: boolean
 * }} Fetch result.
 */
export const useFetch = <TReq, TRes>(
  method: string,
  { url, headers, queryParams, pathParams, body }: Request<TReq>
): Response<TRes> => {
  const [response, setResponse] = useState<Response<TRes>>({
    data: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // build url
        const newUrl = buildUrl(url, pathParams);

        // merge header
        const newHeader =
          body instanceof FormData
            ? { ...headers }
            : { "Content-Type": "application/json", ...headers };

        // build config
        const config: AxiosRequestConfig = {
          url: newUrl,
          method,
          params: queryParams,
          headers: newHeader,
          data: body,
          // timeout: toMilliseconds(AppConfig.apiTimeout, "seconds"),
        };

        const response = await axios<TRes>(config);

        setResponse({
          data: response.data,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        console.error("API ERROR:", error);

        // catch error from axios
        if (axios.isAxiosError(error)) {
          const err = error as AxiosError;

          // error timeout
          if (err.code === "ECONNABORTED") {
            setResponse({
              data: null,
              error: {
                code: 408,
                message: err.message,
              },
              isLoading: false,
            });
            return;
          }

          // error server has response
          if (typeof err.response?.data === "object") {
            const serverError = err.response.data as Response<TRes>;
            if (serverError) {
              setResponse(serverError);
              return;
            }

            // server response plain/text or nobody
            setResponse({
              data: null,
              error: {
                code: err.response.status,
                message: err.message ?? "Server Error",
              },
              isLoading: false,
            });
            return;
          }
        }

        // others error
        if (error instanceof Error) {
          setResponse({
            data: null,
            error: {
              code: 500,
              message: error.message,
            },
            isLoading: false,
          });
          return;
        }

        // ---- Unknown ----
        setResponse({
          data: null,
          error: {
            code: 520,
            message: "Unexpected error",
          },
          isLoading: false,
        });
        return;
      }
    };

    fetchData();
  }, [url, method, body, headers, queryParams, pathParams]);

  return response;
};

export const buildUrl = (
  url: string,
  pathParams?: Record<string, string | number>
): string => {
  if (!pathParams) return url;

  let result = url;
  for (const key in pathParams) {
    const value = pathParams[key];
    result = result.replace(`:${key}`, String(value));
  }

  return result;
};
