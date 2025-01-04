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
    url: string;
  };
};

export interface IBookMark {
  dateAdded: number;
  description: string;
  id: string;
  index: number;
  parentId: string;
  source: string;
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

export interface EditBookmark {
  dirType: DirTypeEnum;
  parentId: string;
  newDir: string;
  customDescription: string;

  id: string;
  title: string;
  url: string;
}
