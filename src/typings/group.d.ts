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