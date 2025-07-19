import api from "./api";

/**
 * Lista posts públicos de um laboratório.
 * @param {number} labId
 * @param {number} [opts.page=0]
 * @param {number} [opts.size=10]
 *
 * @returns {Promise<{content: Array, totalPages:number, ...}>}
 */
export async function listarPostsLab(labId, { page = 0, size = 10 } = {}) {
  const { data } = await api.get(`/api/posts/${labId}`, {
    params: { page, size },
    skipAuth: true,
  });

  const adaptados = data.content.map((p) => ({
    ...p,
    resumo: p.conteudo,
    author: p.autor,
    lab: p.laboratorio,
  }));

  return { ...data, content: adaptados };
}

function mapPost(r) {
  return {
    ...r,
    resumo: r.conteudo,
    author: r.autor,
    lab:    r.laboratorio,
  };
}

/**
 * Cria post público **ou** privado.
 * @param {number}  labId
 * @param {string}  conteudo        – texto digitado
 * @param {boolean} isPrivate=false – true ⇒ rota /private
 * @param {string}  titulo=''       – opcional
 */
export async function criarPost(labId, conteudo, isPrivate = false, titulo = '') {
  const body = {
    titulo,
    conteudo,
    instante: new Date().toISOString().slice(0, 19), 
  };
  const endpoint = isPrivate
    ? `/api/posts/${labId}/private`
    : `/api/posts/${labId}`;
  const { data } = await api.post(endpoint, body);
  return mapPost(data);
}

/**
 * Lista posts privados de um laboratório (só para membros).
 * Requer access-token; o interceptor cuida do header.
 *
 * @param {number} labId
 * @param {number} [page=0]
 * @param {number} [size=10]
 */
export async function listarPostsInterno(labId, page = 0, size = 10) {
  const { data } = await api.get(`/api/posts/${labId}/interno`, {
    params: {
      page,
      size,
      visibilidade: [],  
    },
  });
  return data.content.map(mapPost);
}
