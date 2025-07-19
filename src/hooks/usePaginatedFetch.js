import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * @template T
 * @param {{
 *   fetcher: ({page:number,size:number}) => Promise<{
 *     content: T[],
 *     totalPages: number,
 *     totalElements: number,
 *     number: number,
 *     size: number
 *   }>,
 *   initialPage?: number,
 *   initialSize?: number,
 *   deps?: any[],
 *   auto?: boolean
 * }} params
 */
export function usePaginatedFetch({
  fetcher,
  initialPage = 0,
  initialSize = 20,
  deps = [],
  auto = true
}) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const depsRef = useRef(deps);
  const abortRef = useRef(null);
  const lastLoadIdRef = useRef(0);

  useEffect(() => {
    const changed =
      deps.length !== depsRef.current.length ||
      deps.some((d, i) => d !== depsRef.current[i]);

    if (changed) {
      depsRef.current = deps;
      setPage(0);
    }
  }, [deps]);

  const load = useCallback(
    async ({ currentPage = page, currentSize = size, silent = false } = {}) => {
      if (!auto) return;
      const loadId = ++lastLoadIdRef.current;

      if (!silent) {
        setLoading(true);
        setError(null);
      }

      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const data = await fetcher({ page: currentPage, size: currentSize, signal: controller.signal });
        if (loadId !== lastLoadIdRef.current) return;

        setItems(data.content || []);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? (data.content?.length || 0));
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error(err);
        setError('Falha ao carregar dados.');
      } finally {
        if (loadId === lastLoadIdRef.current) {
          setLoading(false);
        }
      }
    },
    [fetcher, page, size, auto]
  );

  useEffect(() => {
    if (!auto) return;
    load({ currentPage: page, currentSize: size });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, fetcher, auto]); 

  function reload({ silent = false } = {}) {
    load({ currentPage: page, currentSize: size, silent });
  }

  function _setSize(newSize) {
    setSize(newSize);
    setPage(0); 
  }

  return {
    items,
    page,
    size,
    totalPages,
    totalElements,
    loading,
    error,
    setPage,
    setSize: _setSize,
    reload,
  };
}
