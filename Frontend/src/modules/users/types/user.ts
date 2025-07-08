
export interface UserPermission {
    id: string;
    module: string;
    action: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    mobile: string;
    phone: string;
    roleId: string;
    isActive: boolean;
    roleName: string;
    extraPermissions: UserPermission[];
}


export interface Role {
    id: string;
    code: string;
    name: string;
    permissions: UserPermission[];
}

export type MasterData = {
    roles: Role[];
    permissions: UserPermission[];
};