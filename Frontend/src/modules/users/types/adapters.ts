import { CreateRoleResponse, CreateUserRequest, UpdateRoleRequest, UpdateUserRequest, UserDto, UserMasterDataDto } from "@/api/generated/model";
import { MasterData, User } from "./user";
import { Role } from "./user";


export function userDtoToUser(dto: UserDto): User {
  return {
    id: dto.id!,
    name: dto.name!,
    email: dto.email!,
    mobile: dto.mobile??"",
    phone: dto.phone??"",
    roleId: dto.role!.id!,
    isActive: dto.isActive!,
    roleName: dto.role?.name ?? "",
    extraPermissions: dto.extraPermissions?.map(p => ({
      id: p.id!,
      module: p.module!,
      action: p.action!,

    })) ?? [],
  };
}

export function userToUpdateReq(user: User, password: string): UpdateUserRequest {
  const base = {
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    phone: user.phone,
    roleId: user.roleId,
    isActive: user.isActive,
    extraPermissions: user.extraPermissions,
  };

  return password.trim()
    ? { ...base, password }
    : base;
}


export function userToCreateReq(user: User, password: string): CreateUserRequest {
  return {
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    phone: user.phone,
    roleId: user.roleId,
    isActive: user.isActive,
    password: password,
    extraPermissions: user.extraPermissions,
  };
}

export function masterDtoToMaster(dto: UserMasterDataDto): MasterData {
  return {
    roles: dto.roles?.map(role => ({
      id: role.id!,
      name: role.name!,
      code: role.code!,
      permissions: role.permissions?.map(permission => ({
        id: permission.id!,
        module: permission.module!,
        action: permission.action!,
      })) ?? []

    })) ?? [],
    permissions: dto.permissions?.map(permission => ({
      id: permission.id!,
      module: permission.module!,
      action: permission.action!,
    })) ?? [],
  };
}

export function roleToCreateReq(role: Role): CreateRoleResponse {
  return {
    name: role.name,
    code: role.code,
    permissions: role.permissions.map(p => ({
      id: p.id,
      module: p.module,
      action: p.action,
    })),
  };
}

export function roleToUpdateReq(role: Role): UpdateRoleRequest {
  return {
    name: role.name,
    code: role.code,
    permissions: role.permissions.map(p => ({
      id: p.id,
      module: p.module,
      action: p.action,
    })),
  };
}