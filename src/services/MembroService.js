import api from "./api";

function mapMembro(r) {
  return {
    id: r.id,
    nome: r.nome,
    bio: r.bio,
    role: r.profileType === "PROFESSOR" ? "professor" : "aluno",
    ativo: r.ativo,
    github_url: r.linkGithub,
    linkedin_url: r.linkLinkedin,
    link_lattes: r.linkLattes,
    photoUrl: r.photoUrl,
  };
}

/**
 * Busca membros paginados do laboratório.
 * @param {number} labId
 * @param {object} opts { nome?: string, page?: number, size?: number }
 * @returns {Promise<{content: any[], totalPages:number, totalElements:number, number:number, size:number}>}
 */
export async function listarMembrosLab(
  labId,
  { nome = "", page = 0, size = 12 } = {}
) {
  const params = { page, size };
  if (nome.trim()) params.nome = nome.trim();

  const { data } = await api.get(`/api/laboratorio/${labId}/members`, {
    params,
    skipAuth: true,
  });

  return {
    ...data,
    content: (data.content || []).map(mapMembro),
  };
}

/**
 * Lista candidatos (usuários que NÃO são membros) de um laboratório.
 * @param {number} labId
 * @param {Object} opts
 * @param {number} [opts.page=0]
 * @param {number} [opts.size=20]
 * @param {string} [opts.nome] - filtro de nome (opcional)
 * @returns {Promise<{content: Array, ...paginacao}>}
 */
export async function listarCandidatosLab(
  labId,
  { page = 0, size = 2, nome = "" } = {}
) {
  const params = { page, size };
  if (nome.trim()) params.nome = nome.trim();
  const { data } = await api.get(`/api/laboratorio/${labId}/candidates`, { params });
  return data; // precisa ter: content, totalPages, totalElements, number, size ...
}

/**
 * Membros administrativos (com labRole / permissões)
 * GET /api/laboratorio/{labId}/members/admin?nome=
 */
export async function listarMembrosAdmin(
  labId,
  { page = 0, size = 2, nome = '' } = {}
) {
  const params = { page, size };
  if (nome.trim()) params.nome = nome.trim();
  const { data } = await api.get(
    `/api/laboratorio/${labId}/members/admin`,
    { params }
  );
  return data;
}

/**
 * Adiciona um usuário como membro (labRole default = MEMBER no backend)
 * @param {number} labId
 * @param {number} userId
 * @returns {Promise<Object>} membro criado/atualizado (depende do backend)
 */
export async function adicionarMembroLab(labId, userId) {
  const { data } = await api.post(`/api/laboratorio/${labId}/members`, {
    userId
  });
  return data;
}

/**
 * Promove MEMBER -> ADMIN (ou reatribui ADMIN a alguém já membro)
 */
export async function promoverMembro(labId, userId) {
  await api.post(`/api/laboratorio/${labId}/members`, {
    userId,
    labRole: 'ADMIN'
  });
  return;
}

/**
 * Rebaixa ADMIN -> MEMBER
 */
export async function rebaixarMembro(labId, userId) {
  await api.post(`/api/laboratorio/${labId}/members`, {
    userId,
    labRole: 'MEMBER'
  });
  return;
}

export async function desativarMembro(labId, profileId) {
  await api.patch(`/api/laboratorio/${labId}/members/${profileId}/deactivate`);
}

export async function reativarMembro(labId, profileId) {
  await api.patch(`/api/laboratorio/${labId}/members/${profileId}/reactivate`);
}