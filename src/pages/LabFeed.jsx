import { useOutletContext } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import EventosPreview from "../components/Feed/EventosPreview";
import PostCard from "../components/Feed/PostCard";
import PostSubmit from "../components/Feed/PostSubmit";

import { listarPostsLab } from '../services/PostService';
import { listarEventosProximos } from '../services/EventsService';

import { useIncrementalPage } from '../hooks/useIncrementalPage';

export default function LabFeed() {
  const { labId, member } = useOutletContext();

  const [eventos, setEventos] = useState([]);
  const [eventosError, setEventosError] = useState(null);
  const [eventosLoading, setEventosLoading] = useState(true);

  // Fetcher memoizado para posts
  const postsFetcher = useMemo(
    () => async ({ page, size, signal }) =>
      listarPostsLab(labId, { page, size, signal }),
    [labId]
  );

  const {
    items: posts,
    loading: postsLoading,
    error: postsError,
    hasMore,
    loadMore,
    prependItem,
    totalPages,
    pagesLoaded,
    size,
  } = useIncrementalPage({
    fetcher: postsFetcher,
    initialSize: 10,
    deps: [labId],
    autoFirst: true
  });

  useEffect(() => {
    setEventosLoading(true);
    setEventosError(null);
    listarEventosProximos(labId)
      .then(setEventos)
      .catch(err => {
        console.error(err);
        setEventosError('Falha ao carregar eventos.');
      })
      .finally(() => setEventosLoading(false));
  }, [labId]);

  function handlePostCreated(novo) {
    prependItem(novo); // insere no topo
  }

  const loadingInitial = postsLoading && posts.length === 0;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-3">
      <div className="space-y-4">
        {eventosLoading && <p className="text-sm text-gray-500">Carregando eventos…</p>}
        {eventosError && (
          <p className="text-sm text-red-600">{eventosError}</p>
        )}
        {!eventosLoading && !eventosError && (
          <EventosPreview eventos={eventos.slice(0, 5)} />
        )}
      </div>

      <section className="space-y-6 lg:col-span-2">
        {member && (
          <PostSubmit labId={labId} onCreated={handlePostCreated} />
        )}

        {loadingInitial && <p>Carregando posts…</p>}
        {postsError && !loadingInitial && (
          <p className="text-red-600">Não foi possível carregar o feed.</p>
        )}

        {!loadingInitial && !postsError && posts.length === 0 && (
          <p className="text-sm text-gray-500">Nenhum post ainda.</p>
        )}

        {posts.map(p => (
          <PostCard key={p.id} item={p} />
        ))}

        {/* Botão Carregar mais */}
        {hasMore && !loadingInitial && (
          <div className="flex justify-center pt-2">
            <button
              onClick={loadMore}
              disabled={postsLoading}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {postsLoading ? 'Carregando…' : 'Carregar mais'}
            </button>
          </div>
        )}

        {totalPages !== null && totalPages > 1 && (
          <p className="text-center text-xs text-gray-400">
            Página {pagesLoaded} de {totalPages} · {posts.length} posts carregados (tamanho página {size})
          </p>
        )}
      </section>
    </div>
  );
}
