// components/Admin/AdminLabsTab.jsx
import { useEffect, useState, useCallback } from 'react';
import LabCardAdmin from './LabCardAdmin';
import {
  fetchAdminLabs,
} from '../../services/AdminLabService';

export default function AdminLabsTab({
  onOpenCreate,
  onOpenOwnerPanel,
  externalCreateTrigger, 
  setExternalCreateTrigger, 
  ownerUpdatedLabId, 
  ownerUpdatedData,  
}) {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [forbidden, setForbidden] = useState(false);

  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    last: true,
  });

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    setForbidden(false);
    try {
      const data = await fetchAdminLabs(0, pageInfo.size);
      setLabs(
        data.content.map((l) => ({
          id: l.id,
          nome: l.nome,
          descricaoCurta: l.descricaoCurta,
          owner: l.ownerId
            ? { id: l.ownerId, nome: l.ownerNome, email: l.ownerEmail }
            : null,
          totalMembros: l.totalMembros ?? 0,
        }))
      );
      setPageInfo({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        last: data.last,
      });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setForbidden(true);
        setError('Você não tem permissão para acessar esta área.');
      } else {
        setError('Falha ao carregar laboratórios.');
      }
    } finally {
      setLoading(false);
    }
  }, [pageInfo.size]);

  const loadMore = useCallback(async () => {
    if (pageInfo.last || loadingMore || forbidden || error) return;
    setLoadingMore(true);
    try {
      const nextPage = pageInfo.page + 1;
      const data = await fetchAdminLabs(nextPage, pageInfo.size);
      setLabs((prev) => [
        ...prev,
        ...data.content.map((l) => ({
          id: l.id,
          nome: l.nome,
          descricaoCurta: l.descricaoCurta,
          owner: l.ownerId
            ? { id: l.ownerId, nome: l.ownerNome, email: l.ownerEmail }
            : null,
          totalMembros: l.totalMembros ?? 0,
        })),
      ]);
      setPageInfo({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        last: data.last,
      });
    } catch (err) {
      console.error(err);
      setError('Falha ao carregar mais laboratórios.');
    } finally {
      setLoadingMore(false);
    }
  }, [pageInfo, loadingMore, forbidden, error]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  useEffect(() => {
    if (externalCreateTrigger) {
      setLabs(prev => [externalCreateTrigger, ...prev]);
      setExternalCreateTrigger(null);
    }
  }, [externalCreateTrigger, setExternalCreateTrigger]);

  useEffect(() => {
    if (ownerUpdatedLabId && ownerUpdatedData) {
      setLabs(prev =>
        prev.map(l =>
          l.id === ownerUpdatedLabId
            ? { ...l, owner: { ...ownerUpdatedData } }
            : l
        )
      );
    }
  }, [ownerUpdatedLabId, ownerUpdatedData]);

  if (forbidden) {
    return (
      <div className="py-6">
        <p className="text-sm text-red-600">
          Você não tem permissão para acessar esta área (403).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Laboratórios</h2>
        <button
          onClick={onOpenCreate}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90 disabled:opacity-50"
          disabled={loading}
        >
          Novo Laboratório
        </button>
      </div>

      {error && !loading && (
        <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && labs.length === 0 && (
        <p className="text-sm text-gray-500">Carregando laboratórios…</p>
      )}

      {!loading && !error && labs.length === 0 && (
        <p className="text-sm text-gray-500">
          Nenhum laboratório cadastrado ainda.
        </p>
      )}

      {labs.length > 0 && (
        <section className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab) => (
              <LabCardAdmin
                key={lab.id}
                lab={lab}
                onChangeOwner={() => onOpenOwnerPanel(lab)}
              />
            ))}
          </div>

          {!pageInfo.last && (
            <div className="flex justify-center pt-2">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                {loadingMore ? 'Carregando…' : 'Carregar mais'}
              </button>
            </div>
          )}

          <p className="text-center text-[11px] text-gray-400">
            Página {pageInfo.page + 1} de {pageInfo.totalPages || 1} ·{' '}
            {labs.length} labs carregados
          </p>
        </section>
      )}
    </div>
  );
}
