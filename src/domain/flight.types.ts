import type { FlightStatusEnum } from './flight.constants';

export type FlightStatus = (typeof FlightStatusEnum)[keyof typeof FlightStatusEnum];

export type Flight = {
  id: number;
  flightNumber: string;
  destination: string;
  status: FlightStatus;
  gate: string;
  terminal: number;
  departureTime: string;
};
