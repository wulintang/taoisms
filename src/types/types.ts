type BaseResp<T> = {
    success: boolean;
    message: string;
    data: T;
};

type userStatus = {
    email: string;
    role: number;
    userId: number;
};

type icpInfo = {
    ID: number;
    UserId: number;
    IcpCode: number;
    SiteName: string;
    SiteUrl: string;
    OrgName: string;
    OrgType: number;
    Status: number;
    CreatedAt: number;
    UpdatedAt: number;
}


type adminIcpList = {
    list: icpInfo[];
    total: number;
}

export type {
    BaseResp,
    userStatus,
    icpInfo,
    adminIcpList
}
