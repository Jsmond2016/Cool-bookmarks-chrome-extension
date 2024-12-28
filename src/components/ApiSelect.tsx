import { Select, SelectProps } from "antd";
import { useEffect } from "react";
import { getGroupList } from "@src/pages/apis";
import { useGroupListStore } from "@src/pages/store";
import { LabeledValue } from "antd/es/select";

type ApiSelectProps = SelectProps;

export default function ApiSelect({ value, onChange }: ApiSelectProps) {
  const { groupList, updateGroupList } = useGroupListStore();
  useEffect(() => {
    if (groupList.length === 0) {
      getGroupList().then((bookmarks) => {
        updateGroupList(bookmarks);
      });
    }
  }, []);

  const options: LabeledValue[] = groupList.map(({ title, id }) => ({
    label: title,
    value: id,
  }));

  return (
    <Select
      value={value}
      showSearch
      allowClear
      placeholder="请搜索并选择文件夹"
      optionFilterProp="label"
      onChange={onChange}
      filterOption={(input, option: LabeledValue) =>
        ((option?.label as string) ?? "")
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      options={options}
    />
  );
}
