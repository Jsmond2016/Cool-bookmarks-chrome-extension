import {
  Col,
  Input,
  Row,
  DatePicker,
  Select,
  Form,
  Space,
  Button,
  SelectProps,
} from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import "./index.less";
import { sourceMap } from "../../../../utils";
import { evolve, filter, map, pipe } from "ramda";
import { useContext, useEffect, useState } from "react";
import { getGroupList } from "@src/pages/options/api";
import { ActionType, useStore } from "@src/pages/options/store";
import { LabeledValue } from "antd/es/select";
import { StoreContext } from "../..";

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

type ApiSelectProps = SelectProps;

const ApiSelect = ({ value, onChange }: ApiSelectProps) => {
  const storeContext = useContext(StoreContext);
  const { store, dispatch } = storeContext;
  useEffect(() => {
    if (store.groupList.length === 0) {
      getGroupList().then((bookmarks) => {
        dispatch({
          type: ActionType.UPDATE_GROUP_LIST,
          payload: { groupList: bookmarks },
        });
      });
    }
  }, []);

  const options: LabeledValue[] = store.groupList.map(
    ({ title, id }: Record<string, string>) => ({
      label: title,
      value: id,
    })
  );

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
};

const Search = ({ setFilters }) => {
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, any>) => {
    const pipeFns = pipe(
      filter((v: any) => ![undefined, "", null].includes(v)),
      map((v: any) => (typeof v === "string" ? v.trim() : v))
    );
    const newValues: Record<string, any> = pipeFns(values);

    if (newValues.collectDateRange) {
      newValues.collectDateRange = newValues.collectDateRange.map((v) =>
        dayjs(v).valueOf()
      );
    }
    setFilters(newValues);
  };

  return (
    <div className="search-container">
      <Form form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <FormItem label="书签名" name="bookmarkName">
              <Input />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem label="按来源分类" name="categoryUrl">
              <Select allowClear>
                {Object.entries(sourceMap).map(([key, name]) => (
                  <Select.Option key={key} value={key}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem label="收藏日期" name="collectDateRange">
              <RangePicker
                placeholder={["开始日期", "结束日期"]}
                presets={rangePresets}
                showTime
                format="YYYY/MM/DD"
              />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <Space size="large">
              <Button type="default" htmlType="reset" onClick={() => setFilters({})}>
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Space>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <FormItem label="所属文件夹名" name="belongToId">
              <ApiSelect />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Search;
