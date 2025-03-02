import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MovieSetupComponent } from './components/movie-setup/movie-setup.component';
import { BookTicketsComponent } from './components/book-tickets/book-tickets.component';
import { CheckBookingsComponent } from './components/check-bookings/check-bookings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'setup', component: MovieSetupComponent },
  { path: 'book', component: BookTicketsComponent },
  { path: 'bookings', component: CheckBookingsComponent },
  { path: '**', redirectTo: '' }
];