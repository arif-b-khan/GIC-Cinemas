import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { SeatMap } from '../models/seat-map.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;
  
  constructor(private http: HttpClient) {}
  
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }
  
  getBooking(bookingId: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${bookingId}`);
  }
  
  createBooking(booking: {
    movie_id: number;
    num_tickets: number;
    start_seat?: string;
  }): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }
  
  getSeatMap(movieId: number): Observable<SeatMap> {
    return this.http.get<SeatMap>(`${this.apiUrl}/seats/${movieId}`);
  }
}
