import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserManager, WebStorageStateStore, Log,} from 'oidc-client-ts';

const {
  VITE_AUTH_URL,
  VITE_CLIENT_ID,
  VITE_REDIRECT_URI,
  VITE_POST_LOGOUT_URI,
  VITE_SCOPE,
} = import.meta.env;

const oidcConfig = {
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

  useEffect(() => {
    userManager.getUser().then(setUser).catch(console.error);

    const onUserLoaded   = (u) => setUser(u);
    const onUserUnloaded = () => setUser(null);

    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addUserUnloaded(onUserUnloaded);

    return () => {
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserUnloaded(onUserUnloaded);
    };
  }, [userManager]);

  const login  = () => userManager.signinRedirect();
  const logout = () => userManager.signoutRedirect();

  const value = {
    user,       
    isAuthenticated: !!user,
    login,
    logout,
    userManager,    
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth must be used within <AuthProvider>');
  return contexto;
}
