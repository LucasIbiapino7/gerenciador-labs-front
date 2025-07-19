import api from './api'

/**
 * Busca pesquisas de um laboratório por tipo.
 * tipos aceitos: PUBLICACAO | ORIENTACAO | PREMIO | PATENTE
 * @param {number|string} labId
 * @param {string} tipo
 * @param {number} page (0-based)
 * @param {number} size
 */
export async function listarPesquisasPorTipo(labId, tipo, page = 0, size = 20) {
  const { data } = await api.get(`/api/laboratorio/${labId}/pesquisas`, {
    params: { tipo, page, size }
  });
  return data; // Page<PesquisaDto>
}