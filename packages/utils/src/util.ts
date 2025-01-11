import type { BookmarkParams } from '@extension/types';

import { BOOKMARK_CUSTOM_SPLIT, PriorityEnum } from '@extension/constants';
import { filter } from 'ramda';
// 链接：https://juejin.cn/post/7184359234060943421
export function buildShortUUID() {
  let unique = 0;
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);
  // eslint-disable-next-line no-undef
  unique++;
  return random + unique + String(time);
}

export const sourceMap = {
  'zhihu.com': '知乎',
  'github.com': 'github',
  'github.io': 'github',
  'juejin.cn': '掘金',
  'segmentfault.com': '思否',
  'wexin.qq.com': '微信',
  'csdn.net': 'CSDN',
  'jianshu.com': '简书',
  'cnblogs.com': '博客园',
  others: '其他',
};

export const sourceRender = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    const address = hostname.split('.').slice(-2).join('.');
    return sourceMap[address as keyof typeof sourceMap] || '其他';
  } catch (error) {
    console.log('error: ', error);
    console.log('invalid-url: ', url);
    return '其他';
  }
};

type CustomTitle = BookmarkParams;
export const setCustomTitle = (params: CustomTitle): string => {
  const { title, description, aiSummary, priority, firstCategory, secondCategory } = params;

  // 没有设置自定义选项，则只保存标题
  if ([description, aiSummary, priority].every(v => !v)) {
    return title;
  }

  const filterPayload = filter(v => v != null)({
    description,
    aiSummary,
    priority: String(priority),
    firstCategory,
    secondCategory,
  });
  const searchParams = new URLSearchParams(filterPayload as Record<string, any>);
  return `${title}${BOOKMARK_CUSTOM_SPLIT}?${searchParams.toString()}`;
};

export const getCustomTitle = (sourceTitle: string): CustomTitle => {
  const [title, customParams] = sourceTitle.split(BOOKMARK_CUSTOM_SPLIT);
  // 没有自定义选项，则只返回标题
  if (!customParams) {
    return {
      title,
      description: '',
      aiSummary: '',
      priority: PriorityEnum.Medium,
      firstCategory: '',
      secondCategory: '',
    };
  }

  const searchParams = Object.fromEntries(new URLSearchParams(customParams) as any);
  const { priority, ...rest } = searchParams as CustomTitle;
  return {
    ...rest,
    title,
    priority: +priority,
  };
};
