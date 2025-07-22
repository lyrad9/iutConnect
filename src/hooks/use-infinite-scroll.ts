"use client";

import { useRef, useEffect, useCallback } from "react";

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
  scrollContainer?: Element | null;
}

/**
 * Hook pour implémenter facilement un scroll infini
 * @param options - Options de configuration
 * @returns Ref à attacher à l'élément observé
 */
export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  rootMargin = "200px",
  threshold = 0.1,
  scrollContainer = null,
}: UseInfiniteScrollOptions) {
  // Référence à l'élément qui sera observé
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Callback de l'observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    // Sauvegarder une référence à l'élément actuel
    const element = observerRef.current;

    // Ne pas initialiser l'observer si on est déjà en train de charger
    // ou s'il n'y a plus rien à charger
    if (!element || loading || !hasMore) return;

    // Créer l'observer avec les options fournies
    const observer = new IntersectionObserver(handleObserver, {
      root: scrollContainer,
      rootMargin,
      threshold,
    });

    observer.observe(element);

    // Nettoyage de l'observer lors du démontage
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [
    handleObserver,
    hasMore,
    loading,
    rootMargin,
    scrollContainer,
    threshold,
  ]);

  return observerRef;
}
