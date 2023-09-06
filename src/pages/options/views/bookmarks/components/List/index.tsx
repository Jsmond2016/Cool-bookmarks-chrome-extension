import type { ColumnsType } from "antd/es/table";
import { IBookMark, StoreContext } from "../..";
import { useContext, useMemo } from "react";
import Table from "antd/es/table";
import {
  Button,
  Modal,
  PaginationProps,
  Space,
  message,
  Typography,
  Tooltip,
} from "antd";
import { removeBookmark } from "@src/pages/options/api";

const { Paragraph, Text } = Typography;

export type IProps = {
  list: IBookMark[];
  editBookmark: (record: IBookMark) => void;
  rowSelection: {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IBookMark[]) => void;
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => void;
  };
  refreshList: () => void;
};

const List = (props: IProps) => {
  const { editBookmark, list, rowSelection, refreshList } = props;
  const storeContext = useContext(StoreContext);
  const { store, dispatch } = storeContext;
  console.log("store: ", store);

  const groupListMap = useMemo(() => {
    return store.groupList.reduce((pre, cur) => {
      pre.set(cur.id, cur.title);
      return pre;
    }, new Map());
  }, [store]);

  const copyBookmark = async (record: IBookMark) => {
    const { url, title } = record;
    const text = `- [${title}](${url})`;
    // refer: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    const res = await navigator.clipboard.writeText(text);
    console.log("res: ", res);
    message.success("复制成功!");
  };

  const deleteBookmark = async (record: IBookMark) => {
    Modal.confirm({
      title: "确定删除吗？",
      onOk: async () => {
        try {
          await removeBookmark(record);
          message.success("删除成功");
          refreshList();
        } catch (error) {
          message.error("删除失败");
        }
      },
    });
  };

  // 书签名/链接/文章名/来源/自定义描述/
  const columns: ColumnsType<IBookMark> = [
    {
      title: "书签名",
      dataIndex: "title",
      width: 260,
      render: (v) => (
        <Tooltip title={v}>
          <Paragraph ellipsis style={{width: '260px'}}>{v}</Paragraph>
        </Tooltip>
      ),
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
      render: (v, record) => groupListMap.get(record.parentId),
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
        <Space size="small" direction="horizontal">
          <Button type="link" onClick={() => copyBookmark(record)}>
            复制
          </Button>
          <Button type="link" onClick={() => editBookmark(record)}>
            修改
          </Button>
          <Button type="link" danger onClick={() => deleteBookmark(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const width = columns.reduce(
    (pre, cur) => ((pre += +(cur.width || 0)), pre),
    0
  );

  const showTotal: PaginationProps["showTotal"] = (total) => `总共 ${total} 条`;

  const pagination = {
    total: list.length,
    showTotal,
  };

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
