import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// App components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MovieSetupComponent } from './components/movie-setup/movie-setup.component';
import { BookTicketsComponent } from './components/book-tickets/book-tickets.component';
import { CheckBookingsComponent } from './components/check-bookings/check-bookings.component';
import { SeatMapComponent } from './components/seat-map/seat-map.component';

// Reducers and effects
import { reducers, metaReducers } from './store/reducers';
import { MovieEffects } from './store/effects/movie.effects';
import { BookingEffects } from './store/effects/booking.effects';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'setup', component: MovieSetupComponent },
  { path: 'book', component: BookTicketsComponent },
  { path: 'bookings', component: CheckBookingsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MovieSetupComponent,
    BookTicketsComponent,
    CheckBookingsComponent,
    SeatMapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    
    // Material modules
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    
    // NgRx modules
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([MovieEffects, BookingEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
