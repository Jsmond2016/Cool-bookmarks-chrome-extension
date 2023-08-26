import type { ColumnsType } from "antd/es/table";
import { IBookMark, StoreContext } from "../..";
import { useContext, useEffect, useMemo, useState } from "react";
import Table from "antd/es/table";
import { PaginationProps } from 'antd';
import { useStore } from '@src/pages/options/store';



export type IProps = {
  list: IBookMark[];
  editBookmark: (record: IBookMark) => void;
  rowSelection: {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IBookMark[]) => void;
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => void;
  };
};

const List = (props: IProps) => {
  const { editBookmark, list, rowSelection } = props;
  const storeContext = useContext(StoreContext);
  const { store, dispatch } = storeContext;
  console.log('store: ', store);

  const groupListMap = useMemo(() => {
   return store.groupList.reduce((pre, cur) => {
      pre.set(cur.id, cur.title)
      return pre;
    }, new Map())
  }, [store])
  

  // 书签名/链接/文章名/来源/自定义描述/
  const columns: ColumnsType<IBookMark> = [
    {
      title: "书签名",
      dataIndex: "title",
      width: 260,
    },
    {
      title: "链接",
      dataIndex: "url",
      width: 260,
      render: (value) => (
        <a href={value} target="_blank" style={{ wordBreak: "break-all" }}>
          {value}
        </a>
      ),
    },
    {
      title: "收藏时间",
      dataIndex: "date",
      width: 120,
    },
    {
      title: "来源",
      dataIndex: "source",
      width: 120,
    },
    {
      title: "所属文件夹",
      dataIndex: "belongToDir",
      width: 120,
      render: (v, record) => groupListMap.get(record.parentId)
    },
    {
      title: "自定义描述",
      dataIndex: "description",
      width: 120,
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 100,
      render: (v, record) => (
        <div>
          <p>
            <a onClick={() => editBookmark(record)}>修改书签</a>
          </p>
        </div>
      ),
    },
  ];
  const width = columns.reduce(
    (pre, cur) => ((pre += +(cur.width || 0)), pre),
    0
  );

  const showTotal: PaginationProps['showTotal'] = (total) => `总共 ${total} 条`;


  const pagination = {
    total: list.length,
    showTotal
  }

  return (
    <Table
      rowKey="id"
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      pagination={pagination}
      columns={columns}
      dataSource={list}
      scroll={{ x: width + 160 }}
    />
  );
};

export default List;
