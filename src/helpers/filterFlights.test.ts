import { describe, expect, it } from 'vitest';
import { FlightStatusEnum, type Flight } from '../domain/flight.types';
import { filterFlights } from './filterFlights';

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

const FLIGHTS: Flight[] = [
  makeFlight({ id: 1, status: FlightStatusEnum.OnTime }),
  makeFlight({ id: 2, status: FlightStatusEnum.Delayed }),
  makeFlight({ id: 3, status: FlightStatusEnum.Cancelled }),
  makeFlight({ id: 4, status: FlightStatusEnum.Delayed }),
];

describe('filterFlights', () => {
  it('should return all flights when no status is selected', () => {
    expect(filterFlights(FLIGHTS, { status: null })).toEqual(FLIGHTS);
  });

  it('should return only the flights with the selected status', () => {
    const flights = filterFlights(FLIGHTS, { status: FlightStatusEnum.Delayed });

    expect(flights.map((flight) => flight.id)).toEqual([2, 4]);
  });

  it('should return an empty list when no flight has the selected status', () => {
    const onTimeFlights = [makeFlight({ status: FlightStatusEnum.OnTime })];

    expect(filterFlights(onTimeFlights, { status: FlightStatusEnum.Cancelled })).toEqual([]);
  });
});
