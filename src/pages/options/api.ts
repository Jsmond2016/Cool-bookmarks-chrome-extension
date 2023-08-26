import { useStorage } from "./storage";
import { sourceRender } from "./utils";

const customAttributes = {
  source: "",
  description: "",
  date: "",
};
const addCustomAttributes = (list = []) =>
  list.map((item) => ({
    ...item,
    ...customAttributes,
    date: new Date(item.dateAdded).toLocaleDateString(),
    bookmarkName: item.title,
    source: sourceRender(item.url),
  }));

  /**
   * 在 片段 模块找到 片段笔记；
   * 
   * @returns 
   */
const querySectionNotes = async () => {
  const { getStorage } = useStorage();
  const data = await getStorage("section");
  return data;
};

const saveSection = async ({ data }) => {
  const { setStorage } = useStorage();
  await setStorage("section", data);
  return "success";
};

/**
 * 按照数量查找最近的收藏的书签
 *
 * @param count number< 500
 * @returns
 */
const queryBookmarksByRecent = async (count: number) => {
  const _count = Math.min(count, 500);
  const bookmarks = await chrome.bookmarks.getRecent(_count);
  return addCustomAttributes(bookmarks);
};

export type IBookmarkParam = {
  id: string;
  changes: {
    title: string;
    url: string;
  };
};

const updateBookmark = async (params: IBookmarkParam) => {
  const { id, changes } = params;
  const response = await chrome.bookmarks.update(id, changes);
  return response;
};

export {
  queryBookmarksByRecent,
  saveSection,
  querySectionNotes,
  updateBookmark,
};
