import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import { buildUrl, type Request } from "./useFetch";

export const GETQuery = <TReq, TRes>(req: Request<TReq>): Promise<TRes> => {
  return useFetchQuery<TReq, TRes>("GET", req);
};

export const POSTQuery = <TReq, TRes>(req: Request<TReq>): Promise<TRes> => {
  return useFetchQuery<TReq, TRes>("POST", req);
};

export const PUTQuery = <TReq, TRes>(req: Request<TReq>): Promise<TRes> => {
  return useFetchQuery<TReq, TRes>("PUT", req);
};

export const PATCHQuery = <TReq, TRes>(req: Request<TReq>): Promise<TRes> => {
  return useFetchQuery<TReq, TRes>("PATCH", req);
};

export const DELETEQuery = <TReq, TRes>(req: Request<TReq>): Promise<TRes> => {
  return useFetchQuery<TReq, TRes>("DELETE", req);
};

/**
 * React hook to fetch data with Axios combine with ReactQuery
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
export const useFetchQuery = async <TReq, TRes>(
  method: string,
  { url, headers, queryParams, pathParams, body }: Request<TReq>
): Promise<TRes> => {
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

    const res = await axios(config);
    return res.data;
  } catch (error) {
    console.error("API ERROR:", error);

    // catch error from axios
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;

      // error timeout
      if (err.code === "ECONNABORTED") {
        throw {
          code: 408,
          message: "Request timeout",
        };
      }

      // error server has response
      if (typeof err.response?.data === "object") {
        throw {
          code: err.response?.status ?? 500,
          message: err.message ?? "Server error",
        };
      }

      // server response plain/text or nobody
      throw {
        code: err.response?.status ?? 500,
        message: err.message,
      };
    }

    // others error
    if (error instanceof Error) {
      throw {
        code: 500,
        message: error.message,
      };
    }

    // ---- Unknown ----
    throw {
      code: 520,
      message: "Unexpected error",
    };
  }
};
