export const getLocal = <T>(key: string): T | null => {
  try {
    const json = localStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch {
    return null;
  }
};

export const setLocal = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocal = (key: string): void => {
  localStorage.removeItem(key);
};

export const clearLocal = (): void => {
  localStorage.clear();
};
