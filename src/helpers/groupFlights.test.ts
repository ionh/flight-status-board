import { describe, expect, it } from 'vitest';
import { FlightStatusEnum, type Flight } from '../domain/flight.types';
import { groupFlights } from './groupFlights';

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

describe('groupFlights', () => {
  it('should group the flights by terminal, with a label for each group', () => {
    const flights = [
      makeFlight({ id: 1, terminal: 1 }),
      makeFlight({ id: 2, terminal: 2 }),
      makeFlight({ id: 3, terminal: 1 }),
    ];

    const groups = groupFlights(flights, 'terminal');

    expect(groups).toEqual([
      { key: '1', label: 'Terminal 1', flights: [flights[0], flights[2]] },
      { key: '2', label: 'Terminal 2', flights: [flights[1]] },
    ]);
  });

  it('should sort the groups numerically, not alphabetically', () => {
    const flights = [
      makeFlight({ id: 1, terminal: 10 }),
      makeFlight({ id: 2, terminal: 2 }),
      makeFlight({ id: 3, terminal: 1 }),
    ];

    const groups = groupFlights(flights, 'terminal');

    expect(groups.map((group) => group.key)).toEqual(['1', '2', '10']);
  });

  it('should keep the order of the flights inside each group', () => {
    const flights = [
      makeFlight({ id: 1, terminal: 1, departureTime: '08:00' }),
      makeFlight({ id: 2, terminal: 1, departureTime: '09:00' }),
      makeFlight({ id: 3, terminal: 1, departureTime: '10:00' }),
    ];

    const [group] = groupFlights(flights, 'terminal');

    expect(group.flights.map((flight) => flight.id)).toEqual([1, 2, 3]);
  });

  it('should return no groups when there are no flights', () => {
    expect(groupFlights([], 'terminal')).toEqual([]);
  });
});
