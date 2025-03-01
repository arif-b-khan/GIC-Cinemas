import { createReducer, on } from '@ngrx/store';
import * as BookingActions from '../actions/booking.actions';
import { Booking } from '../../models/booking.model';
import { SeatMap } from '../../models/seat-map.model';

export interface State {
  currentBooking: Booking | null;
  bookings: Booking[];
  seatMap: SeatMap | null;
  loading: boolean;
  error: string | null;
}

export const initialState: State = {
  currentBooking: null,
  bookings: [],
  seatMap: null,
  loading: false,
  error: null
};

export const reducer = createReducer(
  initialState,
  
  on(BookingActions.createBooking, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(BookingActions.createBookingSuccess, (state, { booking }) => ({
    ...state,
    currentBooking: booking,
    bookings: [...state.bookings, booking],
    loading: false
  })),
  
  on(BookingActions.createBookingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(BookingActions.loadBookings, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(BookingActions.loadBookingsSuccess, (state, { bookings }) => ({
    ...state,
    bookings,
    loading: false
  })),
  
  on(BookingActions.loadBookingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(BookingActions.getBooking, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(BookingActions.getBookingSuccess, (state, { booking }) => ({
    ...state,
    currentBooking: booking,
    loading: false
  })),
  
  on(BookingActions.getBookingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(BookingActions.loadSeatMap, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(BookingActions.loadSeatMapSuccess, (state, { seatMap }) => ({
    ...state,
    seatMap,
    loading: false
  })),
  
  on(BookingActions.loadSeatMapFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(BookingActions.resetCurrentBooking, state => ({
    ...state,
    currentBooking: null
  }))
);
