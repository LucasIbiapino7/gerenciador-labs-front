import api from './api';
import { parseISO } from 'date-fns';

/**
 * Busca o feed global (posts + eventos).
 * A rota não exige autenticação → skipAuth: true
 * @returns {Promise<Array>}  Array de itens já ordenados pelo backend
 */
export async function buscarFeedGlobal() {
  const { data } = await api.get('/api/feed', { skipAuth: true });
  return data.map((raw) => ({
    ...raw,
    instante: parseISO(raw.instante),
  }));
}
