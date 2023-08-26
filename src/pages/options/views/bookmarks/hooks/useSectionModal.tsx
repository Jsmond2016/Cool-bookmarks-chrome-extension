import { useState } from "react";
import { Modal, List, Input, Form, message } from "antd";
import * as api from "../../../api";
import { buildShortUUID } from "../../../utils";
import { IBookMark } from "..";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Item = {
  dateAdded: number;
  id: string;
  index: number;
  parentId: string;
  title: string;
  url: string;
  source: string;
  description: string;
  date: string;
  bookmarkName: string;
  dateLastUsed?: number;
};

type SortTableItemProps = {
  item: Item;
};

function SortableItem(props: SortTableItemProps) {
  const { item } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    cursor: "move",
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <List.Item ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <a href={item.url}>{item.bookmarkName}</a>
    </List.Item>
  );
}

type DefaultListProps = {
  list: Item[];
  renderItem: (item: Item, index: number) => React.ReactNode;
};
const DefaultList = ({ list, renderItem }: DefaultListProps) => (
  <List
    style={{ maxHeight: "460px", overflowY: "scroll" }}
    bordered
    dataSource={list}
    renderItem={renderItem}
  ></List>
);

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
function DndList({ items, setItems }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items: Item[]) => {
        const oldIndex = items.map((v) => v.id).indexOf(active.id);
        const newIndex = items.map((v) => v.id).indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((v) => v.id)}
        strategy={verticalListSortingStrategy}
      >
        <DefaultList
          list={items}
          renderItem={(item: Item) => (
            <SortableItem key={item.id} item={item} />
          )}
        />
      </SortableContext>
    </DndContext>
  );
}

const DefaultPreveiwList = ({ list }) => (
  <DefaultList
    list={list}
    renderItem={(item: Item) =>
      (
        <List.Item>
          <a href={item.url}>{item.bookmarkName}</a>
        </List.Item>
      )}
  />
);

enum ModeEnum {
  EDIT = "EDIT",
  PREVIEW = "PREVIEW",
}

const useSectionModal = () => {
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState([]);
  const [mode, setMode] = useState(ModeEnum.EDIT);
  const [form] = Form.useForm();

  const saveSection = async () => {
    const values = await form.validateFields();
    const sectionData = {
      list,
      ...values,
      sectionId: buildShortUUID(),
      createdDate: new Date().getTime(),
    };
    const res = await api.saveSection({ data: sectionData });
    if (!(res || "").includes("success")) return;
    message.success("保存成功");
    setVisible(false);
  };

  const openModalAndSetValues = (list: IBookMark[], _mode: ModeEnum) => {
    console.log("list: ", list);
    setList(list);
    setMode(_mode);
    setVisible(true);
  };

  const ele = (
    <Modal
      title={mode === ModeEnum.EDIT ? "设置片段" : "片段详情"}
      open={visible}
      footer={mode === ModeEnum.PREVIEW ? null : undefined}
      onOk={saveSection}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      destroyOnClose
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} preserve={false}>
        {mode === ModeEnum.EDIT && (
          <Form.Item
            label="片段名"
            name="sectionName"
            required
            rules={[{ required: true, message: "请输入片段名" }]}
          >
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
