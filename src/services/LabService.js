import api from "./api"
import { buildFileUrl } from '../utils/imageUrl';

/**
 * Busca laboratórios paginados.
 * @param {Object} options
 * @param {number} [options.page=0]
 * @param {number} [options.size=9]
 * @returns {Promise<{content: Array, pageable: Object, totalPages: number, ...}>}
 */
export async function listarLabs({ page = 0, size = 9 } = {}) {
  const { data } = await api.get('/api/laboratorio', {
    params: { page, size },
    skipAuth: true, // endpoint público
  });

  const mapped = {
    ...data,
    content: (data.content || []).map(lab => ({
      ...lab,
      logoUrl: buildFileUrl(lab.logoUrl), // agora sempre URL absoluta (ou string vazia)
    })),
  };

  return mapped;
}

const gradientMap = {
  CYAN:  'from-cyan-500 to-blue-500',
  GREEN: 'from-emerald-500 to-emerald-700',
  AMBER: 'from-amber-400 to-amber-600',
  ROSE:  'from-rose-500 to-pink-600',
};

export async function getLabSummary(labId, isAuthenticated) {
  const { data } = await api.get(`/api/laboratorio/${labId}/summary`, {
    skipAuth: !isAuthenticated,
  });

  return {
    ...data,
    bannerGradientClass: gradientMap[data.bannerGradient] || 'from-gray-600 to-gray-400',
  };
}


export async function obterLabAdmin(labId) {
  const { data } = await api.get(`/api/laboratorio/${labId}`);
  return {
    ...data,
    bannerGradient: gradientMap[data.gradientAccent] || 'from-gray-500 to-gray-400',
  };
}

/**
 * Atualiza informações do laboratório
 * @param {number} labId
 * @param {{ nome:string, descricaoCurta:string, descricaoLonga:string, gradientAccent:string }} payload
 * @returns {Promise<Object>} 
 */
export async function updateLabInfo(labId, payload) {
  const body = {
    nome: payload.nome?.trim(),
    descricaoCurta: payload.descricaoCurta?.trim(),
    descricaoLonga: payload.descricaoLonga?.trim(),
    gradientAccent: payload.gradientAccent,
  };

  if (!body.nome || !body.descricaoCurta || !body.descricaoLonga) {
    throw new Error('Campos obrigatórios vazios.');
  }

  const { data } = await api.put(`/api/laboratorio/${labId}`, body);
  return data; 
}

/**
 * Upload da logo do laboratório.
 * @param {number|string} labId
 * @param {File} file
 * @returns {Promise<{ fileName: string, url: string }>}
 */
export async function uploadLabLogo(labId, file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/api/files/upload/${labId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}
