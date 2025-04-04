import config from "@/config";
import { Helmet, useNavigate } from "umi";
import { Avatar, Button, Col, Dropdown, Form, FormProps, Input, Layout, Menu, MenuProps, message, Modal, Row, Space, theme } from "antd";
import { Outlet } from 'umi'
import { Header, Content, Footer } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { UserOutlined } from '@ant-design/icons';
import { BaseResp, userStatus } from "@/types/types";
import { WaterMark } from "@ant-design/pro-components";

import "@/pages/index.css"

type sendCodeStruct = {
    msg: string,
    loading: boolean,
    disabled: boolean
}

type RegFieldType = {
    email: string,
    code: string,
    password: string
}

type LoginFieldType = {
    email: string,
    password: string
}

const Layouts = () => {
    const negitaion = useNavigate();
    const [current, setCurrent] = useState<string>('/');
    const [open, setOpen] = useState<boolean>(false);
    const [regOpen, setRegOpen] = useState<boolean>(false);
    const [uInfo, setUInfo] = useState<userStatus | null>(null)

    const [avatarMenuItem, setAvatarMenuItem] = useState<MenuProps['items']>([
        {
            key: 'logout',
            label: '退出',
            onClick: () => {
                localStorage.removeItem("token");
                setIsLogin(false);
                negitaion("/");
                message.success("退出成功");
            }
        }
    ]);

    const [menuItem, setMenuItem] = useState([
        {
            key: "/",
            label: '首页',
        },
        {
            key: "/join",
            label: '加入',
        },
        {
            key: "/about",
            label: '关于',
        }
    ]);


    const [sendCode, setSendCode] = useState<sendCodeStruct>({
        msg: "获取",
        loading: false,
        disabled: false
    })

    const initSendCode = () => setSendCode({
        msg: "获取",
        loading: false,
        disabled: false
    })

    const [LoginFormRef] = Form.useForm();
    const [registerFormRef] = Form.useForm();

    const [loginLoad, setLoginLoad] = useState<boolean>(false);
    const [regLoad, setRegLoad] = useState<boolean>(false);

    const [isLogin, setIsLogin] = useState<boolean>(false);

    useEffect(() => {
        if (isLogin) {
            if (uInfo && uInfo.role === 1) {
                setMenuItem([
                    ...menuItem,
                    {
                        key: "/admin",
                        label: "管理",
                    }
                ])
                console.log("admin")
            } else if (window.location.pathname.startsWith("/admin")) {
                message.warning("无访问权限")
                negitaion("/")
            }


            setAvatarMenuItem([
                {
                    key: 'logout',
                    label: '退出',
                    onClick: () => {
                        localStorage.removeItem("token");
                        setIsLogin(false);
                        negitaion("/");
                        message.success("退出成功");
                    }
                }
            ])
            return
        }


        setAvatarMenuItem([
            {
                key: 'login',
                label: '登录',
                onClick: () => {
                    setOpen(true);
                }
            },
            {
                key: 'register',
                label: '注册',
                onClick: () => {
                    setRegOpen(true);
                }
            }
        ])
    }, [isLogin, uInfo]);

    useEffect(() => {
        setCurrent(window.location.pathname);
        if (localStorage.getItem("token")) {
            setIsLogin(true);
            userStatusCheck();
        }
    }, []);


    const userStatusCheck = () => {
        fetch(`/api/user/status`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => response.json())
            .then((res: BaseResp<userStatus>) => {
                if (res.success === true) {
                    setIsLogin(true);
                    setUInfo(res.data);
                } else {
                    setIsLogin(false);
                    localStorage.removeItem("token");
                    message.warning(res.message)
                }
            })
            .catch(_err => {
                setIsLogin(false);
                localStorage.removeItem("token");
            });
    }

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


    const handleLogin: FormProps<LoginFieldType>['onFinish'] = (values) => {
        setLoginLoad(true);
        fetch(`/api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        })
            .then(response => response.json())
            .then(res => {
                if (res.success === true) {
                    message.success("登录成功")
                    localStorage.setItem("token", res.data.token)
                    registerFormRef.resetFields();
                    LoginFormRef.resetFields();

                    setOpen(false);
                    userStatusCheck();

                    setIsLogin(true);
                } else {
                    message.warning(res.message)
                }
            })
            .catch(_err => {
                message.error("网络错误")
            }).finally(() => {
                setLoginLoad(false);
            })
    };

    const handleRegister: FormProps<RegFieldType>['onFinish'] = (values) => {
        setRegLoad(true);
        fetch(`/api/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        })
            .then(response => response.json())
            .then(res => {
                if (res.success === true) {
                    message.success("注册成功")
                    registerFormRef.resetFields();
                    LoginFormRef.setFieldValue("email", values.email)
                    LoginFormRef.setFieldValue("password", "")
                    setRegOpen(false);
                    setOpen(true);
                } else {
                    message.warning(res.message)
                    setRegLoad(false);
                }
            })
            .catch(_err => setRegLoad(false));
    };

    const onClick: MenuProps["onClick"] = (e) => {
        negitaion(e.key);
        setCurrent(e.key);
    }


    const sendMail = () => {
        let email = registerFormRef.getFieldValue("email") || ""
        if (email === "") {
            message.warning("请输入邮箱")
            return
        }

        setSendCode({
            msg: "处理中",
            loading: true,
            disabled: true
        })

        // sendCode
        fetch(`/api/user/register/code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        })
            .then(response => response.json())
            .then(res => {
                if (res.success === true) {
                    message.success("验证码已发送")
                    let timeLeft = 120
                    let timer = setInterval(() => {
                        timeLeft--
                        setSendCode({
                            msg: `${timeLeft}s`,
                            loading: false,
                            disabled: true
                        })
                        if (timeLeft === 0) {
                            clearInterval(timer)
                            initSendCode()
                        }
                    }, 1000)
                } else {
                    message.warning(res.message)
                    initSendCode()
                }
            })
            .catch(_err => initSendCode());
    }


    return (
        <Layout
            style={{
                height: '100%',
            }}
        >
            <WaterMark content={config.TITLE}>
                <Helmet>
                    <title>{`${menuItem.find(item => item?.key === current)?.label || 'Default'} - ${config.TITLE}`}</title>
                </Helmet>
                <Header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'transparent',
                    }}

                >
                    <Menu
                        items={menuItem}
                        mode="horizontal"
                        defaultSelectedKeys={['/']}
                        selectedKeys={[current]}
                        onClick={onClick}
                        style={{
                            flex: 1,
                            minWidth: 0,
                            background: 'transparent',
                        }}
                    />
                    <Space>
                        <Dropdown menu={{ items: avatarMenuItem }}>
                            <Avatar
                                {...isLogin ? null : { icon: <UserOutlined /> }}
                                style={{ cursor: 'pointer' }}>
                                {
                                    isLogin ? (uInfo ? uInfo.email.slice(0, 1).toUpperCase() : "U") : ""
                                }
                            </Avatar>
                        </Dropdown>
                    </Space>
                </Header>
                <Content style={{
                    padding: '20px 48px',
                    width: '100%',
                }}>
                    <div
                        style={{
                            padding: 24,
                            margin: "auto",
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{
                    textAlign: 'center',
                    position: 'fixed',
                    bottom: 0,
                    width: '100%',
                }}>
                    {config.TITLE} ©{new Date().getFullYear()}
                </Footer>
            </WaterMark>

            {/* model */}
            < Modal
                title={`欢迎来到 ${config.TITLE}`}
                open={open}
                footer={
                    [
                        <Button type="dashed" key="1" onClick={() => setOpen(false)}>
                            取消
                        </Button>,
                        <Button loading={loginLoad} type="primary" key="2" onClick={() => LoginFormRef.submit()}>
                            登录
                        </Button>
                    ]}
                onCancel={() => setOpen(false)}
            >
                <Form
                    style={{
                        marginTop: 25,
                    }}
                    onFinish={handleLogin}
                    form={LoginFormRef}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Form.Item name="email" label="邮箱">
                        <Input placeholder="请输入您的邮箱" />
                    </Form.Item>
                    <Form.Item name="password" label="密码">
                        <Input type="password" placeholder="请输入您的密码" />
                    </Form.Item>
                    <Row
                        style={{
                            color: "grey",
                            fontSize: "13px",
                            paddingBottom: "15px"
                        }}
                        justify="space-between"
                    >
                        <Col
                            style={{
                                cursor: "pointer"
                            }}
                            onClick={() => message.info("再想想, 我也不知道你密码多少")}
                        >
                            忘记密码
                        </Col>
                        <Col
                            style={{
                                cursor: "pointer"
                            }}
                            onClick={() => {
                                setOpen(false);
                                setRegOpen(true);
                            }}
                        >
                            没有账户
                        </Col>
                    </Row>
                </Form>
            </Modal >

            {/* 注册 Modal */}
            < Modal
                title={`欢迎加入 ${config.TITLE}`}
                open={regOpen}
                onCancel={() => setRegOpen(false)}
                footer={
                    [
                        <Button type="dashed" key="1" onClick={() => setRegOpen(false)}>
                            取消
                        </Button>,
                        <Button
                            type="primary"
                            key="2"
                            loading={regLoad}
                            onClick={() => registerFormRef.submit()}
                        >
                            注册
                        </Button>
                    ]}
            >
                <Form
                    style={{
                        marginTop: 25,
                    }}
                    onFinish={handleRegister}
                    form={registerFormRef}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Form.Item
                        label="邮箱"
                        name="email"
                    >
                        <Input placeholder="请输入您的邮箱" />
                    </Form.Item>
                    <Form.Item
                        label="验证码"
                        name="code"
                        rules={[{ min: 4, max: 8 }]}
                    >
                        <Row
                            gutter={8}
                        >
                            <Col
                                span={16}
                            >
                                <Input
                                    type="text"
                                    placeholder="邮箱验证码"
                                />
                            </Col>
                            <Col
                                span={8}
                            >
                                <Button
                                    loading={sendCode.loading}
                                    disabled={sendCode.disabled}
                                    onClick={sendMail}
                                    style={{
                                        float: "right"
                                    }}
                                >
                                    {sendCode.msg}
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                    >
                        <Input
                            type="password"
                            placeholder="请输入您的密码"
                        />
                    </Form.Item>
                    <Row
                        style={{
                            color: "grey",
                            fontSize: "13px",
                            paddingBottom: "15px"
                        }}
                        justify="space-between"
                    >
                        <Col
                            style={{
                                cursor: "pointer"
                            }}
                            onClick={() => message.info("再想想, 我也不知道你密码多少")}
                        >
                            忘记密码
                        </Col>
                        <Col
                            style={{
                                cursor: "pointer"
                            }}
                            onClick={() => {
                                setRegOpen(false);
                                setOpen(true);
                            }}
                        >
                            已有账户
                        </Col>
                    </Row>
                </Form>
            </Modal >
        </Layout >
    );
}

export default Layouts;