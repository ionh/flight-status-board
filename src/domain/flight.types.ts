// Flight status
export const FlightStatusEnum = {
  OnTime: 'OnTime',
  Delayed: 'Delayed',
  Cancelled: 'Cancelled',
} as const;

export type FlightStatus = (typeof FlightStatusEnum)[keyof typeof FlightStatusEnum];

// Flight entity
export type Flight = {
  id: number;
  flightNumber: string;
  destination: string;
  status: FlightStatus;
  gate: string;
  terminal: number;
  departureTime: string;
};
