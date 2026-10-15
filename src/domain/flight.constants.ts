export const FlightStatusEnum = {
  OnTime: 'On Time',
  Delayed: 'Delayed',
  Cancelled: 'Cancelled',
} as const;

export const FLIGHT_STATUSES = Object.values(FlightStatusEnum);
