export type UserRole = 'student' | 'instructor' | 'admin';

export function canAccessAdmin(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'instructor';
}

export function canManageContent(userRole: UserRole): boolean {
  return userRole === 'admin';
}

export function canManageUsers(userRole: UserRole): boolean {
  return userRole === 'admin';
}

export function canExportData(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'instructor';
}