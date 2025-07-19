import api from "./api"

function mapEvento(r) {
  return {
    ...r,
    resumo: r.descricao,
    instante: r.dataEvento,
    author: r.author, 
    lab: r.lab,
  };
}

/**
 * Retorna a lista de próximos eventos de um laboratório.
 * Endpoint é público;
 * @param {number} labId
 * @returns {Promise<Array>} [{ id, titulo, dataEvento, local }]
 */
export async function listarEventosProximos(labId) {
  const { data } = await api.get(`/api/evento/${labId}/next`, {
    skipAuth: true,
  });
  return data;
}

/**
 * Lista completa de eventos (paginada).
 * Adapta campos para o EventCard: descricao→resumo, dataEvento→instante.
 */
export async function listarEventosLab(labId, { page = 0, size = 10 } = {}) {
  const { data } = await api.get(`/api/evento/${labId}`, {
    params: { page, size },
    skipAuth: true,
  });

  const adaptados = data.content.map((e) => ({
    ...e,
    resumo: e.descricao,   
    instante: e.dataEvento,   
  }));

  return { ...data, content: adaptados };
}

export async function criarEvento(labId, payload) {
  const body = {
    titulo: payload.titulo,
    descricao: payload.descricao,
    dataEvento: payload.dataEvento,
    local: payload.local,
  };

  console.log('Body enviado ao backend:', body);

  const { data } = await api.post(`/api/evento/${labId}`, body);
  return mapEvento(data);
}

export async function atualizarEvento(labId, eventId, payload) {
  const { data } = await api.put(
    `/api/evento/${labId}/${eventId}`,
    payload
  );
  return mapEvento(data);
}