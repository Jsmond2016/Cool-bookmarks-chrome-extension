import type { ColumnsType, TableProps } from 'antd/es/table';
import type { IBookMark } from '../..';
import { useEffect, useState } from 'react';
import Table from 'antd/es/table';
import type { PaginationProps } from 'antd';
import { Button, Modal, Space, message, Typography, Tooltip } from 'antd';
import { getGroupList, removeBookmark } from '@extension/service';
import { getCustomTitle } from '@extension/utils';

const { Paragraph, Link } = Typography;

export type IProps = {
  list: IBookMark[];
  editBookmark: (record: IBookMark) => void;
  rowSelection: TableProps<IBookMark>['rowSelection'];
  refreshList: () => void;
  current: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
};

const List = (props: IProps) => {
  const { editBookmark, list, rowSelection, refreshList, current, pageSize, onPageChange } = props;

  const [groupListMap, setGroupListMap] = useState(new Map<string, string>());

  useEffect(() => {
    getGroupList().then(bookmarks => {
      setGroupListMap(new Map(bookmarks.map(bookmark => [bookmark.id, bookmark.title])));
    });
  }, []);

  const copyBookmark = async (record: IBookMark) => {
    const { url, title: sourceTitle } = record;
    const { title, aiSummary, description } = getCustomTitle(sourceTitle);
    const desc = description ? `个人读后感：**${description}**` : '';
    const text = `- [${title}](${url}): ${aiSummary} ${desc}`;
    // refer: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    const res = await navigator.clipboard.writeText(text);
    console.log('res: ', res);
    message.success('复制成功!');
  };

  const deleteBookmark = async (record: IBookMark) => {
    Modal.confirm({
      title: '确定删除吗？',
      onOk: async () => {
        try {
          await removeBookmark(record);
          message.success('删除成功');
          refreshList();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 书签名/链接/文章名/来源/自定义描述/
  const columns: ColumnsType<IBookMark> = [
    {
      title: '书签名',
      dataIndex: 'title',
      width: 360,
      render: (v, record) => {
        const { description, title } = getCustomTitle(record.title);
        return (
          <Tooltip title={description}>
            <Paragraph ellipsis style={{ width: '360px' }}>
              <Link href={record.url}>{title}</Link>
            </Paragraph>
          </Tooltip>
        );
      },
    },
    {
      title: 'AI总结',
      dataIndex: 'aiSummary',
      width: 360,
      render: (v, record) => <Paragraph style={{ width: '360px' }}>{getCustomTitle(record.title).aiSummary}</Paragraph>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 360,
      render: (v, record) => (
        <Paragraph style={{ width: '360px' }}>{getCustomTitle(record.title).description}</Paragraph>
      ),
    },
    {
      title: '收藏时间',
      dataIndex: 'date',
      width: 120,
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 120,
    },
    {
      title: '所属文件夹',
      dataIndex: 'belongToDir',
      width: 120,
      render: (v, record) => groupListMap.get(record.parentId),
    },
    // {
    //   title: "自定义描述",
    //   dataIndex: "description",
    //   width: 120,
    // },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 180,
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
  const width = columns.reduce((pre, cur) => ((pre += +(cur.width || 0)), pre), 0);

  const showTotal: PaginationProps['showTotal'] = total => `总共 ${total} 条`;

  const pagination = {
    total: list.length,
    defaultCurrent: 1,
    current,
    pageSize,
    onChange: onPageChange,
    showTotal,
    pageSizeOptions: [10, 20, 30, 40, 50],
  };

  console.log('list 1111 ==>>> ', list);

  return (
    <Table<IBookMark>
      rowKey="id"
      rowSelection={{
        type: 'checkbox',
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
