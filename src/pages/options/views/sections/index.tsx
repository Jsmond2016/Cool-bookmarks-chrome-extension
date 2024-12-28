import {
  Space,
  Input,
  Button,
  Table,
  Row,
  Col,
  Form,
  Select,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import useSectionModal, { ModeEnum } from "../bookmarks/hooks/useSectionModal";
import * as api from "@src/pages/apis";

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

const Index = () => {
  const [sectionData, setSectionData] = useState([]);

  const { editSectionModal, ele: sectionModal } = useSectionModal();

  const getSections = async () => {
    const data = await api.querySectionNotes();
    setSectionData(data);
  };

  useEffect(() => {
    getSections();
  }, []);

  const rangePresets: {
    label: string;
    value: [Dayjs, Dayjs];
  }[] = [
    { label: "最近7天", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "最近2周", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "最近1个月", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "最近3个月", value: [dayjs().add(-90, "d"), dayjs()] },
  ];

  const onRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => {
    if (dates) {
      console.log("From: ", dates[0], ", to: ", dates[1]);
      console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    } else {
      console.log("Clear");
    }
  };

  const columns = [
    {
      title: "片段名",
      dataIndex: "sectionName",
    },
    {
      title: "创建时间",
      dataIndex: "createdDate",
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      title: "书签详情",
      dataIndex: "list",
      render: (value) => (
        <a onClick={() => editSectionModal(value, ModeEnum.PREVIEW, () => {})}>
          点击查看详情
        </a>
      ),
    },
  ];

  return (
    <div className="section-search-container">
      <div className="search-container">
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <FormItem label="片段名" name="sectionName">
              <Input />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem label="创建日期" name="date">
              <RangePicker
                placeholder={["开始日期", "结束日期"]}
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
      </div>
      <div className="content">
        <Table rowKey="sectionId" dataSource={sectionData} columns={columns} />
      </div>
      {sectionModal}
    </div>
  );
};

export default Index;
