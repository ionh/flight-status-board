import type { Flight, FlightStatus } from '../domain/flight.types';

export type FlightFilters = {
  status: FlightStatus | null;
};

const flightMatchesFilters = (flight: Flight, filters: FlightFilters): boolean => {
  return filters.status === null || flight.status === filters.status;
};

export const filterFlights = (flights: Flight[], filters: FlightFilters): Flight[] => {
  return flights.filter((flight) => flightMatchesFilters(flight, filters));
};
