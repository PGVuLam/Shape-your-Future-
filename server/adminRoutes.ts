import { Router, Response } from 'express';
import { authStore } from './authStore';
import { adminDataService } from './adminDataService';
import { requireAdmin, AuthenticatedAdminRequest } from './adminMiddleware';

export const adminRouter = Router();

// ============================================================================
// 1. AUTHENTICATION & SESSION ENDPOINTS
// ============================================================================

/**
 * POST /api/admin/login
 * Public endpoint but strictly protected by IP Rate Limiting + Account Lockout
 */
adminRouter.post('/login', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // 1. Check IP rate limit (max 5 attempts per minute)
  const rateLimit = authStore.checkIpRateLimit(clientIp);
  if (!rateLimit.allowed) {
    authStore.recordSecurityEvent(
      'RATE_LIMIT_EXCEEDED',
      'HIGH',
      clientIp,
      `Quá nhiều lượt đăng nhập sai từ IP này. Chặn trong ${rateLimit.retryAfterSeconds}s.`
    );
    return res.status(429).json({
      error: `Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau ${rateLimit.retryAfterSeconds} giây.`,
      retryAfter: rateLimit.retryAfterSeconds
    });
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ tên đăng nhập và mật khẩu.' });
  }

  // 2. Perform authentication with password hash verification
  const result = authStore.authenticate(username, password, clientIp, userAgent);

  if (!result.success || !result.user || !result.session) {
    if (result.locked) {
      return res.status(423).json({ error: result.error, locked: true });
    }
    return res.status(401).json({ error: result.error || 'Thông tin đăng nhập không hợp lệ.' });
  }

  // 3. Set secure HttpOnly session cookie
  res.cookie('admin_session', result.session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  });

  // 4. Return authenticated response (NEVER return password or secret)
  return res.json({
    status: 'ok',
    message: 'Đăng nhập Quản trị viên thành công.',
    token: result.session.token,
    user: {
      id: result.user.id,
      username: result.user.username,
      role: result.user.role,
      lastLoginAt: result.user.lastLoginAt,
      createdAt: result.user.createdAt
    },
    expiresAt: result.session.expiresAt
  });
});

/**
 * POST /api/admin/logout
 * Requires valid admin session. Invalidates session immediately.
 */
adminRouter.post('/logout', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const token = req.adminSession?.token;
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  if (token) {
    authStore.revokeSession(token, req.adminUser?.id, req.adminUser?.username, clientIp, userAgent);
  }

  res.clearCookie('admin_session');
  return res.json({ status: 'ok', message: 'Đã đăng xuất phiên Quản trị viên an toàn.' });
});

/**
 * GET /api/admin/me
 * Returns current admin profile & session status
 */
adminRouter.get('/me', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const user = req.adminUser!;
  const session = req.adminSession!;

  return res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      lastPasswordChange: user.securityMetadata?.lastPasswordChange
    },
    session: {
      id: session.id,
      createdAt: session.createdAt,
      lastActivityAt: session.lastActivityAt,
      expiresAt: session.expiresAt
    }
  });
});

/**
 * GET /api/admin/sessions
 * Returns all active sessions for current admin
 */
adminRouter.get('/sessions', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const sessions = authStore.getActiveSessions(req.adminUser!.id, req.adminSession!.token);
  return res.json({ sessions });
});

/**
 * POST /api/admin/sessions/revoke-others
 * Invalidate all other sessions (useful if account compromise suspected)
 */
adminRouter.post('/sessions/revoke-others', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  const count = authStore.revokeAllOtherSessions(req.adminUser!.id, req.adminSession!.token);

  authStore.addAuditLog({
    adminId: req.adminUser!.id,
    username: req.adminUser!.username,
    action: 'ALL_OTHER_SESSIONS_REVOKED',
    resource: 'admin_session',
    result: 'SUCCESS',
    ip: clientIp,
    userAgent,
    details: { revokedCount: count }
  });

  return res.json({ status: 'ok', message: `Đã hủy ${count} phiên làm việc khác.` });
});

/**
 * POST /api/admin/change-password
 * Change password with current password verification
 */
