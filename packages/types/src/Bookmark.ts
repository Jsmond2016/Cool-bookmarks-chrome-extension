import type { DirTypeEnum, PriorityEnum } from '@extension/constants';
export interface Group {
  id: string;
  title: string;
}

export type IBookmarkParam = {
  id: string;
  changes: {
    title: string;
    url?: string;
  };
};

export interface IBookMark {
  dateAdded: number;
  index: number;
  source: string;

  id: string;
  parentId: string;
  title: string;
  url: string;
}

export interface EditBookmark extends IBookMark {
  dirType: DirTypeEnum;
  parentId: string;
  newDir?: string;
  description: string;
  priority: PriorityEnum;
  aiSummary: string;
}
