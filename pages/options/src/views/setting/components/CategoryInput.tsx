import { PlusCircleFilled } from '@ant-design/icons';
import { useControllableValue } from 'ahooks';
import { Button, Input, Space } from 'antd';
import React from 'react';

const CategoryInput = props => {
  const [value, setValue] = useControllableValue(props, { defaultValue: [{ name: '', label: '' }] });

  return (
    <Space direction="vertical">
      {value?.map((v, idx) => (
        <Space wrap key={idx}>
          <Input
            value={v.name}
            placeholder="分类名字"
            onChange={e => setValue(value.map((vv, index) => (index === idx ? { ...vv, name: e.target.value } : vv)))}
          />
          <Input
            value={v.label}
            placeholder="描述"
            onChange={e => setValue(value.map((vv, index) => (index === idx ? { ...vv, label: e.target.value } : vv)))}
          />
        </Space>
      ))}
      <Button type="dashed" onClick={() => setValue([...value, { name: '', label: '' }])} icon={<PlusCircleFilled />}>
        Add{' '}
      </Button>
    </Space>
  );
};

export default CategoryInput;
