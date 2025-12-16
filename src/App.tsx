import { RouterProvider } from "react-router-dom";
import { getRouter } from "./router";
import { useConstantsQuery } from "./api/constants";
import Loading from "./components/loading/Loading";
import { useConstantStore } from "./store/useConstantStore";
import { useEffect } from "react";

function App() {
  const { data, isLoading } = useConstantsQuery();
  const setData = useConstantStore((s) => s.setData);

  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data, setData]);

  if (isLoading) {
    return <Loading />;
  }

  return <RouterProvider router={getRouter()} />;
}

export default App;
