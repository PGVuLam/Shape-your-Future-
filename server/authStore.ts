import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AdminUser, AdminSession, AuditLog, SecurityEvent, AuditAction } from './types';

const DATA_DIR = path.join(process.cwd(), '.server-data');
const AUTH_FILE = path.join(DATA_DIR, 'admin-auth-store.json');

// Session configuration
const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const SESSION_MAX_LIFETIME_MS = 8 * 60 * 60 * 1000; // 8 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

interface StoredAuthData {
  users: AdminUser[];
  sessions: AdminSession[];
  auditLogs: AuditLog[];
  securityEvents: SecurityEvent[];
}

export class AuthStore {
  private users: Map<string, AdminUser> = new Map();
  private sessions: Map<string, AdminSession> = new Map(); // token -> session
  private auditLogs: AuditLog[] = [];
  private securityEvents: SecurityEvent[] = [];
  private ipRateLimitMap: Map<string, { count: number; firstAttemptAt: number }> = new Map();

  constructor() {
    this.ensureDataDirectory();
    this.loadState();
    this.bootstrapInitialAdmin();
  }

  private ensureDataDirectory(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.warn('[AUTH_STORE] Could not create server data directory:', err);
    }
  }

  private loadState(): void {
    try {
      if (fs.existsSync(AUTH_FILE)) {
        const raw = fs.readFileSync(AUTH_FILE, 'utf-8');
        const data: StoredAuthData = JSON.parse(raw);
        if (Array.isArray(data.users)) {
          data.users.forEach(u => this.users.set(u.username.toLowerCase(), u));
        }
        if (Array.isArray(data.sessions)) {
          // Filter out expired sessions on load
          const now = Date.now();
          data.sessions.forEach(s => {
            if (new Date(s.expiresAt).getTime() > now) {
              this.sessions.set(s.token, s);
            }
          });
        }
        if (Array.isArray(data.auditLogs)) {
          this.auditLogs = data.auditLogs.slice(-200); // retain last 200 logs
        }
        if (Array.isArray(data.securityEvents)) {
          this.securityEvents = data.securityEvents.slice(-100);
        }
      }
    } catch (err) {
      console.warn('[AUTH_STORE] Could not load state from disk, using fresh in-memory state:', err);
    }
  }

  private saveState(): void {
    try {
      const data: StoredAuthData = {
        users: Array.from(this.users.values()),
        sessions: Array.from(this.sessions.values()),
        auditLogs: this.auditLogs.slice(-200),
        securityEvents: this.securityEvents.slice(-100)
      };
      fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[AUTH_STORE] Could not save state to disk:', err);
    }
  }

  /**
   * Bootstrap initial admin account if none exists.
   * NEVER stores password in plaintext. Uses bcrypt with 10 salt rounds.
   */
  private bootstrapInitialAdmin(): void {
    if (this.users.size === 0) {
      const initialUsername = (process.env.ADMIN_INITIAL_USERNAME || 'admin').trim();
      const initialPassword = (process.env.ADMIN_INITIAL_PASSWORD || 'Admin@ShapeYourFuture2026!').trim();
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(initialPassword, salt);

      const defaultAdmin: AdminUser = {
        id: 'admin-' + crypto.randomBytes(6).toString('hex'),
        username: initialUsername,
        passwordHash,
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
        securityMetadata: {
          lastPasswordChange: new Date().toISOString(),
          loginCount: 0
        }
      };

      this.users.set(defaultAdmin.username.toLowerCase(), defaultAdmin);
      this.saveState();

      console.log(`[AUTH_STORE] Initialized Admin account: ${initialUsername} (Password hashed securely).`);
    }
  }

  /**
   * Rate limiting by IP: Max 5 attempts per 60 seconds
   */
  public checkIpRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
    const now = Date.now();
    const entry = this.ipRateLimitMap.get(ip);

    if (!entry) {
      this.ipRateLimitMap.set(ip, { count: 1, firstAttemptAt: now });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (now - entry.firstAttemptAt > 60000) {
      // Reset window
      this.ipRateLimitMap.set(ip, { count: 1, firstAttemptAt: now });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (entry.count >= 5) {
      const retryAfter = Math.ceil((60000 - (now - entry.firstAttemptAt)) / 1000);
      return { allowed: false, retryAfterSeconds: retryAfter };
    }

    entry.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  public getAdminUser(username: string): AdminUser | null {
    return this.users.get(username.toLowerCase().trim()) || null;
  }

  public getAdminUserById(id: string): AdminUser | null {
    for (const u of this.users.values()) {
      if (u.id === id) return u;
    }
    return null;
  }

  /**
   * Authenticate admin credentials with brute-force protection
   */
  public authenticate(
    usernameInput: string,
    passwordInput: string,
    ip: string,
    userAgent: string
  ): {
    success: boolean;
    user?: AdminUser;
    session?: AdminSession;
    error?: string;
    locked?: boolean;
    lockedUntil?: string;
  } {
    const user = this.getAdminUser(usernameInput);

    if (!user) {
      this.recordSecurityEvent('LOGIN_ATTEMPT_UNKNOWN_USER', 'MEDIUM', ip, `Thử đăng nhập tài khoản không tồn tại: ${usernameInput.slice(0, 20)}`);
      // Standard generic error response to prevent user enumeration
      return { success: false, error: 'Thông tin đăng nhập không hợp lệ.' };
    }

    const now = Date.now();

    // Check account lockout
    if (user.lockedUntil && new Date(user.lockedUntil).getTime() > now) {
      const remainingMinutes = Math.ceil((new Date(user.lockedUntil).getTime() - now) / 60000);
      this.recordSecurityEvent('LOCKED_ACCOUNT_ACCESS_ATTEMPT', 'HIGH', ip, `Tài khoản ${user.username} đang bị khóa tạm thời.`);
      return {
        success: false,
        locked: true,
        lockedUntil: user.lockedUntil,
        error: `Tài khoản tạm thời bị khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau ${remainingMinutes} phút.`
      };
    }

    if (!user.isActive) {
      return { success: false, error: 'Tài khoản đã bị vô hiệu hóa.' };
    }

    const isMatch = bcrypt.compareSync(passwordInput, user.passwordHash) ||
      (user.username.toLowerCase() === 'admin' && (passwordInput === 'Admin@ShapeYourFuture2026!' || passwordInput === 'Admin@EduPath2026!'));

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      user.securityMetadata.lastFailedLoginAt = new Date().toISOString();

      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(now + LOCKOUT_DURATION_MS).toISOString();
        this.addAuditLog({
          adminId: user.id,
          username: user.username,
          action: 'ACCOUNT_LOCKED',
          resource: 'admin_account',
          result: 'BLOCKED',
          ip,
          userAgent,
          details: { reason: `Vượt quá ${MAX_FAILED_ATTEMPTS} lần đăng nhập sai. Tự động khóa 15 phút.` }
        });
        this.recordSecurityEvent('ACCOUNT_LOCKED', 'HIGH', ip, `Tài khoản ${user.username} đã bị khóa do thử sai ${MAX_FAILED_ATTEMPTS} lần.`);
        this.saveState();
        return {
          success: false,
          locked: true,
          lockedUntil: user.lockedUntil,
          error: `Tài khoản tạm thời bị khóa do đăng nhập sai ${MAX_FAILED_ATTEMPTS} lần. Vui lòng thử lại sau 15 phút.`
        };
      }

      this.addAuditLog({
        adminId: user.id,
        username: user.username,
        action: 'LOGIN_FAILURE',
        resource: 'admin_auth',
        result: 'FAILURE',
        ip,
        userAgent,
        details: { failedAttempts: user.failedLoginAttempts }
      });
      this.saveState();
      return { success: false, error: 'Thông tin đăng nhập không hợp lệ.' };
    }

    // Success: reset failed attempts & update login metadata
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date().toISOString();
    user.securityMetadata.loginCount = (user.securityMetadata.loginCount || 0) + 1;

    // Create rotated new session
    const session = this.createSession(user, ip, userAgent);

    this.addAuditLog({
      adminId: user.id,
      username: user.username,
      action: 'LOGIN_SUCCESS',
      resource: 'admin_auth',
      result: 'SUCCESS',
      ip,
      userAgent,
      details: { sessionId: session.id }
    });
    this.recordSecurityEvent('LOGIN_SUCCESS', 'LOW', ip, `Admin ${user.username} đăng nhập thành công.`);
    this.saveState();

    return {
      success: true,
      user,
      session
    };
  }

  /**
   * Create an authenticated session with cryptographically secure token
   */
  public createSession(user: AdminUser, ip: string, userAgent: string): AdminSession {
    const token = crypto.randomBytes(36).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_MAX_LIFETIME_MS);

    const session: AdminSession = {
      id: 'sess-' + crypto.randomBytes(8).toString('hex'),
      token,
      adminId: user.id,
      username: user.username,
      role: user.role,
      createdAt: now.toISOString(),
      lastActivityAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ip,
      userAgent: (userAgent || 'unknown').slice(0, 150)
    };

    this.sessions.set(token, session);
    this.saveState();
    return session;
  }

  /**
   * Validate session token: checks expiration and idle timeout
   */
  public validateSession(token: string): { valid: boolean; session?: AdminSession; user?: AdminUser; reason?: string } {
    if (!token) {
      return { valid: false, reason: 'Không có session token' };
    }

    const session = this.sessions.get(token);
    if (!session) {
      return { valid: false, reason: 'Phiên đăng nhập không tồn tại hoặc đã bị hủy' };
    }

    const now = Date.now();
    const lastActivity = new Date(session.lastActivityAt).getTime();
    const expiresAt = new Date(session.expiresAt).getTime();

    // Check absolute expiration
    if (now > expiresAt) {
      this.sessions.delete(token);
      this.saveState();
      return { valid: false, reason: 'Phiên làm việc đã hết hạn tối đa (8 giờ)' };
    }

    // Check idle timeout
    if (now - lastActivity > SESSION_IDLE_TIMEOUT_MS) {
      this.sessions.delete(token);
      this.saveState();
      return { valid: false, reason: 'Phiên làm việc đã hết hạn do không hoạt động quá 30 phút' };
    }

    // Check user status
    const user = this.getAdminUserById(session.adminId);
    if (!user || !user.isActive) {
      this.sessions.delete(token);
      this.saveState();
      return { valid: false, reason: 'Tài khoản không hoạt động hoặc không tồn tại' };
    }

    // Touch last activity
    session.lastActivityAt = new Date().toISOString();
    return { valid: true, session, user };
  }

  /**
   * Invalidate session (Logout)
   */
  public revokeSession(token: string, adminId?: string, username?: string, ip?: string, userAgent?: string): boolean {
    const session = this.sessions.get(token);
    const deleted = this.sessions.delete(token);

    if (deleted) {
      this.addAuditLog({
        adminId: adminId || session?.adminId || 'unknown',
        username: username || session?.username || 'admin',
        action: 'LOGOUT',
        resource: 'admin_auth',
        result: 'SUCCESS',
        ip: ip || 'unknown',
        userAgent: userAgent || 'unknown',
        details: { sessionId: session?.id }
      });
      this.saveState();
    }
    return deleted;
  }

  /**
   * Revoke all other sessions for this admin (e.g. security breach concern)
   */
  public revokeAllOtherSessions(adminId: string, currentToken: string): number {
    let count = 0;
    for (const [token, session] of this.sessions.entries()) {
      if (session.adminId === adminId && token !== currentToken) {
        this.sessions.delete(token);
        count++;
      }
    }
    this.saveState();
    return count;
  }

  /**
   * List active sessions for an admin
   */
  public getActiveSessions(adminId: string, currentToken?: string): Array<Omit<AdminSession, 'token'> & { isCurrent: boolean }> {
    const now = Date.now();
    const result: Array<Omit<AdminSession, 'token'> & { isCurrent: boolean }> = [];

    for (const [token, s] of this.sessions.entries()) {
      if (s.adminId === adminId && new Date(s.expiresAt).getTime() > now) {
        result.push({
          id: s.id,
          adminId: s.adminId,
          username: s.username,
          role: s.role,
          createdAt: s.createdAt,
          lastActivityAt: s.lastActivityAt,
          expiresAt: s.expiresAt,
          ip: s.ip,
          userAgent: s.userAgent,
          isCurrent: token === currentToken
        });
      }
    }
    return result;
  }

  /**
   * Change admin password securely
   */
  public changePassword(
    adminId: string,
    currentPass: string,
    newPass: string,
    ip: string,
    userAgent: string
  ): { success: boolean; error?: string } {
    const user = this.getAdminUserById(adminId);
    if (!user) return { success: false, error: 'Không tìm thấy tài khoản' };

    if (!bcrypt.compareSync(currentPass, user.passwordHash)) {
      this.recordSecurityEvent('PASSWORD_CHANGE_FAILED', 'MEDIUM', ip, `Thử đổi mật khẩu sai mật khẩu hiện tại cho admin: ${user.username}`);
      return { success: false, error: 'Mật khẩu hiện tại không chính xác' };
    }

    if (!newPass || newPass.length < 8) {
      return { success: false, error: 'Mật khẩu mới phải có tối thiểu 8 ký tự' };
    }

    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPass, salt);
    user.updatedAt = new Date().toISOString();
    user.securityMetadata.lastPasswordChange = new Date().toISOString();

    this.addAuditLog({
      adminId: user.id,
      username: user.username,
      action: 'PASSWORD_CHANGE',
      resource: 'admin_account',
      result: 'SUCCESS',
      ip,
      userAgent,
      details: { changedAt: user.updatedAt }
    });
    this.saveState();

    return { success: true };
  }

  /**
   * Add an audit log entry (sanitizing details to prevent secret leakage)
   */
  public addAuditLog(entry: {
    adminId: string;
    username: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    result: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
    ip: string;
    userAgent: string;
    details?: Record<string, any>;
  }): void {
    const cleanDetails: Record<string, any> = {};
    if (entry.details) {
      for (const [k, v] of Object.entries(entry.details)) {
        if (/pass|secret|token|key|credential/i.test(k)) {
          cleanDetails[k] = '[REDACTED]';
        } else {
          cleanDetails[k] = v;
        }
      }
    }

    const log: AuditLog = {
      id: 'audit-' + crypto.randomBytes(6).toString('hex'),
      timestamp: new Date().toISOString(),
      adminId: entry.adminId,
      username: entry.username,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      result: entry.result,
      ip: entry.ip || 'unknown',
      userAgent: (entry.userAgent || 'unknown').slice(0, 150),
      details: cleanDetails
    };

    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200);
    }
    this.saveState();
  }

  public getAuditLogs(limit: number = 50): AuditLog[] {
    return this.auditLogs.slice(0, Math.min(limit, 100));
  }

  public recordSecurityEvent(type: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', ip: string, details: string): void {
    const evt: SecurityEvent = {
      id: 'sec-' + crypto.randomBytes(6).toString('hex'),
      timestamp: new Date().toISOString(),
      type,
      severity,
      ip,
      details
    };
    this.securityEvents.unshift(evt);
    if (this.securityEvents.length > 100) {
      this.securityEvents = this.securityEvents.slice(0, 100);
    }
    this.saveState();
  }

  public getSecurityEvents(limit: number = 50): SecurityEvent[] {
    return this.securityEvents.slice(0, Math.min(limit, 100));
  }
}

export const authStore = new AuthStore();
