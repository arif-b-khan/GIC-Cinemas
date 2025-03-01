import { createAction, props } from '@ngrx/store';
import { Booking } from '../../models/booking.model';
import { SeatMap } from '../../models/seat-map.model';

// Load Bookings
export const loadBookings = createAction(
  '[Booking] Load Bookings'
);

export const loadBookingsSuccess = createAction(
  '[Booking] Load Bookings Success',
  props<{ bookings: Booking[] }>()
);

export const loadBookingsFailure = createAction(
  '[Booking] Load Bookings Failure',
  props<{ error: string }>()
);

// Get Booking
export const getBooking = createAction(
  '[Booking] Get Booking',
  props<{ bookingId: string }>()
);

export const getBookingSuccess = createAction(
  '[Booking] Get Booking Success',
  props<{ booking: Booking }>()
);

export const getBookingFailure = createAction(
  '[Booking] Get Booking Failure',
  props<{ error: string }>()
);

// Create Booking
export const createBooking = createAction(
  '[Booking] Create Booking',
  props<{ 
    movie_id: number; 
    num_tickets: number; 
    start_seat?: string 
  }>()
);

export const createBookingSuccess = createAction(
  '[Booking] Create Booking Success',
  props<{ booking: Booking }>()
);

export const createBookingFailure = createAction(
  '[Booking] Create Booking Failure',
  props<{ error: string }>()
);

// Load Seat Map
export const loadSeatMap = createAction(
  '[Booking] Load Seat Map',
  props<{ movieId: number }>()
);

export const loadSeatMapSuccess = createAction(
  '[Booking] Load Seat Map Success',
  props<{ seatMap: SeatMap }>()
);

export const loadSeatMapFailure = createAction(
  '[Booking] Load Seat Map Failure',
  props<{ error: string }>()
);

// Reset Current Booking
export const resetCurrentBooking = createAction(
  '[Booking] Reset Current Booking'
);
