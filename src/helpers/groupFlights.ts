import type { Flight } from '../domain/flight.types';

type Grouping = {
  name: string;
  getKey: (flight: Flight) => string;
  getLabel: (key: string) => string;
};

// Grouping by another field (gate, airline) means adding new keys here.
export const GROUPING_KEYS = ['terminal'] as const;

export type GroupingKey = (typeof GROUPING_KEYS)[number];

export const GROUPINGS: Record<GroupingKey, Grouping> = {
  terminal: {
    name: 'Terminal',
    getKey: (flight) => String(flight.terminal),
    getLabel: (key) => `Terminal ${key}`,
  },
};

export type FlightGroup = {
  key: string;
  label: string;
  flights: Flight[];
};

export const groupFlights = (flights: Flight[], groupingKey: GroupingKey): FlightGroup[] => {
  const grouping = GROUPINGS[groupingKey];

  const flightsByKey = Map.groupBy(flights, grouping.getKey);

  const groups = [...flightsByKey.entries()].map(([key, flights]) => ({
    key,
    label: grouping.getLabel(key),
    flights,
  }));

  return groups.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
};
