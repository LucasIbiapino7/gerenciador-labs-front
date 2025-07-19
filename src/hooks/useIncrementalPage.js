import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook para feeds paginados com append.
 * @param {function({page:number,size:number,signal?:AbortSignal}):Promise<{content:any[], totalPages:number, number:number}>} fetcher
 * @param {object} opts
 * @param {number} opts.initialSize
 * @param {any[]}  opts.deps   Dependências que resetam o feed
 * @param {boolean} opts.autoFirst  Carrega a primeira página automaticamente
 */
export function useIncrementalPage({
  fetcher,
  initialSize = 10,
  deps = [],
  autoFirst = true
}) {
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(null);

  const [loading, setLoading] = useState(false);   // <-- começa false
  const [error, setError] = useState(null);
  const [size] = useState(initialSize);

  const abortRef = useRef(null);
  const depsRef = useRef(deps);

  const loadPage = useCallback(
    async (pageToLoad, isInitial = false) => {
      if (totalPages !== null && pageToLoad >= totalPages) return;

      setLoading(true);
      setError(null);

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const data = await fetcher({
          page: pageToLoad,
          size,
          signal: controller.signal
        });
        const content = data.content || [];
        setTotalPages(data.totalPages ?? 0);
        setItems(prev =>
          pageToLoad === 0 ? content : [...prev, ...content]
        );
        setPagesLoaded(pageToLoad + 1);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error(err);
        setError('Falha ao carregar feed.');
        if (isInitial) {
          setItems([]);
          setPagesLoaded(0);
          setTotalPages(0);
        }
      } finally {
        setLoading(false);
      }
    },
    [fetcher, size, totalPages]
  );

  // Reset quando deps mudam
  useEffect(() => {
    const changed =
      deps.length !== depsRef.current.length ||
      deps.some((d, i) => d !== depsRef.current[i]);
    if (changed) {
      depsRef.current = deps;
      setPagesLoaded(0);
      setItems([]);
      setTotalPages(null);
      setError(null);
      if (autoFirst) loadPage(0, true);
    }
  }, [deps, autoFirst, loadPage]);

  // Primeira carga no mount
  useEffect(() => {
    if (autoFirst && pagesLoaded === 0) {
      loadPage(0, true);
    }
  }, [autoFirst, pagesLoaded, loadPage]);

  function loadMore() {
    loadPage(pagesLoaded);
  }

  function prependItem(item) {
    setItems(prev => [item, ...prev]);
  }

  const hasMore =
    totalPages === null ? false : pagesLoaded < totalPages;

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    prependItem,
    totalPages,
    pagesLoaded,
    size,
  };
}
