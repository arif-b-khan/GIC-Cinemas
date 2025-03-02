import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromMovie from './reducers/movie.reducer';
import * as fromBooking from './reducers/booking.reducer';

export interface AppState {
  movies: fromMovie.State;
  bookings: fromBooking.State;
}

export const reducers: ActionReducerMap<AppState> = {
  movies: fromMovie.reducer,
  bookings: fromBooking.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
