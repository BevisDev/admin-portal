import { RouterProvider } from "react-router-dom";
import { getRouter } from "./router";
import { useMasterDataQuery } from "./api/master-data";
import Loading from "./components/loading/Loading";
import { useMasterDataStore } from "./store/useMasterDataStore";
import { useEffect } from "react";

function App() {
  const { data, isLoading } = useMasterDataQuery();
  const setData = useMasterDataStore((s) => s.setData);

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
