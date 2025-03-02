import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromMovie from './reducers/movie.reducer';
import * as fromBooking from './reducers/booking.reducer';

export interface AppState {
  movie: fromMovie.State;  // Make sure this is 'movie' not 'movies'
  booking: fromBooking.State;
}

export const reducers: ActionReducerMap<AppState> = {
  movie: fromMovie.reducer,
  booking: fromBooking.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
