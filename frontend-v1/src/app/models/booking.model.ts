import { Seat } from './seat.model';

export interface Booking {
  id: number;
  booking_id: string;
  movie_id: number;
  num_tickets: number;
  created_at: string;
  seats: Seat[];
}
