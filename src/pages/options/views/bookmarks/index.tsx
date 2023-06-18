import React, { useEffect, useState } from "react";
import "@pages/options/layoutContainer.css";
import { Table, Button, Space } from "antd";

import Search from "@src/pages/options/views/bookmarks/components/filter/index";
import { queryBookmarksByRecent } from "@pages/options/api";
import useEditBookmarkModal from "./hooks/useBookmarkModal";
import useSectionModal from "./hooks/useSectionModal";
import List from "./components/List";

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

//列表项： 时间 | 标题 | 链接

const Bookmarks: React.FC = () => {
  const [list, setList] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IBookMark[]) => {
      setSelectedRows(selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      setSelectedRows(selectedRows);
    },
  };

  const getBookmarks = async () => {
    const bookmarks = await queryBookmarksByRecent(100);
    setList(bookmarks);
  };

  const { editBookmarkModal, modalElement } = useEditBookmarkModal();
  const { editSectionModal, ele: sectionModal } = useSectionModal();

  useEffect(() => {
    getBookmarks();
  }, []);

  return (
    <div className="bookmarks-wrap">
      <Search />
      <div
        className="operation"
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          padding: "12px 0",
        }}
      >
        <Button
          type="primary"
          onClick={() => editSectionModal(selectedRows, "EDIT")}
          disabled={selectedRows.length === 0}
        >
          创建片段
        </Button>
      </div>
      <List
        editBookmark={editBookmarkModal}
        list={list}
        rowSelection={rowSelection}
      />
      {sectionModal}
      {modalElement}
    </div>
  );
};

export default Bookmarks;
