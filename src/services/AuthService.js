import api from "./api";

/**
 * Registra um novo usuário.
 * Backend espera: { name, email, password }
 * Pode retornar:
 *  - 201/200 sucesso (sem body ou com body)
 *  - 400: { timestamp,status,error,path,message } (para EmailException -> "Invalid Email!")
 *  - 422: { errors: [{ fieldName, message }, ...] }
 */
const AUTH_BASE = import.meta.env.VITE_AUTH_URL;

export async function registerUser({ nome, email, password }) {
  const payload = {
    name: nome?.trim(),
    email: email?.trim().toLowerCase(),
    password,
  };
  const { data } = await api.post(
    `${AUTH_BASE}/auth/register`,
    payload,
    { skipAuth: true }
  );
  return data;
}
