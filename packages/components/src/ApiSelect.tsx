import React, { useEffect, useMemo } from 'react';
import type { TreeSelectProps } from 'antd';
import { TreeSelect } from 'antd';
import { getSubTree } from '@extension/service';
import { useGroupListStore } from '@extension/store';

type ApiSelectProps = TreeSelectProps;

export default function ApiSelect(props: ApiSelectProps) {
  const { groupList, updateGroupList } = useGroupListStore();
  useEffect(() => {
    if (groupList.length === 0) {
      getSubTree().then(bookmarks => {
        updateGroupList(bookmarks);
      });
    }
  }, []);

  /**
   *
   * @param list
   * @returns { TitleProps, value, children: [] }
   */
  const transformTreeData = (list: chrome.bookmarks.BookmarkTreeNode[]) => {
    const dirTreeData: any = list
      .filter(item => !item.url)
      .map(item => {
        const { title, id, children, ...rest } = item;
        return {
          title: title,
          value: id,
          children: children && children.length > 0 ? transformTreeData(children) : [],
          ...rest,
        };
      });
    return dirTreeData;
  };

  const treeData = useMemo(() => {
    if (groupList.length === 0) {
      return [];
    }
    const rootItem = groupList[0] as chrome.bookmarks.BookmarkTreeNode;
    return transformTreeData(rootItem.children || []);
  }, [groupList]);

  return (
    <TreeSelect
      showSearch
      allowClear
      placeholder="请搜索并选择文件夹"
      treeData={treeData}
      treeNodeFilterProp="title"
      {...props}
    />
  );
}
