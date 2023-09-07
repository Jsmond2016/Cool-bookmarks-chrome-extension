
const useStorage = () => {

  const getStorage = async (key: string): Promise<Object[]> => {
    const jsonData = window.localStorage.getItem(key)
    const data = JSON.parse(jsonData);
    return data;
  }

  const setStorage = async (key: string, data: Object | Object[]) => {
    // let storage = await getStorage(key);
    // if (Array.isArray(data)) {
    //   storage = [...(storage || []), ...data]
    // } else {
    //   storage = [...(storage || []), data]
    // }
    window.localStorage.setItem(key, JSON.stringify(data));
  }


  return { getStorage, setStorage }
}

export { useStorage }