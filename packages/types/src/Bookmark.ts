export interface Group {
  id: string;
  title: string;
  // dateAdded: number;
  // description: string;
  // index: number;
  // parentId: string;
  // source: string;
  // url: string;
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

export enum DirTypeEnum {
  Exist = 0,
  New = 1,
}

export const DirTypeOptions = {
  [DirTypeEnum.Exist]: '选择已有目录',
  [DirTypeEnum.New]: '新建目录',
} as const;

// 优先级
export enum PriorityEnum {
  Highest = 999,
  Higher = 888,
  Medium = 777,
  Low = 666,
  Lower = 555,
}
export const PriorityOptions = {
  [PriorityEnum.Highest]: '高',
  [PriorityEnum.Higher]: '较高',
  [PriorityEnum.Medium]: '中',
  [PriorityEnum.Low]: '低',
  [PriorityEnum.Lower]: '较低',
} as const;

export interface EditBookmark extends IBookMark {
  dirType: DirTypeEnum;
  parentId: string;
  newDir?: string;
  description: string;
  priority: PriorityEnum;
  aiSummary: string;

  // id: string;
  // title: string;
  // url: string;
}
