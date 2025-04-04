import React, { useEffect } from 'react';
import { Card, Descriptions, message, Typography } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { icpInfo } from '@/types/types';
import config from '@/config';
import { Helmet, useNavigate } from 'umi';
const { Title } = Typography;


const IcpInfoPage = () => {
    const negitaion = useNavigate();
    const [icpInfo, setIcpInfo] = React.useState<icpInfo | null>(null);


    let fetchIcpInfo = async (icpcode: number) => {

        // GET /detail/:icp_code
        let response = await fetch(`/api/icp/detail/${icpcode}`).then((res) => res.json());
        if (response.success) {
            setIcpInfo(response.data);
        } else {
            message.error(response.message);
            negitaion('/');
        }
    }


    useEffect(() => {
        let icpcode = window.location.pathname.split('/').pop();
        if (icpcode === undefined) {
            negitaion('/');
            return
        }

        fetchIcpInfo(parseInt(icpcode));
    }, []);

    return (
        <div>
            <Helmet>
                <title>{`${icpInfo?.SiteName || ""} - ${config.TITLE}`}</title>
            </Helmet>
            <div className="icp-info-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 24px 100px 24px' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>备案信息详情</Title>
                <Card>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label={`${config.TITLE}码`}>{`${config.TITLE}${icpInfo?.IcpCode}号`}</Descriptions.Item>
                        <Descriptions.Item label="主体">{icpInfo?.OrgName}</Descriptions.Item>
                        <Descriptions.Item label="主体类型">{icpInfo?.OrgType == 0 ? "企业" : "个人"}</Descriptions.Item>
                        <Descriptions.Item label="网站名称">{icpInfo?.SiteName}</Descriptions.Item>
                        <Descriptions.Item label="网站链接">
                            <a href={icpInfo?.SiteUrl} target="_blank" rel="noopener noreferrer">
                                <GlobalOutlined /> {icpInfo?.SiteUrl}
                            </a>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </div>
    );
};

export default IcpInfoPage;