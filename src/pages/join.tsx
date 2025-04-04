import config from "@/config";
import { Input, Divider, Typography, Card, Form, Button, FormProps, Select, message } from "antd";
import { useState } from "react";


type JoinFields = {
    site_name: string;
    site_url: string;
    org_name: string;
    org_type: number;
}

const HomePage = () => {

    const { Title } = Typography;
    const [loading, setLoading] = useState(false);
    const [joinFormRef] = Form.useForm<JoinFields>();

    const onFinish: FormProps<JoinFields>['onFinish'] = (values) => {
        if (localStorage.getItem("token") === null) {
            message.info("请先登录");
            return
        }
        setLoading(true);

        //values.org_type = parseInt(values.org_type.toString());

        fetch(`/api/icp/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((res) => {
                // console.log(res);
                if (res.success == true) {
                    message.success(res.message);
                    joinFormRef.resetFields();
                } else {
                    message.error(res.message);
                }
            }).catch((e) => {
                // console.error(e);
            }).finally(() => {
                setLoading(false);
            });
    };

    return (
        <div
            style={{
                maxWidth: "90%",
                margin: "0 auto"
            }}
        >
            <Typography>
                <Title>登记</Title>
            </Typography>
            <Divider />
            <Card>
                <p>
                    申请前你需要知悉的：
                    <br />
                    1、编号由（8位随机数字）自动生成的。
                    <br />
                    2、审核通过后联盟编号将会通过官方邮箱发至你申请时填写的邮箱，所以请您确保邮箱的真实性。
                    <br />
                    3、收到联盟审核通过的邮件后，你需要将标志于三个工作日内悬挂至你的网站底部。
                </p>
            </Card>
            <Divider />
            <div style={{ height: "50px" }} />
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                style={{ maxWidth: 1000 }}
                onFinish={onFinish}
                autoComplete="off"
                form={joinFormRef}
            >
                <Form.Item
                    label="网站名称"
                    name="site_name"
                    rules={[{ required: true, message: '请输入您的网站名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="网站链接"
                    name="site_url"
                    rules={[{ required: true, message: '请输入您的完整域名' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="主办单位"
                    name="org_name"
                    rules={[{ required: true, message: '请输入您的主办单位' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="主体性质"
                    name="org_type"
                    rules={[{ required: true, message: '请选择主体性质' }]}
                >
                    <Select
                        options={[
                            { value: 1, label: <span>个人</span> },
                            { value: 0, label: <span>企业</span> }
                        ]}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        提交申请
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default HomePage;