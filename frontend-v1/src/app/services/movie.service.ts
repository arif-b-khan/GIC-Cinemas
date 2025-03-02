import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, SeatingMap } from '../store/models/movie.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = `${environment.apiUrl}/movies`;

  constructor(private http: HttpClient) { }

  getMovies(): Observable<Movie[]> {
    console.log(`api url: ${this.apiUrl}`);
    return this.http.get<Movie[]>(this.apiUrl);
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  createMovie(movie: Partial<Movie>): Observable<Movie> {
    // Create a clean object with only the defined properties
    const movieData = {
      ...(movie.title && { title: movie.title }),
      ...(movie.total_rows !== undefined && { total_rows: movie.total_rows }),
      ...(movie.seats_per_row !== undefined && { seats_per_row: movie.seats_per_row })
    };
    
    // Send as JSON, which is what Flask's request.get_json() expects
    return this.http.post<Movie>(this.apiUrl, movieData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getSeatingMap(movieId: number): Observable<SeatingMap> {
    return this.http.get<SeatingMap>(`${this.apiUrl}/${movieId}/seating`);
  }
}
