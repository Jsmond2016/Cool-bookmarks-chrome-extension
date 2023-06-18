import { Col, Input, Row, DatePicker, Select, Form, Space, Button } from "antd";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import './index.less';
import { sourceMap } from '../../../../utils';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const { RangePicker } = DatePicker;

const FormItem = ({ label, name, children }) => (
  <Form.Item {...formItemLayout} label={label} name={name}>
    {children}
  </Form.Item>
);

const rangePresets: {
  label: string;
  value: [Dayjs, Dayjs];
}[] = [
  { label: "最近7天", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "最近2周", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "最近1个月", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "最近3个月", value: [dayjs().add(-90, "d"), dayjs()] },
];


const Search = () => {
  
  
  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1]);
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
      console.log('Clear');
    }
  };


  return (
    <div className='search-container'>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <FormItem label="书签名" name="bookmarkName">
            <Input />
          </FormItem>
        </Col>
        <Col className="gutter-row" span={6}>
          <FormItem label="按来源分类" name="categoryName">
            <Select>
              {Object.entries(sourceMap).map(([key, name]) => (
                <Select.Option key={key} value={name}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col className="gutter-row" span={6}>
          <FormItem label="收藏日期" name="date">
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              presets={rangePresets}
              showTime
              format="YYYY/MM/DD"
              onChange={onRangeChange}
            />
          </FormItem>
        </Col>
        <Col className="gutter-row" span={6}>
          <Space size="large">
            <Button type="primary">搜索</Button>
            <Button type="default">重置</Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <FormItem label="所属文件夹名" name="bookmarkName">
            <Input />
          </FormItem>
        </Col>
      </Row>
    </div>
  );
};

export default Search;
