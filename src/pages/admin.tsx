import config from '@/config';
import { adminIcpList, BaseResp } from '@/types/types';
import { ActionType, ModalForm, ParamsType, ProColumns, ProForm, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Divider, Popconfirm, Typography, message } from 'antd';
import { useRef, useState } from 'react';



type TableListItem = {
  key: React.Key;
  ID: number;
  SiteName: string;
  IcpCode: number;
  Status: number;

  SiteUrl: string;
  OrgName: string;
  OrgType: number;

  CreatedAt: number;
};

type EditableCellProps = {
  ID: number;

  IcpCode: number;
  SiteName: string;
  SiteUrl: string;
  OrgName: string;
  OrgType: number;
  Status: number;
};

const AdminPage = () => {

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [messages, contextHolder] = message.useMessage();
  const actionRef = useRef<ActionType>();

  const [editFormRef] = ProForm.useForm();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 80,
      dataIndex: 'ID',
    },
    {
      title: '网站名称',
      dataIndex: 'SiteName',
    },
    {
      title: 'ICP Code',
      dataIndex: 'IcpCode',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'CreateAt',
      render: (_text, record) => {
        return new Date(record.CreatedAt * 1000).toLocaleString();
      }
    },
    {
      title: '状态',
      align: 'center',
      width: 80,
      dataIndex: 'Status',
      initialValue: '0',
      valueEnum: {
        0: { text: '待审', status: 'Warning' },
        1: { text: '通过', status: 'Success' },
        2: { text: '吊销', status: 'Error' },
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 80,
      key: 'option',
      valueType: 'option',
      render: (_dom, record, _index, action) => [
        <Button key="edit" type="link" onClick={() => doShowEditModal(record)}>编辑</Button>,
        <Popconfirm key="delete" title="确认删除?" onConfirm={() => deleteIcp(record.ID)}>
          <Button key="delete" danger type="link">删除</Button>
        </Popconfirm>
      ],
    },
  ];

  let doShowEditModal = (record: TableListItem) => {
    handleModalVisible(true);
    editFormRef.setFieldsValue(record);
  }

  // const [dataSource, setDataSource] = useState<TableListItem[]>([]);
  let dataRequest = async (params: ParamsType, _sorter: Record<string, any>, _filter: Record<string, any>) => {
    type Req = {
      limit: number;
      page: number;
      search: string;
      status: number;
    }

    let req: Req = {
      limit: params.pageSize as number,
      page: params.current as number,
      search: "",
      status: -1,
    }

    let query = new URLSearchParams(req as any).toString();

    let response: BaseResp<adminIcpList> = await fetch(`/api/admin/icp/list?${query}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    }).then((res) => res.json())

    let tmp: TableListItem[] = [];
    if (response.success) {
      response.data.list.forEach((item) => {
        tmp.push({
          key: item.ID,
          ID: item.ID,
          SiteName: item.SiteName,
          IcpCode: item.IcpCode,
          Status: item.Status,

          SiteUrl: item.SiteUrl,
          OrgName: item.OrgName,
          OrgType: item.OrgType,

          CreatedAt: item.CreatedAt,
        })
      })

      return {
        data: tmp,
        success: true,
        total: response.data.total
      }
    } else {
      messages.error(response.message);
    }

    return {
      data: [],
      success: false,
      total: 0,
    }
  }

  // updateIcp update ICP info
  const updateIcp = async (values: EditableCellProps) => {
    values.IcpCode = parseInt(values.IcpCode.toString());

    let response: BaseResp<null> = await fetch(`/api/admin/icp/${values.ID}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    }).then((res) => res.json())

    if (response.success) {
      messages.success(response.message);
      handleModalVisible(false);
      actionRef.current?.reload();
    } else {
      messages.error(response.message);
    }
  }

  const deleteIcp = async (ID: number) => {
    let response: BaseResp<null> = await fetch(`/api/admin/icp/${ID}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    }).then((res) => res.json())

    if (response.success) {
      messages.success(response.message);
      actionRef.current?.reload();
    } else {
      messages.error(response.message);
    }
  }

  return (
    <div
      style={{
        maxWidth: "90%",
        margin: "0 auto"
      }}
    >
      <Typography>
        <title>管理</title>
      </Typography>
      <Divider />

      {contextHolder}

      {/* --------------------------------- */}
      <ModalForm<EditableCellProps>
        title="编辑备案信息"
        autoFocusFirstInput
        modalProps={{
          forceRender: true,
          destroyOnClose: true,
          onCancel: () => handleModalVisible(false),
        }}
        submitTimeout={2000}
        onFinish={updateIcp}
        open={createModalVisible}
        form={editFormRef}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="ID"
            label="UNIQUE ID"
            readonly
            required />
        </ProForm.Group>
        <ProForm.Group title="基本信息管理">
          <ProFormText
            width="md"
            name="SiteName"
            label="网站名称"
            placeholder="请输入网站名称"
            required />
          <ProFormText
            width="md"
            name="SiteUrl"
            label="网站链接"
            placeholder="请输入网站链接"
            required />
          <ProFormText
            width="md"
            name="IcpCode"
            label="ICP Code"
            placeholder="请输入ICP Code"
            required />
        </ProForm.Group>
        <ProForm.Group title="备案人信息填写">
          <ProFormText
            width="md"
            name="OrgName"
            label="主办单位"
            placeholder="请输入主办单位"
            required />
          <ProFormSelect
            width="md"
            name="OrgType"
            label="主体性质"
            placeholder="请选择主体性质"
            required
            options={[
              { value: 1, label: <span>个人</span> },
              { value: 0, label: <span>企业</span> }
            ]}
          />
        </ProForm.Group>
        <ProForm.Group title="审核">
          <ProFormSelect
            width="md"
            name="Status"
            label="状态"
            placeholder="请选择状态"
            required
            options={[
              { value: 0, label: <span>待审核</span> },
              { value: 1, label: <span>备案通过</span> },
              { value: 2, label: <span>备案吊销</span> },
            ]}
          />
        </ProForm.Group>
      </ModalForm>
      {/* --------------------------------- */}

      <ProTable<TableListItem>
        columns={columns}
        request={dataRequest}
        actionRef={actionRef}
        toolbar={{
          title: '备案管理',
        }}
        rowKey="ID"
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          defaultPageSize: 10,
        }}
        search={false}
        scroll={{ x: 'max-content' }}
      />

    </div>
  );
}

export default AdminPage;