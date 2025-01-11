import React, { useEffect, useState } from 'react';
import '../../layoutContainer.css';
import { Button, Space, message, Row, Modal } from 'antd';

import Search from './components/Filter/index';
import { batchRemove, queryBookmarksByRecent } from '@extension/service';
import useEditBookmarkModal from './hooks/useBookmarkModal';
import useSectionModal, { ModeEnum } from './hooks/useSectionModal';
import List from './components/List/index';
import useBatchEditMarkModal from './hooks/useBatchEditMarkModal';
import type { EditBookmark } from '@extension/types';

const useSelectedRow = () => {
  const [selectedRows, setSelectedRows] = useState<EditBookmark[]>([]);
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: EditBookmark[]) => {
      setSelectedRows(selectedRows);
    },
    selectedRowKeys: selectedRows.map(v => v.id),
    onSelectAll: (_, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };

  const resetSelectedRows = () => setSelectedRows([]);

  return {
    selectedRows,
    rowSelection,
    resetSelectedRows,
  };
};

const usePager = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const onChange = (page, pageSize) => {
    setPageSize(pageSize);
    setCurrent(page);
  };

  const setDefaultPager = () => {
    setCurrent(1);
    setPageSize(30);
  };

  return {
    current,
    pageSize,
    onChange,
    setDefaultPager,
  };
};

const Bookmarks: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [list, setList] = useState([]);

  const { selectedRows, rowSelection, resetSelectedRows } = useSelectedRow();
  const { pageSize, current, onChange: onPaginationChange, setDefaultPager } = usePager();

  useEffect(() => {
    console.log('filters', filters);
    getBookmarks(filters);
    setDefaultPager();
    resetSelectedRows();
  }, [filters]);

  const getBookmarks = async filters => {
    const bookmarks = await queryBookmarksByRecent(filters);
    setList(bookmarks);
  };

  const refreshList = () => getBookmarks(filters);

  const batchDelete = async () => {
    // const ids = selectedRows.map((item) => item.id);
    const titleNode = (
      <span>
        确定删除
        <span style={{ color: 'red', fontWeight: 'bold' }}>{selectedRows.length}条</span>
        书签吗???
      </span>
    );
    Modal.confirm({
      title: titleNode,
      onOk: async () => {
        try {
          await batchRemove(selectedRows);
          message.success(`已删除${selectedRows.length}条书签`);
          refreshList();
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    });
  };

  const batchEdit = async () => {
    // selectedRows
    editBatchEditModal(selectedRows, () => {
      refreshList();
      resetSelectedRows();
    });
  };

  const { editBookmarkModal, modalElement } = useEditBookmarkModal();
  const { editSectionModal, ele: sectionModal } = useSectionModal();
  const { editBatchEditModal, ele: batchEditModal } = useBatchEditMarkModal();

  return (
    // TODO: 这个 store 后续可以根据需要放在 App 组件上，让所有组件获取到 store 数据，跨菜单拿到 store 数据；

    <div className="bookmarks-wrap">
      <Search setFilters={setFilters} />
      <Row justify="end" style={{ marginTop: '24px' }}>
        <Space size="middle" direction="horizontal">
          <Button type="primary" onClick={batchEdit} disabled={selectedRows.length === 0}>
            批量修改
          </Button>
          <Button
            type="primary"
            onClick={() => editSectionModal(selectedRows, ModeEnum.EDIT, refreshList)}
            disabled={selectedRows.length === 0}>
            创建片段
          </Button>
          <Button type="primary" danger onClick={batchDelete} disabled={selectedRows.length === 0}>
            批量删除
          </Button>
        </Space>
      </Row>
      <List
        editBookmark={values => editBookmarkModal(values, refreshList)}
        list={list}
        rowSelection={rowSelection}
        refreshList={refreshList}
        current={current}
        pageSize={pageSize}
        onPageChange={onPaginationChange}
      />
      {sectionModal}
      {modalElement}
      {batchEditModal}
    </div>
  );
};

export default Bookmarks;
