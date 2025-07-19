import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { listarPesquisasPorTipo } from '../services/PesquisaService';

import PesquisaPublicacaoCard from '../components/Pesquisa/PesquisaPublicacaoCard';
import PesquisaOrientacaoCard from '../components/Pesquisa/PesquisaOrientacaoCard';
import PesquisaPremioCard from '../components/Pesquisa/PesquisaPremioCard';
import PesquisaPatenteCard from '../components/Pesquisa/PesquisaPatenteCard';

const TIPOS = [
  { key: 'PUBLICACAO', label: 'Publicações' },
  { key: 'ORIENTACAO', label: 'Orientações' },
  { key: 'PREMIO', label: 'Prêmios' },
  { key: 'PATENTE', label: 'Patentes' }
];

const PAGE_SIZE = 20;

export default function LabPesquisas() {
  const { labId } = useOutletContext() || {};

  const [activeTipo, setActiveTipo] = useState('PUBLICACAO');

  const [estado, setEstado] = useState(() =>
    TIPOS.reduce((acc, t) => {
      acc[t.key] = {
        items: [],
        page: 0,
        totalPages: 0,
        loading: false,
        error: null,
        firstLoad: false
      };
      return acc;
    }, {})
  );

  function atualizar(tipo, patch) {
    setEstado(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], ...patch }
    }));
  }

  async function carregar(tipo, reset = false) {
    if (!labId) return;
    const st = estado[tipo];
    if (st.loading) return;

    const nextPage = reset ? 0 : st.page;

    atualizar(tipo, { loading: true, error: null });

    try {
      const data = await listarPesquisasPorTipo(labId, tipo, nextPage, PAGE_SIZE);
      const newItems = reset ? data.content : [...st.items, ...data.content];
      atualizar(tipo, {
        items: newItems,
        page: nextPage + 1,
        totalPages: data.totalPages,
        loading: false,
        error: null,
        firstLoad: true
      });
    } catch (err) {
      const stCode = err.response?.status;
      let msg = 'Falha ao carregar.';
      if (stCode === 404) msg = 'Laboratório ou tipo não encontrado.';
      atualizar(tipo, { loading: false, error: msg, firstLoad: true });
    }
  }

  useEffect(() => {
    const st = estado[activeTipo];
    if (!st.firstLoad) {
      carregar(activeTipo, true);
    }
  }, [activeTipo]); // eslint-disable-line

  function handleRetry(tipo) {
    carregar(tipo, true);
  }

  function handleLoadMore(tipo) {
    const st = estado[tipo];
    if (st.page < st.totalPages) {
      carregar(tipo, false);
    }
  }

  function renderCard(tipo, item) {
    switch (tipo) {
      case 'PUBLICACAO':
        return <PesquisaPublicacaoCard key={item.id} item={item} />;
      case 'ORIENTACAO':
        return <PesquisaOrientacaoCard key={item.id} item={item} />;
      case 'PREMIO':
        return <PesquisaPremioCard key={item.id} item={item} />;
      case 'PATENTE':
        return <PesquisaPatenteCard key={item.id} item={item} />;
      default:
        return null;
    }
  }

  const { items, loading, error, page, totalPages, firstLoad } = estado[activeTipo];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-4">
          Pesquisas do Laboratório
        </h1>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map(t => {
            const isActive = t.key === activeTipo;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTipo(t.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition
                  ${
                    isActive
                      ? 'bg-primary text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <section className="space-y-6">
        {loading && items.length === 0 && (
          <p className="text-sm text-gray-600">Carregando {activeTipo.toLowerCase()}…</p>
        )}
        {error && items.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => handleRetry(activeTipo)}
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Tentar novamente
            </button>
          </div>
        )}
        {!loading && !error && firstLoad && items.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhum resultado para este tipo.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map(it => renderCard(activeTipo, it))}
        </div>
        {items.length > 0 && page < totalPages && (
          <div className="pt-2">
            <button
              onClick={() => handleLoadMore(activeTipo)}
              disabled={loading}
              className="rounded bg-primary px-5 py-2 text-sm font-medium text-white shadow hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? 'Carregando…' : 'Carregar mais'}
            </button>
          </div>
        )}

        {loading && items.length > 0 && (
          <p className="text-xs text-gray-400">Carregando mais…</p>
        )}
      </section>
    </div>
  );
}
