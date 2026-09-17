import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AdminProfile {
  id: string;
  username: string;
  email?: string;
  role: 'ADMIN';
  lastLoginAt: string | null;
  createdAt: string;
  lastPasswordChange?: string;
}

interface AdminAuthContextType {
  adminUser: AdminProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string; locked?: boolean }>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'edupath_admin_session_token';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [adminUser, setAdminUser] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authenticated fetch helper that appends Bearer token and checks expiration
  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(options.headers || {});
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      const res = await fetch(url, { ...options, headers });

      if (res.status === 401) {
        // Session expired or invalid on server
        setToken(null);
        setAdminUser(null);
        try {
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        } catch (_) {}
      }

      return res;
    },
    [token]
  );

  // Validate active session with backend on load or when token changes
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      if (!token) {
        setIsLoading(false);
        setAdminUser(null);
        return;
      }

      try {
        const res = await fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setAdminUser(data.user);
          }
        } else {
          // Token invalid or expired
          if (isMounted) {
            setToken(null);
            setAdminUser(null);
            try {
              sessionStorage.removeItem(TOKEN_STORAGE_KEY);
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('[ADMIN_AUTH] Session verification error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Login handler
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return {
          success: false,
          error: data.error || 'Thông tin đăng nhập không hợp lệ.',
          locked: data.locked
        };
      }

      // Valid credentials
      setToken(data.token);
      setAdminUser(data.user);
      try {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      } catch (_) {}

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: 'Không thể kết nối tới máy chủ xác thực.' };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (_) {
    } finally {
      setToken(null);
      setAdminUser(null);
      try {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      } catch (_) {}
    }
  };

  // Change password handler
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const res = await fetchWithAuth('/api/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Đổi mật khẩu thất bại.' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Lỗi mạng khi đổi mật khẩu.' };
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated: Boolean(adminUser && token && adminUser.role === 'ADMIN'),
        isLoading,
        login,
        logout,
        changePassword,
        fetchWithAuth
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
