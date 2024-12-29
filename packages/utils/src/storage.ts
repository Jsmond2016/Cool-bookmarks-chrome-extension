export const getStorage = async (key: string): Promise<object[]> => {
  const jsonData = window.localStorage.getItem(key);
  const data = JSON.parse(jsonData as string);
  return data;
};

export const setStorage = async (key: string, data: object | object[]) => {
  window.localStorage.setItem(key, JSON.stringify(data));
};
