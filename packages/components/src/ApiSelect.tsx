import type { SelectProps } from 'antd';
import { Select } from 'antd';
import { useEffect } from 'react';
import { getGroupList } from '@extension/service';
import { useGroupListStore } from '@extension/store';
import type { LabeledValue } from 'antd/es/select';

type ApiSelectProps = SelectProps;

export default function ApiSelect(props: ApiSelectProps) {
  const { groupList, updateGroupList } = useGroupListStore();
  useEffect(() => {
    if (groupList.length === 0) {
      getGroupList().then(bookmarks => {
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
      showSearch
      allowClear
      placeholder="请搜索并选择文件夹"
      {...props}
      optionFilterProp="label"
      options={options}
    />
  );
}
