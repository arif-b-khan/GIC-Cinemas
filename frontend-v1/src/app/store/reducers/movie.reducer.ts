import { createReducer, on } from '@ngrx/store';
import { Movie } from '../../store/models/movie.model';
import * as MovieActions from '../actions/movie.actions';

export interface State {
  movies: Movie[];
  currentMovie: Movie | null;
  loading: boolean;
  error: string | null;
}

export const initialState: State = {
  movies: [],
  currentMovie: null,
  loading: false,
  error: null
};

export const reducer = createReducer(
  initialState,
  
  // LoadMovies
  on(MovieActions.loadMovies, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MovieActions.loadMoviesSuccess, (state, { movies }) => ({
    ...state,
    movies,
    loading: false
  })),
  on(MovieActions.loadMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // LoadMovie
  on(MovieActions.loadMovie, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MovieActions.loadMovieSuccess, (state, { movie }) => ({
    ...state,
    currentMovie: movie,
    loading: false
  })),
  on(MovieActions.loadMovieFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // CreateMovie
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
  }))
);
