/**
 * Role-based permission system
 */

export type UserRole = 'admin' | 'super_admin';

export interface RolePermissions {
  canCreateMembers: boolean;
  canEditMembers: boolean;
  canDeleteMembers: boolean;
  canManageAdmins: boolean;
  canAccessSettings: boolean;
  canManageTransactions: boolean;
  canViewAuditLog: boolean;
  canDeleteTransactions: boolean;
}

/**
 * Get permissions based on user role
 */
export function getPermissionsByRole(role?: string): RolePermissions {
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = role === 'admin' || isSuperAdmin;

  return {
    canCreateMembers: isAdmin,
    canEditMembers: isAdmin,
    canDeleteMembers: isSuperAdmin, // Only super_admin can delete
    canManageAdmins: isSuperAdmin,
    canAccessSettings: isSuperAdmin,
    canManageTransactions: isAdmin,
    canViewAuditLog: isSuperAdmin,
    canDeleteTransactions: isSuperAdmin,
  };
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(role?: string): boolean {
  return role === 'super_admin';
}

/**
 * Check if user is admin or super admin
 */
export function isAdmin(role?: string): boolean {
  return role === 'admin' || role === 'super_admin';
}

/**
 * Validate if user has permission for an action
 */
export function hasPermission(
  role: string | undefined,
  permission: keyof RolePermissions
): boolean {
  const permissions = getPermissionsByRole(role);
  return permissions[permission];
}
