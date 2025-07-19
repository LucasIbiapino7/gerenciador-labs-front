import api from "./api"

/**
 * Retorna o perfil do usuário logado.
 * GET /api/profile/me
 */
export async function getMeuPerfil() {
  const { data } = await api.get('/api/profile/me');
  return data; // { id, nome, bio, linkLattes, linkGithub, linkLinkedin, idLattes, photoUrl, profileType }
}

/**
 * PUT /api/profile
 * Body aceito pelo backend:
 * { nome, bio, idLattes, linkLattes, linkGithub, linkLinkedin }
 */
export async function updateMeuPerfil(payload) {
  const body = {
    nome: payload.nome?.trim(),
    bio: payload.bio?.trim() || "",
    idLattes: payload.idLattes ?? "",
    linkLattes: payload.linkLattes?.trim() || "",
    linkGithub: payload.linkGithub?.trim() || "",
    linkLinkedin: payload.linkLinkedin?.trim() || ""
  };

  const { data } = await api.put('/api/profile', body);
  return data;
}

/** Perfil público (não precisa de token) */
export async function getPerfilPublico(userId) {
  const { data } = await api.get(`/api/profile/${userId}`, {
    skipAuth: true,
  });
  return data;
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data; // { fileName, url? }
}