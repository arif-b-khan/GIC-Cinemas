import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { BookingService } from '../../services/booking.service';
import * as BookingActions from '../actions/booking.actions';

@Injectable()
export class BookingEffects {
  private actions$ = inject(Actions);
  private bookingService = inject(BookingService);
  
  loadBookings$ = createEffect(() => this.actions$.pipe(
    ofType(BookingActions.loadBookings),
    mergeMap(() => this.bookingService.getBookings()
      .pipe(
        map(bookings => BookingActions.loadBookingsSuccess({ bookings })),
        catchError(error => of(BookingActions.loadBookingsFailure({ 
          error: error.message || 'Failed to load bookings' 
        })))
      )
    )
  ));

  getBooking$ = createEffect(() => this.actions$.pipe(
    ofType(BookingActions.getBooking),
    mergeMap((action) => this.bookingService.getBooking(action.bookingId)
      .pipe(
        map(booking => BookingActions.getBookingSuccess({ booking })),
        catchError(error => of(BookingActions.getBookingFailure({ 
          error: error.message || 'Failed to get booking' 
        })))
      )
    )
  ));

  createBooking$ = createEffect(() => this.actions$.pipe(
    ofType(BookingActions.createBooking),
    mergeMap((action) => this.bookingService.createBooking({
      movie_id: action.movie_id,
      num_tickets: action.num_tickets,
      start_seat: action.start_seat
    })
    .pipe(
      map(booking => BookingActions.createBookingSuccess({ booking })),
      catchError(error => of(BookingActions.createBookingFailure({ 
        error: error.message || 'Failed to create booking' 
      })))
    ))
  ));

  loadSeatMap$ = createEffect(() => this.actions$.pipe(
    ofType(BookingActions.loadSeatMap),
    mergeMap((action) => this.bookingService.getSeatMap(action.movieId)
      .pipe(
        map(seatMap => BookingActions.loadSeatMapSuccess({ seatMap })),
        catchError(error => of(BookingActions.loadSeatMapFailure({ 
          error: error.message || 'Failed to load seat map' 
        })))
      )
    )
  ));

}
