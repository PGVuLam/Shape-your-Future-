export type AdminRole = 'ADMIN';

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  securityMetadata: {
    lastPasswordChange: string;
    loginCount: number;
    lastFailedLoginAt?: string;
  };
}

export interface AdminSession {
  id: string;
  token: string;
  adminId: string;
  username: string;
  role: AdminRole;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
  ip: string;
  userAgent: string;
}

export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'ACCOUNT_LOCKED'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'DATA_UPDATE_TRIGGERED'
  | 'DATA_APPROVE'
  | 'DATA_REJECT'
  | 'DATA_PUBLISH'
  | 'DATA_ROLLBACK'
  | 'SOURCE_TOGGLE'
  | 'SOURCE_RESET'
  | 'AI_CONFIG_CHANGE'
  | 'SESSION_REVOKED'
  | 'ALL_OTHER_SESSIONS_REVOKED';

export interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  username: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  result: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  ip: string;
  userAgent: string;
  details: Record<string, any>;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ip: string;
  details: string;
}

export interface ServerAIConfig {
  provider: 'gemini' | 'groq' | 'custom' | 'local';
  modelName: string;
  customEndpoint?: string;
  temperature: number;
  systemPromptStyle: 'strategic' | 'empathetic' | 'analytical' | 'balanced';
  safeOutputTokens: number;
  fallbackEnabled: boolean;
  updatedAt: string;
  updatedBy: string;
}
