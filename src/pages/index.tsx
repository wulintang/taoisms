import config from "@/config";
import { Input, Divider, Alert, Typography, message, Form, Button } from "antd";

import React, { useEffect } from 'react';
import { Space, Table } from 'antd';
import { ModalForm, ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-components";
import { useNavigate } from "umi";
const { Column } = Table;


const HomePage = () => {
  const negitaion = useNavigate();

  const { Search } = Input;
  const { Title } = Typography;
  const [data, setData] = React.useState<DataType[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [show, setShow] = React.useState(false);
  const [form] = Form.useForm();

  interface DataType {
    key: React.Key;
    ID: number;

    SiteUrl: string;
    SiteName: string;
    IcpCode: number;

    UpdatedAt: number;
    CreatedAt: number;

    OrgName: string;
    OrgType: number;
  }


  const getData = async () => {
    setLoading(true);

    let response = await fetch(`/api/icp/list`, { method: "GET" }).then((res) => res.json());

    if (response.success) {
      let tmp: DataType[] = [];

      response.data.list.forEach((item: any) => {
        tmp.push({
          key: item.ID,
          ID: item.ID,
          SiteName: item.SiteName,
          IcpCode: item.IcpCode,
          UpdatedAt: item.UpdatedAt,

          SiteUrl: item.SiteUrl,
          OrgName: item.OrgName,
          OrgType: item.OrgType,
          CreatedAt: item.CreatedAt,
        })
      })

      setData(tmp);
    } else {
      message.error(response.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      style={{
        maxWidth: "90%",
        margin: "0 auto"
      }}
    >
      <Typography>
        <Title>{config.TITLE}</Title>
      </Typography>
      <div style={{ height: "20px" }} />
      <Search placeholder="请输入网站名称/域名/备案编码查询，请勿使用子域名或者带 http://www 等字符的网址查询。" />
      <Divider />
      <Alert message={`${config.TITLE} 致力于打造一个经典的虚拟ICP备案网, 申请本站ICP备案请于3天内于贵站底部悬挂 ${config.TITLE} 码，逾期将撤销并拉入申请黑名单!`} type="info" />
      <div style={{ height: "50px" }} />
      {/* --------------------------------- */}

      <ModalForm
        title="详细信息"
        autoFocusFirstInput
        modalProps={{
          forceRender: true,
          destroyOnClose: true,
          onCancel: () => setShow(false),
          okButtonProps: { style: { display: 'none' } },
          cancelButtonProps: { style: { display: 'none' } },
        }}
        open={show}
        form={form}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="ID"
            label="UNIQUE ID"
            disabled
            required />
        </ProForm.Group>
        <ProForm.Group title="信息管理">
          <ProFormText
            width="md"
            name="SiteName"
            label="网站名称"
            disabled
            required />
          <ProFormText
            width="md"
            name="SiteUrl"
            label="网站链接"
            disabled
            required />
          <ProFormText
            width="md"
            name="IcpCode"
            label="ICP Code"
            placeholder="请输入ICP Code"
            disabled
            required />
        </ProForm.Group>
        <ProForm.Group title="备案人信息填写">
          <ProFormText
            width="md"
            name="OrgName"
            label="主办单位"
            disabled
            required />
          <ProFormSelect
            width="md"
            name="OrgType"
            label="主体性质"
            disabled
            required
            options={[
              { value: 1, label: <span>个人</span> },
              { value: 0, label: <span>企业</span> }
            ]}
          />
        </ProForm.Group>
      </ModalForm>


      <Table loading={loading} dataSource={data}>
        <Column title="ID" dataIndex="ID" key="id" />
        <Column title="网站标题" dataIndex="SiteName" key="SiteName" />
        <Column title="备案号" dataIndex="IcpCode" key="UpdatedAt" />
        <Column title="更新时间" dataIndex="UpdatedAt" key="UpdatedAt" render={
          (text: number) => {
            let date = new Date(text * 1000);
            return date.toLocaleString();
          }
        } />
        <Column
          title="Action"
          key="action"
          render={(_: any, record: DataType) => (
            <Space size="middle">
              <Button type="link" onClick={() => window.open(record.SiteUrl)}>跳转</Button>
              <Button type="link" onClick={() => negitaion("/icp/" + record.IcpCode)}>查看详细</Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
}

export default HomePage;