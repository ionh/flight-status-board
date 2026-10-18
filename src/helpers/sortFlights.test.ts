import { describe, expect, it } from 'vitest';
import { FlightStatusEnum, type Flight } from '../domain/flight.types';
import { sortByDepartureTime } from './sortFlights';

const makeFlight = (overrides: Partial<Flight> = {}): Flight => ({
  id: 1,
  flightNumber: 'FL-1',
  destination: 'Sunt aut',
  status: FlightStatusEnum.OnTime,
  gate: 'A1',
  terminal: 1,
  departureTime: '10:00',
  ...overrides,
});

describe('sortByDepartureTime', () => {
  it('should sort the flights from the earliest to the latest departure', () => {
    const flights = [
      makeFlight({ id: 1, departureTime: '23:55' }),
      makeFlight({ id: 2, departureTime: '00:05' }),
      makeFlight({ id: 3, departureTime: '09:30' }),
      makeFlight({ id: 4, departureTime: '10:15' }),
    ];

    const sorted = sortByDepartureTime(flights);

    expect(sorted.map((flight) => flight.departureTime)).toEqual([
      '00:05',
      '09:30',
      '10:15',
      '23:55',
    ]);
  });

  it('should keep the original order for flights with the same departure time', () => {
    const flights = [
      makeFlight({ id: 1, departureTime: '12:00' }),
      makeFlight({ id: 2, departureTime: '08:00' }),
      makeFlight({ id: 3, departureTime: '12:00' }),
    ];

    const sorted = sortByDepartureTime(flights);

    expect(sorted.map((flight) => flight.id)).toEqual([2, 1, 3]);
  });

  it('should not mutate the original list', () => {
    const flights = [
      makeFlight({ id: 1, departureTime: '12:00' }),
      makeFlight({ id: 2, departureTime: '08:00' }),
    ];

    sortByDepartureTime(flights);

    expect(flights.map((flight) => flight.id)).toEqual([1, 2]);
  });
});
