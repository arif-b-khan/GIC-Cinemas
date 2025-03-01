import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
import * as MovieActions from '../actions/movie.actions';

@Injectable()
export class MovieEffects {
  loadMovies$ = createEffect(() => this.actions$.pipe(
    ofType(MovieActions.loadMovies),
    mergeMap(() => this.movieService.getMovies()
      .pipe(
        map(movies => MovieActions.loadMoviesSuccess({ movies })),
        catchError(error => of(MovieActions.loadMoviesFailure({ 
          error: error.message || 'Failed to load movies' 
        })))
      )
    )
  ));

  createMovie$ = createEffect(() => this.actions$.pipe(
    ofType(MovieActions.createMovie),
    mergeMap((action) => this.movieService.createMovie({
      title: action.title,
      total_rows: action.total_rows,
      seats_per_row: action.seats_per_row
    })
    .pipe(
      map(movie => MovieActions.createMovieSuccess({ movie })),
      catchError(error => of(MovieActions.createMovieFailure({ 
        error: error.message || 'Failed to create movie' 
      })))
    ))
  ));

  constructor(
    private actions$: Actions,
    private movieService: MovieService
  ) {}
}
