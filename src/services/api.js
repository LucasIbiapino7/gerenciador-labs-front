import axios from "axios";
import { UserManager } from "oidc-client-ts";
import {oidcConfig} from "../contexts/AuthContext"

// Instancia do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

// UserManager - reusa o mesmo config
const userManager = new UserManager(oidcConfig);

// interceptor de requisição: adiciona o access-token,
//      exceto se  marcar { skipAuth:true }
api.interceptors.request.use(async (config) => {
  if (config.skipAuth) {
    return config; // endpoint público?
    }                
  const user = await userManager.getUser();// lido do localStorage
  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

// Interceptor de resposta: se chegar 401, tenta renovar
// silenciosamente UMA vez; se falhar, faz logout.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (!response) return Promise.reject(error);// erro de rede?

    const is401 = response.status === 401;
    if (!is401 || config._retry) return Promise.reject(error);

    config._retry = true;// evita loop infinito

    try {
      // ---------- Silent renew ----------
      await userManager.signinSilent();// faz Code+PKCE c/ prompt=none
      const newUser = await userManager.getUser();
      if (newUser?.access_token) {
        config.headers.Authorization = `Bearer ${newUser.access_token}`;
        return api(config); // repete a requisição
      }
    } catch (renewErr) {
      //Silent renew falhou
      await userManager.removeUser();// limpa o storage
      window.location.assign('/');// força novo login
      return Promise.reject(renewErr);
    }
  }
);

export default api; 