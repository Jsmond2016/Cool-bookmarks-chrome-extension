import { useControllableValue } from 'ahooks';
import { Input, Select, Space } from 'antd';

type ISelectManyProps = {
  value?: any;
  onChange?: any;
  firstCategoryOptions: Record<'label' | 'value', string>[];
  secondCategoryOptions: Record<'label' | 'value', string>[];
};

const BindCategory = (props: ISelectManyProps) => {
  const { firstCategoryOptions, secondCategoryOptions, ...restProps } = props;

  const [value, setValue] = useControllableValue(restProps, {
    defaultValue: [],
  });

  return (
    <Space direction="vertical" style={{ width: 420 }}>
      {firstCategoryOptions.map((v, idx) => (
        <Space wrap key={idx}>
          <Input disabled style={{ width: 200 }} value={v.label} />
          <Select
            style={{ width: 160 }}
            mode="multiple"
            value={value}
            options={secondCategoryOptions.map(v => ({ value: v.value, label: v.value }))}
            onChange={setValue}
            placeholder="请选择二级分类"
          />
        </Space>
      ))}
    </Space>
  );
};

export default BindCategory;
