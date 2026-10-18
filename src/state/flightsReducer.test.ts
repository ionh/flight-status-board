import { describe, expect, it } from 'vitest';
import { FlightStatusEnum, type Flight } from '../domain/flight.types';
import {
  DataStatusEnum,
  fetchFailed,
  fetchStarted,
  fetchSucceeded,
  flightsReducer,
  getDataStatus,
  initialFlightsState,
} from './flightsReducer';

const FLIGHTS: Flight[] = [
  {
    id: 1,
    flightNumber: 'FL-1',
    destination: 'Sunt aut',
    status: FlightStatusEnum.OnTime,
    gate: 'B3',
    terminal: 1,
    departureTime: '03:05',
  },
];

const FIRST_UPDATE = new Date('2026-01-01T10:00:00');
const SECOND_UPDATE = new Date('2026-01-01T10:00:30');

describe('flightsReducer', () => {
  it('should start in initial loading, with no flights', () => {
    const state = initialFlightsState;

    expect(getDataStatus(state)).toBe(DataStatusEnum.InitialLoading);
    expect(state.flights).toBeNull();
  });

  it('should show the flights and the update time after the first successful fetch', () => {
    let state = flightsReducer(initialFlightsState, fetchStarted());
    state = flightsReducer(state, fetchSucceeded(FLIGHTS, FIRST_UPDATE));

    expect(getDataStatus(state)).toBe(DataStatusEnum.Fresh);
    expect(state.flights).toBe(FLIGHTS);
    expect(state.lastUpdatedAt).toBe(FIRST_UPDATE);
  });

  it('should be an initial error when the first fetch fails', () => {
    let state = flightsReducer(initialFlightsState, fetchStarted());
    state = flightsReducer(state, fetchFailed());

    expect(getDataStatus(state)).toBe(DataStatusEnum.InitialError);
  });

  it('should go back to initial loading when retrying after an initial error', () => {
    let state = flightsReducer(initialFlightsState, fetchStarted());
    state = flightsReducer(state, fetchFailed());
    state = flightsReducer(state, fetchStarted());

    expect(getDataStatus(state)).toBe(DataStatusEnum.InitialLoading);
  });

  it('should keep the previous flights while a background refresh is running', () => {
    let state = flightsReducer(initialFlightsState, fetchStarted());
    state = flightsReducer(state, fetchSucceeded(FLIGHTS, FIRST_UPDATE));
    state = flightsReducer(state, fetchStarted());

    expect(getDataStatus(state)).toBe(DataStatusEnum.Fresh);
    expect(state.isFetching).toBe(true);
    expect(state.flights).toBe(FLIGHTS);
  });

  it('should keep the last good data and become stale when a refresh fails', () => {
    let state = flightsReducer(initialFlightsState, fetchStarted());
    state = flightsReducer(state, fetchSucceeded(FLIGHTS, FIRST_UPDATE));
    state = flightsReducer(state, fetchStarted());
    state = flightsReducer(state, fetchFailed());

    expect(getDataStatus(state)).toBe(DataStatusEnum.Stale);
    expect(state.flights).toBe(FLIGHTS);
    expect(state.lastUpdatedAt).toBe(FIRST_UPDATE);
  });

  it('should become fresh again when a refresh succeeds after a failure', () => {
    let state = flightsReducer(initialFlightsState, fetchStarted());
    state = flightsReducer(state, fetchSucceeded(FLIGHTS, FIRST_UPDATE));
    state = flightsReducer(state, fetchStarted());
    state = flightsReducer(state, fetchFailed());
    state = flightsReducer(state, fetchStarted());
    state = flightsReducer(state, fetchSucceeded(FLIGHTS, SECOND_UPDATE));

    expect(getDataStatus(state)).toBe(DataStatusEnum.Fresh);
    expect(state.lastUpdatedAt).toBe(SECOND_UPDATE);
  });
});
