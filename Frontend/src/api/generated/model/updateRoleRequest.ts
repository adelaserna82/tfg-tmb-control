/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * TMB Control API
 * OpenAPI spec version: v1
 */
import type { RolePermissionDto } from './rolePermissionDto';

export interface UpdateRoleRequest {
  /** @nullable */
  name?: string | null;
  /** @nullable */
  code?: string | null;
  /** @nullable */
  permissions?: RolePermissionDto[] | null;
}
