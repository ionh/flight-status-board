// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RawPost } from '../api/fetchPosts';
import { DataStatusEnum } from '../state/flightsReducer';
import { useFlights } from './useFlights';

type PendingRequest = {
  signal: AbortSignal;
  respond: (posts: RawPost[]) => void;
  fail: () => void;
};

let requests: PendingRequest[] = [];

// Fake fetch: every call waits until the test answers it, and rejects when aborted (like the real one)
const fakeFetch = (_url: string, init: RequestInit) => {
  return new Promise((resolve, reject) => {
    const signal = init.signal as AbortSignal;

    signal.addEventListener('abort', () => {
      reject(new Error('The request was aborted'));
    });

    requests.push({
      signal,
      respond: (posts) => resolve({ ok: true, json: async () => posts }),
      fail: () => resolve({ ok: false, status: 500 }),
    });
  });
};

const makePosts = (count: number): RawPost[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    userId: 1,
    title: 'sunt aut facere',
    body: 'irrelevant',
  }));
};

describe('useFlights', () => {
  beforeEach(() => {
    requests = [];
    vi.stubGlobal('fetch', fakeFetch);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should load the flights when it mounts', async () => {
    const { result } = renderHook(() => useFlights());

    expect(result.current.status).toBe(DataStatusEnum.InitialLoading);

    act(() => requests[0].respond(makePosts(3)));

    await waitFor(() => expect(result.current.status).toBe(DataStatusEnum.Fresh));
    expect(result.current.flights).toHaveLength(3);
  });

  it('should cancel the previous request when a new refresh starts, without showing an error', async () => {
    const { result } = renderHook(() => useFlights());

    // async act waits until the aborted request has finished rejecting
    await act(async () => {
      result.current.refresh();
    });

    expect(requests).toHaveLength(2);
    expect(requests[0].signal.aborted).toBe(true);
    expect(result.current.status).toBe(DataStatusEnum.InitialLoading);

    act(() => requests[1].respond(makePosts(5)));

    await waitFor(() => expect(result.current.status).toBe(DataStatusEnum.Fresh));
    expect(result.current.flights).toHaveLength(5);
  });

  it('should keep the flights while refreshing and become stale when the refresh fails', async () => {
    const { result } = renderHook(() => useFlights());

    act(() => requests[0].respond(makePosts(3)));
    await waitFor(() => expect(result.current.status).toBe(DataStatusEnum.Fresh));
    expect(result.current.isRefreshing).toBe(false);

    act(() => {
      result.current.refresh();
    });

    expect(result.current.isRefreshing).toBe(true);
    expect(result.current.flights).toHaveLength(3);

    act(() => requests[1].fail());

    await waitFor(() => expect(result.current.status).toBe(DataStatusEnum.Stale));
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.flights).toHaveLength(3);
  });

  it('should refresh automatically every 30 seconds', () => {
    vi.useFakeTimers();
    renderHook(() => useFlights());

    expect(requests).toHaveLength(1);

    act(() => vi.advanceTimersByTime(30000));

    expect(requests).toHaveLength(2);
  });

  it('should stop refreshing and cancel pending requests on unmount', () => {
    vi.useFakeTimers();
    const { unmount } = renderHook(() => useFlights());

    unmount();

    expect(requests[0].signal.aborted).toBe(true);

    act(() => vi.advanceTimersByTime(30000));

    expect(requests).toHaveLength(1);
  });
});
