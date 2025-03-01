import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Seat, SeatingMap } from '../../store/models/movie.model';

@Component({
  selector: 'app-seating-chart',
  templateUrl: './seating-chart.component.html',
  styleUrls: ['./seating-chart.component.scss']
})
export class SeatingChartComponent implements OnChanges {
  @Input() seatingMap: SeatingMap | null = null;
  @Input() highlightBookingSeats: Seat[] = [];
  
  rows: string[] = [];
  columns: number[] = [];
  
  seatStatus: { [key: string]: 'available' | 'booked' | 'selected' | 'highlighted' } = {};
  
  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.seatingMap) {
      // Generate rows and columns
      this.rows = [];
      for (let i = 0; i < this.seatingMap.rows; i++) {
        this.rows.push(String.fromCharCode(65 + this.seatingMap.rows - i - 1));
      }
      
      this.columns = [];
      for (let i = 1; i <= this.seatingMap.seats_per_row; i++) {
        this.columns.push(i);
      }
      
      // Reset seat status
      this.seatStatus = {};
      
      // Mark booked seats
      if (this.seatingMap.booked_seats) {
        this.seatingMap.booked_seats.forEach(seat => {
          this.seatStatus[`${seat.row}${seat.seat_number}`] = 'booked';
        });
      }
      
      // Mark selected seats
      if (this.seatingMap.selected_seats) {
        this.seatingMap.selected_seats.forEach(seat => {
          this.seatStatus[`${seat.row}${seat.seat_number}`] = 'selected';
        });
      }
      
      // Mark highlighted seats
      if (this.highlightBookingSeats && this.highlightBookingSeats.length > 0) {
        this.highlightBookingSeats.forEach(seat => {
          this.seatStatus[`${seat.row}${seat.seat_number}`] = 'highlighted';
        });
      }
    }
  }
  
  getSeatStatus(row: string, col: number): 'available' | 'booked' | 'selected' | 'highlighted' {
    return this.seatStatus[`${row}${col}`] || 'available';
  }
}
