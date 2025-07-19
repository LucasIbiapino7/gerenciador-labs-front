import React, { createContext, useContext, useEffect, useState, useMemo
} from 'react';
import { UserManager, WebStorageStateStore, Log
} from 'oidc-client-ts';
import { decodeJwt } from '../utils/jwt';

const {
  VITE_AUTH_URL,
  VITE_CLIENT_ID,
  VITE_REDIRECT_URI,
  VITE_POST_LOGOUT_URI,
  VITE_SCOPE,
} = import.meta.env;

export const oidcConfig = {
  authority: VITE_AUTH_URL,
  client_id: VITE_CLIENT_ID,
  redirect_uri: VITE_REDIRECT_URI,
  post_logout_redirect_uri: VITE_POST_LOGOUT_URI,
  response_type: 'code',
  scope: VITE_SCOPE || 'openid profile',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  filterProtocolClaims: true,
};

Log.setLogger(console);
Log.setLevel(Log.INFO);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userManager] = useState(() => new UserManager(oidcConfig));
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);

  // Carrega usuario inicial e escuta eventos
  useEffect(() => {
    userManager
      .getUser()
      .then(setUser)
      .catch(console.error);

    const onUserLoaded = (u) => setUser(u);
    const onUserUnloaded = () => setUser(null);

    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addUserUnloaded(onUserUnloaded);

    return () => {
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserUnloaded(onUserUnloaded);
    };
  }, [userManager]);

  // Extrai roles (authorities) do access_token sempre que user muda
  useEffect(() => {
    if (!user?.access_token) {
      setRoles([]);
      return;
    }
    const payload = decodeJwt(user.access_token);
    const extracted =
      Array.isArray(payload?.authorities)
        ? payload.authorities
        : Array.isArray(payload?.roles)
          ? payload.roles
          : [];
    setRoles(extracted);
  }, [user]);

  const login = () => userManager.signinRedirect();
  const logout = () => userManager.signoutRedirect();

  const hasRole = (role) => roles.includes(role);
  const isSuperAdmin = hasRole('ROLE_ADMIN');

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      userManager,
      roles,
      hasRole,
      isSuperAdmin,
    }),
    [user, roles, isSuperAdmin]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
