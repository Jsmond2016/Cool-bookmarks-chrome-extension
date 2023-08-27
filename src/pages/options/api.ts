import { all, keys, map, pipe } from "ramda";
import { useStorage } from "./storage";
import { sourceRender } from "./utils";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { IBookMark } from "./views/bookmarks";

dayjs.extend(isBetween);

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

const filterFnsMap: Partial<Record<keyof IFilters, Function>> = {
  bookmarkName: (item: IBookMark, v: string) => item.title.includes(v),
  categoryUrl: (item: IBookMark, v: string) => item.url.includes(v),
  belongToId: (item: IBookMark, v: string) => item.parentId.includes(v),
  collectDateRange: (item: IBookMark, [pre, after]: [number, number]) =>
    dayjs(item.dateAdded).isBetween(pre, after, null, "[]"),
};

type IFilters = {
  count?: number;
  bookmarkName?: string;
  categoryUrl?: string;
  belongToId?: string;
  collectDateRange?: [number, number];
};

/**
 * 按照条件查找最近的收藏的书签
 *
 * @param count number< 5000
 * @returns
 */
const queryBookmarksByRecent = async (filters: IFilters) => {
  const { count = 5000, ...restFilters } = filters;
  // const _count = Math.min(count, 1000);
  const bookmarks = await chrome.bookmarks.getRecent(count);

  const filterFns = Object.keys(restFilters).map((key) => ({
    key,
    fn: filterFnsMap[key],
  }));

  const filterBookMarks = bookmarks.filter((item) => {
    return filterFns.every(({ key, fn }) => fn(item, restFilters[key]));
  });

  return addCustomAttributes(filterBookMarks);
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

const getParentIds = (list: any[]) => {
  const idSet = new Set([]);
  const fn = (list) =>
    list.forEach((item) => {
      if (item.parentId) idSet.add(item.parentId);
      if (Array.isArray(item.children)) {
        fn(item.children);
      }
    });
  fn(list);
  idSet.delete('0')
  return [...idSet];
};

const getBookMarksByIds = async (idOrIdList: string[]) => {
  return await chrome.bookmarks.get(idOrIdList);
}


const getGroupList = async () => {
  const res = await getSubTree();
  const ids = getParentIds(res);
  const bookmarks = await getBookMarksByIds(ids);
  return bookmarks.map(({id, title}) => ({ id, title }))
}

// 没有获取 文件夹名字的 api，使用 getTree
// https://stackoverflow.com/questions/2812622/get-google-chromes-root-bookmarks-folder
const getSubTree = async () => {
  const res = await chrome.bookmarks.getTree();
  return res;
};


const logger = (type, info) => {
  const { setStorage } = useStorage();
  setStorage(`log-${type}`, info)
}

const removeBookmark = async (record: IBookMark) => {
  logger('delete-item', record)
  const res = await chrome.bookmarks.remove(record.id)
  return res;
}

const batchRemove = async (records: IBookMark[]) => {
  // const ids = records.map((item) => item.id);
  logger('delete-list', records)
  const removeFns = records.map(record => removeBookmark(record));
  const res = await Promise.all(removeFns)
  return res;
}

export {
  queryBookmarksByRecent,
  saveSection,
  querySectionNotes,
  updateBookmark,
  getSubTree,
  getBookMarksByIds,
  getGroupList,
  removeBookmark,
  batchRemove
};
