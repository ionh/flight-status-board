import { FlightStatusEnum, type FlightStatus } from './flight.types';

export const FLIGHT_STATUS_LABELS: Record<FlightStatus, string> = {
  [FlightStatusEnum.OnTime]: 'On time',
  [FlightStatusEnum.Delayed]: 'Delayed',
  [FlightStatusEnum.Cancelled]: 'Cancelled',
};
