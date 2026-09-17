import { Request, Response, NextFunction } from 'express';
import { authStore } from './authStore';
import { AdminUser, AdminSession } from './types';

// Extend Express Request type
export interface AuthenticatedAdminRequest extends Request {
  adminUser?: AdminUser;
  adminSession?: AdminSession;
}

/**
 * Middleware: requireAdmin
 * Enforces server-side authentication and authorization.
 * Deny-by-default: Without valid session and ADMIN role, access is rejected immediately.
 */
export function requireAdmin(req: AuthenticatedAdminRequest, res: Response, next: NextFunction) {
  // 1. Extract token from Authorization header or cookie
  let token = '';

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.cookies && req.cookies['admin_session']) {
    token = req.cookies['admin_session'];
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  if (!token) {
    authStore.recordSecurityEvent(
      'UNAUTHORIZED_ADMIN_API_ACCESS',
      'MEDIUM',
      clientIp,
      `Yêu cầu truy cập trái phép vào ${req.method} ${req.originalUrl}`
    );
    return res.status(401).json({
      error: 'Unauthorized: Bạn cần đăng nhập tài khoản Quản trị viên (Admin) để thực hiện thao tác này.',
      code: 'AUTH_REQUIRED'
    });
  }

  // 2. Validate token against server-side active sessions
  const validation = authStore.validateSession(token);

  if (!validation.valid || !validation.session || !validation.user) {
    authStore.recordSecurityEvent(
      'INVALID_ADMIN_SESSION',
      'MEDIUM',
      clientIp,
      `Session token không hợp lệ hoặc đã hết hạn tại ${req.method} ${req.originalUrl}`
    );
    return res.status(401).json({
      error: validation.reason || 'Phiên làm việc đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.',
      code: 'SESSION_EXPIRED'
    });
  }

  // 3. Enforce Role Authorization
  if (validation.session.role !== 'ADMIN' || validation.user.role !== 'ADMIN') {
    authStore.recordSecurityEvent(
      'FORBIDDEN_ROLE_ACCESS',
      'HIGH',
      clientIp,
      `Tài khoản không đủ quyền (Role: ${validation.user.role}) cố truy cập ${req.method} ${req.originalUrl}`
    );
    return res.status(403).json({
      error: 'Forbidden: Bạn không có quyền Quản trị viên (ADMIN) để thực hiện hành động này.',
      code: 'FORBIDDEN'
    });
  }

  // 4. Attach authenticated user and session to request context
  req.adminUser = validation.user;
  req.adminSession = validation.session;

  next();
}
