import { useRef, useState } from 'react';
import { Modal, List, Input, Form, message, Space, Button, Row, Col } from 'antd';
import * as api from '@extension/service';
import { buildShortUUID } from '@extension/utils';
import type { EditBookmark } from '@extension/types';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, KeyboardSensor } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragOutlined, MinusCircleOutlined } from '@ant-design/icons';

type SortTableItemProps = {
  item: EditBookmark;
  removeItem: (item: EditBookmark) => void;
};

function SortableItem(props: SortTableItemProps) {
  const { item, removeItem } = props;
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const iconStyles = {
    cursor: 'move',
    fontSize: '16px',
    color: '#c1c1c1',
  };

  // 拖拽实现 https://docs.dndkit.com/presets/sortable/usesortable
  return (
    <List.Item ref={setNodeRef} style={style} {...attributes}>
      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
        <Col flex="20px">
          <DragOutlined ref={setActivatorNodeRef} {...listeners} style={iconStyles} />
        </Col>
        <Col flex="auto">
          <a href={item.url}>{item.title}</a>
        </Col>
        <Col flex="20px">
          <MinusCircleOutlined
            onClick={() => {
              removeItem(item);
            }}
            style={{ fontSize: '16px', color: '#ff4d4f', cursor: 'pointer' }}
          />
        </Col>
      </Row>
    </List.Item>
  );
}

type DefaultListProps = {
  list: EditBookmark[];
  renderItem: (item: EditBookmark, index: number) => React.ReactNode;
};
const DefaultList = ({ list, renderItem }: DefaultListProps) => (
  <List style={{ maxHeight: '460px', overflowY: 'scroll' }} bordered dataSource={list} renderItem={renderItem}></List>
);
// const getTitleTuple = (title): [string, string] => {
//   return title.split(BOOKMARK_CUSTOM_SPLIT);
// };

/**
 * 拖拽列表功能
 *
 * 实现参考：
 *
 * refer: https://docs.dndkit.com/presets/sortable
 *
 * @param param0
 * @returns
 */
function DndList({ items, setItems }: any) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = event => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items: EditBookmark[]) => {
        const oldIndex = items.map(v => v.id).indexOf(active.id);
        const newIndex = items.map(v => v.id).indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removeItem = item => {
    const newList = items.filter(v => v.id !== item.id);
    setItems(newList);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(v => v.id)} strategy={verticalListSortingStrategy}>
        <DefaultList
          list={items}
          renderItem={(item: EditBookmark) => <SortableItem removeItem={removeItem} key={item.id} item={item} />}
        />
      </SortableContext>
    </DndContext>
  );
}

const DefaultPreveiwList = ({ list }: any) => {
  return (
    <DefaultList
      list={list}
      renderItem={(item: EditBookmark) => (
        <List.Item>
          <Row justify="space-between">
            <a href={item.url}>{item.title}</a>
            <MinusCircleOutlined style={{ fontSize: '16px', color: '#08c' }} />
          </Row>
        </List.Item>
      )}
    />
  );
};

export enum ModeEnum {
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW',
}

const useSectionModal = () => {
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState<EditBookmark[]>([]);
  const [mode, setMode] = useState(ModeEnum.EDIT);
  const [form] = Form.useForm();
  const onSuccessCBRef = useRef<(() => void) | null>(null);
  const saveSection = async () => {
    const values = await form.validateFields();
    const sectionData = {
      list,
      ...values,
      sectionId: buildShortUUID(),
      createdDate: new Date().getTime(),
    };
    const res = await api.saveSection({ data: sectionData });
    if (!(res || '').includes('success')) return;
    message.success('保存成功');
    onSuccessCBRef.current?.();
    setVisible(false);
  };

  const openModalAndSetValues = (list: EditBookmark[], _mode: ModeEnum, cb) => {
    setList(list);
    setMode(_mode);
    setVisible(true);
    onSuccessCBRef.current = cb;
  };

  const onCopyAll = async () => {
    const text = list
      .map(item => {
        const { title, aiSummary, url, description } = item;
        const desc = description ? `个人读后感：**${description}**` : '';
        return `- [${title}](${url}): ${aiSummary} ${desc}`;
      })
      .join('\n');
    // refer: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    const res = await navigator.clipboard.writeText(text);
    console.log('res: ', res);
    message.success('复制成功!');
  };

  const Footer = () =>
    mode !== ModeEnum.PREVIEW ? (
      <Space size="small" direction="horizontal">
        <Button type="default" onClick={onCopyAll}>
          拷贝
        </Button>
        <Button type="primary">确定</Button>
      </Space>
    ) : null;

  const ele = (
    <Modal
      title={mode === ModeEnum.EDIT ? '设置片段' : '片段详情'}
      open={visible}
      onOk={saveSection}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      destroyOnClose
      footer={<Footer />}>
      <Form form={form} preserve={false}>
        {mode === ModeEnum.EDIT && (
          <Form.Item label="片段名" name="sectionName" required rules={[{ required: true, message: '请输入片段名' }]}>
            <Input placeholder="请输入片段名" />
          </Form.Item>
        )}
        {mode === ModeEnum.EDIT && <DndList items={list} setItems={setList} />}

        {mode === ModeEnum.PREVIEW && <DefaultPreveiwList list={list} />}
      </Form>
    </Modal>
  );

  return {
    editSectionModal: openModalAndSetValues,
    ele,
  };
};

export default useSectionModal;
