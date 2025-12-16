import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
// import type { AxiosError } from "axios";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // onError: (error) => {
    //   const axiosErr = error as AxiosError<ApiError>;
    //   const status = axiosErr.response?.status;
    //   const code = axiosErr.response?.data?.code;
    //   if (status === 503 || code === "MAINTENANCE") {
    //     useAppState.getState().setMaintenance();
    //   }
    // },
  }),

  mutationCache: new MutationCache({
    // onError: (error) => {
    //   const status = error?.response?.status;
    //   const code = error?.response?.data?.code;
    //   if (status === 503 || code === "MAINTENANCE") {
    //     //   useAppState.getState().setMaintenance();
    //   }
    // },
  }),

  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
