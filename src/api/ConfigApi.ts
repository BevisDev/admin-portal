export const getAppConfig = async () => {
  const res = await fetch("/mock/app_config.json");
  if (!res.ok) {
    throw new Error("Failed to fetch app config");
  }
  return res.json();
};
