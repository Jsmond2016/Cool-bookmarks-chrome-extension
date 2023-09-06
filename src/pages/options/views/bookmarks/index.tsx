import React, { useEffect, useState } from "react";
import "@pages/options/layoutContainer.css";
import { Button, Space, message, Row, Modal } from "antd";

import Search from "@src/pages/options/views/bookmarks/components/filter/index";
import { batchRemove, queryBookmarksByRecent } from "@pages/options/api";
import useEditBookmarkModal from "./hooks/useBookmarkModal";
import useSectionModal, { ModeEnum } from "./hooks/useSectionModal";
import List from "./components/list";
import { useStore } from "../../store";
import { useStorage } from "../../storage";

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

  const batchDelete = async () => {
    // const ids = selectedRows.map((item) => item.id);
    const titleNode = <span>确定删除<span style={{color: 'red', fontWeight: 'bold'}}>{selectedRows.length}条</span>书签吗???</span>
    Modal.confirm({
      title: titleNode,
      onOk: async () => {
        try {
          await batchRemove(selectedRows);
          message.success(`已删除${selectedRows.length}条书签`);
          await getBookmarks(filters);
        } catch (error) {
          message.error("批量删除失败");
        }
      },
    });
  };

  const { editBookmarkModal, modalElement } = useEditBookmarkModal();
  const { editSectionModal, ele: sectionModal } = useSectionModal();

  const { setStorage } = useStorage();


  return (
    // TODO: 这个 store 后续可以根据需要放在 App 组件上，让所有组件获取到 store 数据，跨菜单拿到 store 数据；
    <StoreContext.Provider value={{ store, dispatch }}>
      <div className="bookmarks-wrap">
        <Search setFilters={setFilters} />
        <Row justify="end">
          <Space size="middle" direction="horizontal">
            <Button
              type="primary"
              danger
              onClick={batchDelete}
              disabled={selectedRows.length === 0}
            >
              批量删除
            </Button>
            <Button
              type="primary"
              onClick={() => editSectionModal(selectedRows, ModeEnum.EDIT)}
              disabled={selectedRows.length === 0}
            >
              创建片段
            </Button>
          </Space>
        </Row>
        <List
          editBookmark={editBookmarkModal}
          list={list}
          rowSelection={rowSelection}
          refreshList={() => getBookmarks(filters)}
        />
        {sectionModal}
        {modalElement}
      </div>
    </StoreContext.Provider>
  );
};

export default Bookmarks;
