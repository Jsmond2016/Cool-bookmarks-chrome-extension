import { MinusCircleFilled, PlusCircleFilled } from '@ant-design/icons';
import { useControllableValue } from 'ahooks';
import { Button, Input, Space } from 'antd';
import React from 'react';

const CategoryInput = props => {
  const [value, setValue] = useControllableValue(props, { defaultValue: [{ value: '', label: '' }] });

  return (
    <Space direction="vertical">
      {value?.map((v, idx) => (
        <Space wrap key={idx}>
          <Input
            value={v.value}
            placeholder="分类名字"
            onChange={e => setValue(value.map((vv, index) => (index === idx ? { ...vv, value: e.target.value } : vv)))}
          />
          <Input
            value={v.label}
            placeholder="描述"
            onChange={e => setValue(value.map((vv, index) => (index === idx ? { ...vv, label: e.target.value } : vv)))}
          />

          <Button
            disabled={idx === 0}
            danger
            icon={<MinusCircleFilled />}
            onClick={() => setValue(value.filter((_, index) => index !== idx))}>
            删除
          </Button>
        </Space>
      ))}
      <Button type="dashed" onClick={() => setValue([...value, { value: '', label: '' }])} icon={<PlusCircleFilled />}>
        添加
      </Button>
    </Space>
  );
};

export default CategoryInput;
