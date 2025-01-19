import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { getCustomTitle, getStorage, setStorage, sourceRender } from '@extension/utils';
import type { EditBookmark, IBookmarkParam } from '@extension/types';

dayjs.extend(isBetween);

const customAttributes = {
  source: '',
  date: '',
};
const addCustomAttributes = list =>
  (list || []).map(item => ({
    ...item,
    ...customAttributes,
    date: new Date(item.dateAdded).toLocaleDateString(),
    sourceTitle: item.title,
    source: sourceRender(item.url),
  }));

/**
 * 在 片段 模块找到 片段笔记；
 *
 * @returns
 */
export const querySectionNotes = async () => {
  const data = await getStorage('section');
  return data;
};

export const saveSection = async ({ data }) => {
  await setStorage('section', data);
  return 'success';
};

type IFilters = {
  count?: number;
  bookmarkName?: string;
  categoryUrl?: string;
  belongToId?: string;
  collectDateRange?: [number, number];
};

const filterFnsMap = {
  bookmarkName: (item: EditBookmark, v: string) => item.title.includes(v),
  priority: (item: EditBookmark, v: number) => item.priority === v,
  categoryUrl: (item: EditBookmark, v: string) => item.url.includes(v),
  belongToId: (item: EditBookmark, v: string) => item.parentId.includes(v),
  collectDateRange: (item: EditBookmark, [pre, after]: [number, number]) =>
    dayjs(item.dateAdded).isBetween(pre, after, null, '[]'),
};
/**
 * 按照条件查找最近的收藏的书签
 *
 * @param count number< 5000
 * @returns
 */
export const queryBookmarksByRecent = async (filters: IFilters) => {
  const { count = 5000, ...restFilters } = filters;
  // const _count = Math.min(count, 1000);
  const bookmarks = await chrome.bookmarks.getRecent(count);
  const newBookmarks = bookmarks.map(v => ({ ...v, ...getCustomTitle(v.title) }));

  const filterFns = Object.keys(restFilters).map(key => ({
    key,
    fn: filterFnsMap[key],
  }));

  const filterBookMarks = newBookmarks.filter(item => {
    return filterFns.every(({ key, fn }) => fn(item, restFilters[key]));
  });

  return addCustomAttributes(filterBookMarks);
};

export const updateBookmark = async (params: IBookmarkParam) => {
  const { id, changes } = params;
  const response = await chrome.bookmarks.update(id, changes);
  return response;
};

const getParentIds = (list: chrome.bookmarks.BookmarkTreeNode[]) => {
  const idSet = new Set<string>([]);
  const fn = (list: chrome.bookmarks.BookmarkTreeNode[]) =>
    (list || []).forEach(item => {
      if (item.parentId) idSet.add(item.parentId);
      if (Array.isArray(item.children)) {
        fn(item.children);
      }
    });
  fn(list);
  idSet.delete('0');
  return [...idSet];
};

export const getBookMarksByIds = async (idOrIdList: string[]) => {
  return await chrome.bookmarks.get(idOrIdList);
};

export const getGroupList = async () => {
  const res = await getSubTree();
  const ids = getParentIds(res);
  const bookmarks = await getBookMarksByIds(ids);
  return bookmarks.map(({ id, title }) => ({ id, title }));
};

// 没有获取 文件夹名字的 api，使用 getTree
// https://stackoverflow.com/questions/2812622/get-google-chromes-root-bookmarks-folder
export const getSubTree = async () => {
  const res = await chrome.bookmarks.getTree();
  return res;
};

const logger = (type, info) => {
  const nowTime = new Date().getTime();
  const deleteDate = new Date(nowTime).toLocaleDateString();
  const deletTimeStr = new Date(nowTime).toLocaleTimeString();
  setStorage(`log-${type}-${nowTime}`, { deleteDate: `${deleteDate} ${deletTimeStr}`, list: info });
};

export const deletBookmarkById = async (id: string) => {
  const res = await chrome.bookmarks.remove(id);
  return res;
};

export const moveBookmark = async (id: string, destinationId: string) => {
  return await chrome.bookmarks.move(id, { parentId: destinationId });
};

export const moveBookmarks = async (records: { id: string; destinationId: string }[]) => {
  const moveFns = records.map(record => moveBookmark(record.id, record.destinationId));
  const res = await Promise.allSettled([moveFns]);
  return res;
};

export const removeBookmark = async (record: EditBookmark) => {
  logger('delete-item', record);
  const res = await deletBookmarkById(record.id);
  return res;
};

export const batchRemove = async (records: EditBookmark[]) => {
  logger('delete-list', records);
  const removeFns = records.map(record => deletBookmarkById(record.id));
  const res = await Promise.all(removeFns);
  return res;
};

export const batchMove = async (bookmarks: (IBookmarkParam & { parentId: string })[]) => {
  const moveFns = bookmarks.map(b => moveBookmark(b.id, b.parentId));
  const updateFns = bookmarks.map(b => updateBookmark(b));
  const res = await Promise.allSettled([moveFns, updateFns]);
  return res;
};

export const createBookmark = async (params: IBookmarkParam) => {
  const { id, changes } = params;
  const response = await chrome.bookmarks.create({
    parentId: id,
    ...changes,
  });
  return response;
};

export const isExistBookmark = async (url: string) => {
  const bookmarks = await chrome.bookmarks.search({ url });
  return {
    isExist: bookmarks.length > 0,
    bookmarks,
  };
};
