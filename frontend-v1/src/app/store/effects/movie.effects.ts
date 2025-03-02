import { Injectable, inject } from '@angular/core'; // Add inject import
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
import * as MovieActions from '../actions/movie.actions';

@Injectable()
export class MovieEffects {
  // Use inject() for dependency injection
  private actions$ = inject(Actions);
  private movieService = inject(MovieService);
  
  loadMovies$ = createEffect(() => 
    this.actions$.pipe(
      ofType(MovieActions.loadMovies),
      switchMap(() => 
        this.movieService.getMovies().pipe(
          map(movies => MovieActions.loadMoviesSuccess({ movies })),
          catchError(error => of(MovieActions.loadMoviesFailure({ error: error.message || 'Failed to load movies' })))
        )
      )
    )
  );
  
  loadMovie$ = createEffect(() => 
    this.actions$.pipe(
      ofType(MovieActions.loadMovie),
      switchMap(action => 
        this.movieService.getMovie(action.id).pipe(
          map(movie => MovieActions.loadMovieSuccess({ movie })),
          catchError(error => of(MovieActions.loadMovieFailure({ error: error.message || 'Failed to load movie' })))
        )
      )
    )
  );
  
  createMovie$ = createEffect(() => 
    this.actions$.pipe(
      ofType(MovieActions.createMovie),
      switchMap(action => 
        this.movieService.createMovie({
          title: action.title,
          total_rows: action.total_rows,
          seats_per_row: action.seats_per_row
        }).pipe(
          map(movie => MovieActions.createMovieSuccess({ movie })),
          catchError(error => of(MovieActions.createMovieFailure({ error: error.message || 'Failed to create movie' })))
        )
      )
    )
  );
}
