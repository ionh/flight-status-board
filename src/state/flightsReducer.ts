import type { Flight } from '../domain/flight.types';

export const DataStatusEnum = {
  InitialLoading: 'InitialLoading',
  InitialError: 'InitialError',
  Fresh: 'Fresh',
  Stale: 'Stale',
} as const;

export type DataStatus = (typeof DataStatusEnum)[keyof typeof DataStatusEnum];

type State = {
  flights: Flight[] | null;
  lastUpdatedAt: Date | null;
  hasError: boolean;
  isFetching: boolean;
};

type Action =
  | { type: 'fetchStarted' }
  | { type: 'fetchSucceeded'; flights: Flight[]; at: Date }
  | { type: 'fetchFailed' };

export const fetchStarted = (): Action => {
  return { type: 'fetchStarted' };
};

export const fetchSucceeded = (flights: Flight[], at: Date = new Date()): Action => {
  return {
    type: 'fetchSucceeded',
    flights,
    at,
  };
};

export const fetchFailed = (): Action => {
  return {
    type: 'fetchFailed',
  };
};

export const initialFlightsState: State = {
  flights: null,
  lastUpdatedAt: null,
  hasError: false,
  isFetching: false,
};

export const flightsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'fetchStarted':
      return {
        ...state,
        isFetching: true,
      };
    case 'fetchSucceeded':
      return {
        flights: action.flights,
        lastUpdatedAt: action.at,
        hasError: false,
        isFetching: false,
      };
    case 'fetchFailed':
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
  }
};

export const getDataStatus = (state: State): DataStatus => {
  if (state.flights === null) {
    if (state.hasError && !state.isFetching) {
      return DataStatusEnum.InitialError;
    }
    return DataStatusEnum.InitialLoading;
  }

  if (state.hasError) {
    return DataStatusEnum.Stale;
  }

  return DataStatusEnum.Fresh;
};
