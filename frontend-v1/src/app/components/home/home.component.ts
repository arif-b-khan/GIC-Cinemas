import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/reducers';
import { Movie } from '../../models/movie.model';
import * as MovieActions from '../../store/actions/movie.actions';
import * as BookingActions from '../../store/actions/booking.actions';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  movie$: Observable<Movie | null>;
  loading$: Observable<boolean>;
  
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.movie$ = this.store.select(state => state.movie.currentMovie);
    this.loading$ = this.store.select(state => state.movie.loading);
  }
  
  ngOnInit(): void {
    this.store.dispatch(MovieActions.loadMovies());
  }
  
  goToBookTickets(): void {
    this.router.navigate(['/book']);
  }
  
  goToCheckBookings(): void {
    this.router.navigate(['/bookings']);
  }
  
  goToMovieSetup(): void {
    this.router.navigate(['/setup']);
  }
  
  exit(): void {
    // Just show a thank you page or a modal
    alert('Thank you for using GIC Cinemas system. Bye!');
  }
}
