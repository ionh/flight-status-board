import type { Flight } from '../domain/flight.types';

export const sortByDepartureTime = (flights: Flight[]): Flight[] => {
  return [...flights].sort((a, b) => {
    if (a.departureTime < b.departureTime) {
      return -1;
    }
    if (a.departureTime > b.departureTime) {
      return 1;
    }
    return 0;
  });
};
