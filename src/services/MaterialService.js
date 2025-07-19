import api from "./api"

function mapMaterial(r) {
  return {
    ...r,
    tipo: r.tipo?.toLowerCase(),
    url: r.link,
  };
}

/**
 * Retorna o objeto de página completo do backend, com content já mapeado.
 */
export async function listarMateriaisLab(
  labId,
  isAuthenticated,
  { tipo = null, nome = '', page = 0, size = 12 } = {}
) {
  const params = { page, size };
  if (tipo && tipo !== 'all') params.tipo = tipo.toUpperCase();
  if (nome.trim()) params.nome = nome.trim();

  if (isAuthenticated) {
    try {
      const { data } = await api.get(`/api/material/${labId}/private`, { params });
      return {
        ...data,
        content: (data.content || []).map(mapMaterial),
      };
    } catch (err) {
      if (err.response?.status !== 403) throw err;
    }
  }

  const { data } = await api.get(`/api/material/${labId}`, {
    params,
    skipAuth: true,
  });

  return {
    ...data,
    content: (data.content || []).map(mapMaterial),
  };
}


/**
 * Cria um novo material (público ou privado).
 * @param {number} labId
 * @param {object} payload  { titulo, descricao, url, tipo, visibilidade }
 *                          tipo:  pdf | slide | video | repositorio | link
 *                          visibilidade: PUBLICO | PRIVADO
 * @returns {Promise<object>} material já mapeado p/ o front
 */
export async function criarMaterial(labId, payload) {
  const body = {
    titulo:       payload.titulo,
    descricao:    payload.descricao,
    link:         payload.url,
    tipo:         payload.tipo.toUpperCase(),  
    visibilidade: payload.visibilidade,  
  };

  const { data } = await api.post(`/api/material/${labId}`, body);
  return mapMaterial(data);
}

/**
 * Atualiza um material existente.
 *
 * @param {number} labId
 * @param {number} materialId
 * @param {object} payload { titulo, descricao, url, tipo, visibilidade }
 */
export async function atualizarMaterial(labId, materialId, payload) {
  const body = {
    titulo:       payload.titulo,
    descricao:    payload.descricao,
    link:         payload.url,
    tipo:         payload.tipo.toUpperCase(), 
    visibilidade: payload.visibilidade,
  };

  const { data } = await api.put(
    `/api/material/${labId}/${materialId}`,
    body
  );
  return mapMaterial(data);
}