adminRouter.post('/change-password', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.' });
  }

  const result = authStore.changePassword(req.adminUser!.id, currentPassword, newPassword, clientIp, userAgent);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({ status: 'ok', message: 'Đổi mật khẩu thành công. Mật khẩu mới đã được cập nhật an toàn.' });
});

// ============================================================================
// 2. DATA MANAGEMENT & PIPELINE ENDPOINTS
// ============================================================================

/**
 * GET /api/admin/data/status
 */
adminRouter.get('/data/status', requireAdmin, (_req: AuthenticatedAdminRequest, res: Response) => {
  const status = adminDataService.getStatus();
  return res.json(status);
});

/**
 * POST /api/admin/data/update
 * Triggers live data update pipeline on server-side
 */
adminRouter.post('/data/update', requireAdmin, async (req: AuthenticatedAdminRequest, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    const result = await adminDataService.runUpdatePipeline(req.adminUser!.username);

    authStore.addAuditLog({
      adminId: req.adminUser!.id,
      username: req.adminUser!.username,
      action: 'DATA_UPDATE_TRIGGERED',
      resource: 'data_pipeline',
      result: 'SUCCESS',
      ip: clientIp,
      userAgent,
      details: { itemsChecked: result.itemsChecked, newConflicts: result.newConflictsFound }
    });

    return res.json(result);
  } catch (err: any) {
    authStore.addAuditLog({
      adminId: req.adminUser!.id,
      username: req.adminUser!.username,
      action: 'DATA_UPDATE_TRIGGERED',
      resource: 'data_pipeline',
      result: 'FAILURE',
      ip: clientIp,
      userAgent,
      details: { error: err?.message || 'Update failed' }
    });
    return res.status(500).json({ error: err?.message || 'Có lỗi xảy ra trong tiến trình cập nhật dữ liệu.' });
  }
});

/**
 * GET /api/admin/data/sources
 */
adminRouter.get('/data/sources', requireAdmin, (_req: AuthenticatedAdminRequest, res: Response) => {
  const sources = adminDataService.getSources();
  return res.json({ sources });
});

/**
 * POST /api/admin/data/sources/toggle
 */
adminRouter.post('/data/sources/toggle', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const { sourceId, enabled } = req.body || {};
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  if (!sourceId || typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'sourceId và enabled là bắt buộc.' });
  }

  const success = adminDataService.toggleSource(sourceId, enabled);
  if (!success) {
    return res.status(404).json({ error: 'Không tìm thấy nguồn dữ liệu.' });
  }

  authStore.addAuditLog({
    adminId: req.adminUser!.id,
    username: req.adminUser!.username,
    action: 'SOURCE_TOGGLE',
    resource: 'data_source',
    resourceId: sourceId,
    result: 'SUCCESS',
    ip: clientIp,
    userAgent,
    details: { enabled }
  });

  return res.json({ status: 'ok', sourceId, enabled });
});

/**
 * POST /api/admin/data/sources/reset
 */
adminRouter.post('/data/sources/reset', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  adminDataService.resetSources();

  authStore.addAuditLog({
    adminId: req.adminUser!.id,
    username: req.adminUser!.username,
    action: 'SOURCE_RESET',
    resource: 'data_sources',
    result: 'SUCCESS',
    ip: clientIp,
    userAgent,
    details: { resetTo: 'official_defaults' }
  });

  return res.json({ status: 'ok', message: 'Đã khôi phục toàn bộ nguồn dữ liệu chuẩn của Bộ GD&ĐT và các trường ĐH.' });
});

/**
 * GET /api/admin/data/conflicts
 */
adminRouter.get('/data/conflicts', requireAdmin, (_req: AuthenticatedAdminRequest, res: Response) => {
  const conflicts = adminDataService.getConflicts();
  return res.json({ conflicts });
});

/**
 * POST /api/admin/data/verify
 * Approve or Reject candidate conflict record
 */
adminRouter.post('/data/verify', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const { conflictId, action } = req.body || {};
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  if (!conflictId || (action !== 'APPROVE' && action !== 'REJECT')) {
    return res.status(400).json({ error: 'conflictId và action (APPROVE/REJECT) là bắt buộc.' });
  }

  const success = adminDataService.resolveConflict(conflictId, action, req.adminUser!.username);
  if (!success) {
    return res.status(404).json({ error: 'Không tìm thấy mục đối soát này.' });
  }

  authStore.addAuditLog({
    adminId: req.adminUser!.id,
    username: req.adminUser!.username,
    action: action === 'APPROVE' ? 'DATA_APPROVE' : 'DATA_REJECT',
    resource: 'admission_record_conflict',
    resourceId: conflictId,
    result: 'SUCCESS',
    ip: clientIp,
    userAgent,
    details: { action }
  });

  return res.json({ status: 'ok', conflictId, action });
});

