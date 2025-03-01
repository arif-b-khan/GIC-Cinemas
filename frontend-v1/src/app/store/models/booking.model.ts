import { Seat } from './movie.model';

export interface Booking {
  booking_id: string;
  movie_id: number;
  num_tickets: number;
  seats: Seat[];
  created_at: string;
}

export interface BookingRequest {
  movie_id: number;
  num_tickets: number;
  start_seat?: string;
}
