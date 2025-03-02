import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, take, filter } from 'rxjs/operators';
import { AppState } from '../../store/reducers';
import { Movie } from '../../models/movie.model';
import { Booking } from '../../models/booking.model';
import { SeatMap } from '../../models/seat-map.model';
import * as MovieActions from '../../store/actions/movie.actions';
import * as BookingActions from '../../store/actions/booking.actions';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { SeatMapComponent } from '../seat-map/seat-map.component';

@Component({
  selector: 'app-book-tickets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, SeatMapComponent],
  templateUrl: './book-tickets.component.html',
  styleUrls: ['./book-tickets.component.scss']
})
export class BookTicketsComponent implements OnInit {
  ticketsForm: FormGroup;
  seatSelectionForm: FormGroup;
  
  movie$: Observable<Movie | null>;
  currentBooking$: Observable<Booking | null>;
  seatMap$: Observable<SeatMap | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  bookingConfirmed = false;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.ticketsForm = this.fb.group({
      numTickets: ['', [Validators.required, Validators.min(1)]]
    });
    
    this.seatSelectionForm = this.fb.group({
      startSeat: ['']
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
  
  onBookTickets(): void {
    if (this.ticketsForm.valid) {
      const numTickets = +this.ticketsForm.get('numTickets')?.value;
      
      this.movie$.pipe(take(1)).subscribe(movie => {
        if (movie) {
          if (numTickets > movie.available_seats) {
            // Show error message
            this.ticketsForm.get('numTickets')?.setErrors({
              notEnoughSeats: `Sorry, there are only ${movie.available_seats} seats available.`
            });
          } else {
            // Create a booking
            this.store.dispatch(BookingActions.createBooking({
              movie_id: movie.id,
              num_tickets: numTickets
            }));
            
            // Refresh seat map after booking is created
            this.currentBooking$.pipe(
              filter(booking => !!booking),
              take(1)
            ).subscribe(() => {
              this.store.dispatch(BookingActions.loadSeatMap({ movieId: movie.id }));
            });
          }
        }
      });
    }
  }
  
  onSeatSelected(startSeat: string): void {
    this.seatSelectionForm.patchValue({ startSeat });
  }
  
  onChangeSeating(): void {
    if (this.seatSelectionForm.valid) {
      const startSeat = this.seatSelectionForm.get('startSeat')?.value;
      
      this.currentBooking$.pipe(take(1)).subscribe(booking => {
        this.movie$.pipe(take(1)).subscribe(movie => {
          if (booking && movie) {
            // Create a new booking with the same number of tickets but different starting seat
            this.store.dispatch(BookingActions.createBooking({
              movie_id: movie.id,
              num_tickets: booking.num_tickets,
              start_seat: startSeat
            }));
            
            // Refresh seat map after booking is created
            this.currentBooking$.pipe(
              filter(b => !!b && b.booking_id !== booking.booking_id),
              take(1)
            ).subscribe(() => {
              this.store.dispatch(BookingActions.loadSeatMap({ movieId: movie.id }));
            });
          }
        });
      });
    }
  }
  
  confirmBooking(): void {
    this.bookingConfirmed = true;
  }
  
  goBack(): void {
    // Reset current booking when going back to home
    this.store.dispatch(BookingActions.resetCurrentBooking());
    this.router.navigate(['/']);
  }
}