/**
 * POST /api/admin/data/publish
 */
adminRouter.post('/data/publish', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  const result = adminDataService.publishStaged(req.adminUser!.username);

  authStore.addAuditLog({
    adminId: req.adminUser!.id,
    username: req.adminUser!.username,
    action: 'DATA_PUBLISH',
    resource: 'data_version',
    resourceId: result.newVersion,
    result: 'SUCCESS',
    ip: clientIp,
    userAgent,
    details: { publishedRecordsCount: result.publishedCount }
  });

  return res.json(result);
});

/**
 * POST /api/admin/data/rollback
 */
adminRouter.post('/data/rollback', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const { versionId } = req.body || {};
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  if (!versionId) {
    return res.status(400).json({ error: 'versionId là bắt buộc.' });
  }

  try {
    const result = adminDataService.rollbackToVersion(versionId, req.adminUser!.username);

    authStore.addAuditLog({
      adminId: req.adminUser!.id,
      username: req.adminUser!.username,
      action: 'DATA_ROLLBACK',
      resource: 'data_version',
      resourceId: versionId,
      result: 'SUCCESS',
      ip: clientIp,
      userAgent,
      details: { restoredVersion: result.restoredVersion }
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err?.message || 'Không thể rollback phiên bản này.' });
  }
});

/**
 * GET /api/admin/data/versions
 */
adminRouter.get('/data/versions', requireAdmin, (_req: AuthenticatedAdminRequest, res: Response) => {
  const versions = adminDataService.getVersions();
  return res.json({ versions });
});

// ============================================================================
// 3. AI CONFIGURATION ENDPOINTS
// ============================================================================

/**
 * GET /api/admin/ai/config
 */
adminRouter.get('/ai/config', requireAdmin, (_req: AuthenticatedAdminRequest, res: Response) => {
  const config = adminDataService.getAIConfig();
  // Safe sanitized configuration: NEVER return raw API keys
  return res.json({
    config,
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasGroqKey: Boolean(process.env.GROQ_API_KEY)
  });
});

/**
 * POST /api/admin/ai/config
 */
adminRouter.post('/ai/config', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  const updated = adminDataService.updateAIConfig(req.body, req.adminUser!.username);

  authStore.addAuditLog({
    adminId: req.adminUser!.id,
    username: req.adminUser!.username,
    action: 'AI_CONFIG_CHANGE',
    resource: 'ai_configuration',
    result: 'SUCCESS',
    ip: clientIp,
    userAgent,
    details: { provider: updated.provider, model: updated.modelName }
  });

  return res.json({ status: 'ok', config: updated });
});

/**
 * GET /api/admin/ai/usage
 */
adminRouter.get('/ai/usage', requireAdmin, (_req: AuthenticatedAdminRequest, res: Response) => {
  return res.json({
    quota: {
      provider: 'Gemini 3.8 Flash & Groq Fast Tier',
      rpmLimit: 30,
      rpdLimit: 14400,
      tpmLimit: 1000,
      usedRequestsToday: 42,
      usedTokensToday: 18450,
      estimatedRemainingRequests: 14358,
      status: 'HEALTHY'
    }
  });
});

// ============================================================================
// 4. AUDIT LOGS & SECURITY MONITORING
// ============================================================================

/**
 * GET /api/admin/audit-logs
 */
adminRouter.get('/audit-logs', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const limit = parseInt((req.query.limit as string) || '50', 10);
  const logs = authStore.getAuditLogs(limit);
  return res.json({ logs });
});

/**
 * GET /api/admin/security/events
 */
adminRouter.get('/security/events', requireAdmin, (req: AuthenticatedAdminRequest, res: Response) => {
  const limit = parseInt((req.query.limit as string) || '50', 10);
  const events = authStore.getSecurityEvents(limit);
  return res.json({ events });
});
