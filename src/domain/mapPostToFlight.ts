import type { RawPost } from '../api/fetchPosts';
import { FlightStatusEnum } from './flight.constants';
import type { Flight, FlightStatus } from './flight.types';

const GATE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const GATES_PER_LETTER = 20;

const DEPARTURE_SLOT_MINUTES = 5;
const DEPARTURE_SLOTS = (24 * 60) / DEPARTURE_SLOT_MINUTES; // 00:00 – 23:55

const deriveStatus = (id: number): FlightStatus => {
  const roll = (id * 7) % 10;
  if (roll < 7) {
    return FlightStatusEnum.OnTime;
  }
  if (roll < 9) {
    return FlightStatusEnum.Delayed;
  }
  return FlightStatusEnum.Cancelled;
};

const deriveGate = (id: number): string => {
  const letter = GATE_LETTERS[id % GATE_LETTERS.length];
  const number = ((id * 7) % GATES_PER_LETTER) + 1;
  return `${letter}${number}`;
};

const deriveDepartureTime = (id: number): string => {
  const slot = (id * 37) % DEPARTURE_SLOTS;
  const totalMinutes = slot * DEPARTURE_SLOT_MINUTES;
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const toDestination = (title: string): string => {
  const shortened = title.trim().split(/\s+/).slice(0, 2).join(' ');
  return shortened.charAt(0).toUpperCase() + shortened.slice(1);
};

const mapPostToFlight = (post: RawPost): Flight => ({
  id: post.id,
  flightNumber: `FL-${post.id}`,
  destination: toDestination(post.title),
  status: deriveStatus(post.id),
  gate: deriveGate(post.id),
  terminal: post.userId,
  departureTime: deriveDepartureTime(post.id),
});

export const mapPostsToFlights = (posts: RawPost[]): Flight[] => posts.map(mapPostToFlight);
