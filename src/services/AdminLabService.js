import api from "./api"

/**
 * Busca labs admin (paginado)
 * @param {number} page
 * @param {number} size
 * @returns {Promise<Page>}
 */
export async function fetchAdminLabs(page = 0, size = 12) {
  const { data } = await api.get('/api/admin/labs', {
    params: { page, size }
  });
  return data;
}

/**
 * Cria laboratório (rota pública/admin: POST /api/laboratorio)
 * Body esperado: { nome, descricaoCurta }
 * Retorno: LaboratorioInfosDto (contém id, nome, descricaoCurta, etc.)
 */
export async function createLaboratorio({ nome, descricaoCurta }) {
  const { data } = await api.post('/api/laboratorio', {
    nome,
    descricaoCurta
  });
  return data;
}

/**
 * Define / troca owner (usa seu endpoint existente)
 */
export async function setLabOwner(labId, profileId) {
  await api.patch(`/api/admin/labs/${labId}/members/${profileId}`);
}

/**
 * Busca usuários (profiles) para seleção de owner.
 * Backend: GET /api/profile?nome=&page=&size=
 * Retorna Page<ProfileMinDto>
 */
export async function searchProfiles({ nome = '', page = 0, size = 8 }) {
  const { data } = await api.get('/api/profile', {
    params: { nome, page, size }
  });
  return data; // page structure
}

/**
 * Define / troca owner do laboratório.
 * Backend: PATCH /api/laboratorio/{labId}/members/{profileId}
 */
export async function patchLabOwner(labId, profileId) {
  await api.patch(`/api/laboratorio/${labId}/members/${profileId}`);
}

export async function updateProfileType(profileId, newType) {
  const { data } = await api.put(`/api/admin/profiles/${profileId}/type`, {
    profileType: newType
  });
  return data; 
}