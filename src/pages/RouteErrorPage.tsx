import { useRouteError } from "react-router-dom";
import ErrorPage from "./ErrorPage";

const RouteErrorPage = () => {
  const error = useRouteError();
  console.error("Route error:", error);
  return ErrorPage();
};

export default RouteErrorPage;
