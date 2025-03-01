import { createReducer, on } from '@ngrx/store';
import * as MovieActions from '../actions/movie.actions';
import { Movie } from '../../models/movie.model';

export interface State {
  currentMovie: Movie | null;
  loading: boolean;
  error: string | null;
}

export const initialState: State = {
  currentMovie: null,
  loading: false,
  error: null
};

export const reducer = createReducer(
  initialState,
  
  on(MovieActions.createMovie, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(MovieActions.createMovieSuccess, (state, { movie }) => ({
    ...state,
    currentMovie: movie,
    loading: false
  })),
  
  on(MovieActions.createMovieFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(MovieActions.loadMovies, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(MovieActions.loadMoviesSuccess, (state, { movies }) => ({
    ...state,
    currentMovie: movies.length > 0 ? movies[0] : null,
    loading: false
  })),
  
  on(MovieActions.loadMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
