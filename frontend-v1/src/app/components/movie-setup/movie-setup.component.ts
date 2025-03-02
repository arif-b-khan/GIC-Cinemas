import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import * as MovieActions from '../../store/actions/movie.actions';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './movie-setup.component.html',
  styleUrls: ['./movie-setup.component.scss']
})
export class MovieSetupComponent implements OnInit {
  movieForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.movieForm = this.fb.group({
      title: ['', [Validators.required]],
      total_rows: [8, [Validators.required, Validators.min(1), Validators.max(26)]],
      seats_per_row: [10, [Validators.required, Validators.min(1), Validators.max(50)]]
    });
    
    this.loading$ = this.store.select(state => state.movie.loading);
    this.error$ = this.store.select(state => state.movie.error);
  }
  
  ngOnInit(): void {
  }
  
  onSubmit(): void {
    if (this.movieForm.valid) {
      const { title, total_rows, seats_per_row } = this.movieForm.value;
      
      this.store.dispatch(MovieActions.createMovie({
        title,
        total_rows,
        seats_per_row
      }));
      
      // Navigate back to home after creating movie
      this.store.select(state => state.movie.currentMovie)
        .subscribe((movie: any) => {
          if (movie) {
            this.router.navigate(['/']);
          }
        });
    }
  }
  
  goBack(): void {
    this.router.navigate(['/']);
  }
}
