import { describe, expect, it } from 'vitest';
import type { RawPost } from '../api/fetchPosts';
import { FlightStatusEnum } from './flight.types';
import { mapPostsToFlights } from './mapPostsToFlights';

const makePost = (overrides: Partial<RawPost> = {}): RawPost => ({
  id: 1,
  userId: 1,
  title: 'sunt aut facere repellat',
  body: 'irrelevant',
  ...overrides,
});

// Same shape as the real API: 100 posts, userId 1–10
const makeApiResponse = (): RawPost[] =>
  Array.from({ length: 100 }, (_, index) =>
    makePost({ id: index + 1, userId: Math.floor(index / 10) + 1 }),
  );

describe('mapPostsToFlights', () => {
  it('should map the fields that come straight from the API', () => {
    const [flight] = mapPostsToFlights([
      makePost({ id: 42, userId: 3, title: 'qui est esse dolor' }),
    ]);

    expect(flight.id).toBe(42);
    expect(flight.flightNumber).toBe('FL-42');
    expect(flight.terminal).toBe(3);
    expect(flight.destination).toBe('Qui est');
  });

  it('should build the destination from the first two words, ignoring extra whitespace', () => {
    const [flight] = mapPostsToFlights([makePost({ title: '  ea   molestias\nquasi  ' })]);

    expect(flight.destination).toBe('Ea molestias');
  });

  it('should return the same flights every time for the same input data', () => {
    const firstResponse = mapPostsToFlights(makeApiResponse());
    const secondResponse = mapPostsToFlights(makeApiResponse());

    expect(secondResponse).toEqual(firstResponse);
  });

  it('should derive a valid status, gate and departure time for every flight', () => {
    const flights = mapPostsToFlights(makeApiResponse());

    for (const flight of flights) {
      expect(Object.values(FlightStatusEnum)).toContain(flight.status);
      expect(flight.gate).toMatch(/^[A-C][1-5]$/); // A1 – C5
      expect(flight.departureTime).toMatch(/^([01]\d|2[0-3]):[0-5][05]$/); // 00:00 – 23:55
    }
  });
});
