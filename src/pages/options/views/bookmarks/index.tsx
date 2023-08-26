import React, { useEffect, useState } from "react";
import "@pages/options/layoutContainer.css";
import { Table, Button, Space } from "antd";

import Search from "@src/pages/options/views/bookmarks/components/filter/index";
import {
  getBookMarksByIds,
  getSubTree,
  queryBookmarksByRecent,
} from "@pages/options/api";
import useEditBookmarkModal from "./hooks/useBookmarkModal";
import useSectionModal, { ModeEnum } from "./hooks/useSectionModal";
import List from "./components/List";
import { useStore } from '../../store';

export interface IBookMark {
  dateAdded: number;
  description: string;
  id: string;
  index: number;
  parentId: string;
  // parentName: string;
  source: string;
  title: string;
  url: string;
}

export const StoreContext = React.createContext(null);

const Bookmarks: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [list, setList] = useState([]);
  const [store, dispatch] = useStore();

  const [selectedRows, setSelectedRows] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IBookMark[]) => {
      setSelectedRows(selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      setSelectedRows(selectedRows);
    },
  };

  useEffect(() => {
    console.log("filters", filters);
    getBookmarks(filters);
  }, [filters]);

  const getBookmarks = async (filters) => {
    const bookmarks = await queryBookmarksByRecent(filters);
    setList(bookmarks);
  };

  const { editBookmarkModal, modalElement } = useEditBookmarkModal();
  const { editSectionModal, ele: sectionModal } = useSectionModal();

  return (
    // TODO: 这个 store 后续可以根据需要放在 App 组件上，让所有组件获取到 store 数据，跨菜单拿到 store 数据；
    <StoreContext.Provider value={{ store, dispatch }}>
      <div className="bookmarks-wrap">
        <Search setFilters={setFilters} />
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
            onClick={() => editSectionModal(selectedRows, ModeEnum.EDIT)}
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
    </StoreContext.Provider>
  );
};

export default Bookmarks;
