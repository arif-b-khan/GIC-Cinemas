import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SeatMap } from '../../models/seat-map.model';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-map',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.scss']
})
export class SeatMapComponent implements OnChanges {
  @Input() seatMap: SeatMap | null = null;
  @Input() selectedBookingId: string | null = null;
  @Input() currentBookingId: string | null = null;
  @Output() seatSelected = new EventEmitter<string>();
  
  rows: string[] = [];
  columns: number[] = [];
  
  constructor() {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seatMap'] && this.seatMap) {
      this.setupGridDimensions();
    }
  }
  
  setupGridDimensions(): void {
    if (!this.seatMap) return;
    
    const totalRows = this.seatMap.total_rows;
    
    // Create rows (A, B, C, etc.) from furthest row to closest
    this.rows = Array.from(
      { length: totalRows },
      (_, i) => String.fromCharCode(65 + totalRows - i - 1)
    );
    
    // Create columns (1, 2, 3, etc.)
    this.columns = Array.from(
      { length: this.seatMap.seats_per_row },
      (_, i) => i + 1
    );
  }
  
  getSeatStatus(row: string, col: number): string {
    if (!this.seatMap || !this.seatMap.seating_map[row]) return 'unknown';
    
    const seatInfo = this.seatMap.seating_map[row][col - 1];
    
    if (seatInfo === 'available') {
      return 'available';
    } else if (typeof seatInfo === 'object') {
      if (seatInfo.booking_id === this.currentBookingId) {
        return 'current';
      } else if (seatInfo.booking_id === this.selectedBookingId) {
        return 'selected';
      } else {
        return 'booked';
      }
    }
    
    return 'unknown';
  }
  
  onSeatClick(row: string, col: number): void {
    if (this.getSeatStatus(row, col) === 'available') {
      const seatCode = `${row}${col.toString().padStart(2, '0')}`;
      this.seatSelected.emit(seatCode);
    }
  }
  
  isSeatClickable(row: string, col: number): boolean {
    return this.getSeatStatus(row, col) === 'available';
  }
}
