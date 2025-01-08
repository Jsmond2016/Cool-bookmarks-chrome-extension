import { useControllableValue } from 'ahooks';
import { Input, Select, Space } from 'antd';

type ISelectManyProps = {
  value?: any;
  onChange?: any;
  firstCategoryOptions: string[];
  secondCategoryOptions: string[];
};

const BindCategory = (props: ISelectManyProps) => {
  const { firstCategoryOptions, secondCategoryOptions, ...restProps } = props;

  const [valList, setValList] = useControllableValue(restProps, {
    defaultValue: [
      {
        firstCategory: '',
        secondCategories: [],
      },
    ],
  });

  const onSecondChange = value => {
    // setVal([...val, value]);
  };

  return (
    <Space direction="vertical" style={{ width: 340 }}>
      {firstCategoryOptions.map((v, idx) => (
        <Space wrap key={idx}>
          <Input disabled style={{ width: 160 }} value={v} />
          <Select
            style={{ width: 160 }}
            mode="multiple"
            options={secondCategoryOptions.map(v => ({ label: v, value: v }))}
            onChange={onSecondChange}
            placeholder="请选择二级分类"
          />
        </Space>
      ))}
    </Space>
  );
};

export default BindCategory;
