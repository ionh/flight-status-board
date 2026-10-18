import { useCallback, useEffect, useReducer, useRef } from 'react';
import { fetchPosts } from '../api/fetchPosts';
import { mapPostsToFlights } from '../domain/mapPostsToFlights';
import {
  fetchFailed,
  fetchStarted,
  fetchSucceeded,
  flightsReducer,
  getDataStatus,
  initialFlightsState,
} from '../state/flightsReducer';

const AUTO_REFRESH_INTERVAL_MS = 30000;

export const useFlights = () => {
  const [state, dispatch] = useReducer(flightsReducer, initialFlightsState);
  const abortControllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    dispatch(fetchStarted());

    try {
      const posts = await fetchPosts(controller.signal);
      dispatch(fetchSucceeded(mapPostsToFlights(posts)));
    } catch {
      if (controller.signal.aborted) {
        return;
      }
      dispatch(fetchFailed());
    }
  }, []);

  useEffect(() => {
    refresh();

    const intervalId = setInterval(() => {
      refresh();
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      abortControllerRef.current?.abort();
    };
  }, [refresh]);

  return {
    status: getDataStatus(state),
    flights: state.flights ?? [],
    lastUpdatedAt: state.lastUpdatedAt,
    isRefreshing: state.isFetching && state.flights !== null,
    refresh,
  };
};
