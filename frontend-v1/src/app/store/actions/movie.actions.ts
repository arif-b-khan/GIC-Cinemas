import { createAction, props } from '@ngrx/store';
import { Movie } from '../../models/movie.model';

// Load Movies
export const loadMovies = createAction(
  '[Movie] Load Movies'
);

export const loadMoviesSuccess = createAction(
  '[Movie] Load Movies Success',
  props<{ movies: Movie[] }>()
);

export const loadMoviesFailure = createAction(
  '[Movie] Load Movies Failure',
  props<{ error: string }>()
);

// Create Movie
export const createMovie = createAction(
  '[Movie] Create Movie',
  props<{ title: string; total_rows: number; seats_per_row: number }>()
);

export const createMovieSuccess = createAction(
  '[Movie] Create Movie Success',
  props<{ movie: Movie }>()
);

export const createMovieFailure = createAction(
  '[Movie] Create Movie Failure',
  props<{ error: string }>()
);

// Select Movie
export const selectMovie = createAction(
  '[Movie] Select Movie',
  props<{ movie: Movie }>()
);
