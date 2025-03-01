import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AppState } from '../../store/reducers';
import { Movie } from '../../models/movie.model';
import { Booking } from '../../models/booking.model';
import { SeatMap } from '../../models/seat-map.model';
import * as MovieActions from '../../store/actions/movie.actions';
import * as BookingActions from '../../store/actions/booking.actions';

@Component({
  selector: 'app-check-bookings',
  templateUrl: './check-bookings.component.html',
  styleUrls: ['./check-bookings.component.scss']
})
export class CheckBookingsComponent implements OnInit {
  bookingForm: FormGroup;
  
  movie$: Observable<Movie | null>;
  currentBooking$: Observable<Booking | null>;
  seatMap$: Observable<SeatMap | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      bookingId: ['', [Validators.required, Validators.pattern(/^GIC\d{4}$/)]]
    });
    
    this.movie$ = this.store.select(state => state.movie.currentMovie);
    this.currentBooking$ = this.store.select(state => state.booking.currentBooking);
    this.seatMap$ = this.store.select(state => state.booking.seatMap);
    this.loading$ = this.store.select(state => state.booking.loading);
    this.error$ = this.store.select(state => state.booking.error);
  }
  
  ngOnInit(): void {
    this.store.dispatch(MovieActions.loadMovies());
    
    // Load seat map when movie is available
    this.movie$.pipe(
      filter(movie => !!movie),
      take(1)
    ).subscribe(movie => {
      if (movie) {
        this.store.dispatch(BookingActions.loadSeatMap({ movieId: movie.id }));
      }
    });
  }
  
  onCheckBooking(): void {
    if (this.bookingForm.valid) {
      const bookingId = this.bookingForm.get('bookingId')?.value;
      
      this.store.dispatch(BookingActions.getBooking({ bookingId }));
    }
  }
  
  goBack(): void {
    // Reset current booking when going back to home
    this.store.dispatch(BookingActions.resetCurrentBooking());
    this.router.navigate(['/']);
  }
}
