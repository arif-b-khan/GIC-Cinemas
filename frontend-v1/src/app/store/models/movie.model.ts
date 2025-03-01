export interface Movie {
  id: number;
  title: string;
  total_rows: number;
  seats_per_row: number;
  available_seats: number;
}

export interface Seat {
  row: string;
  seat_number: number;
  seat_code?: string;
}

export interface SeatingMap {
  rows: number;
  seats_per_row: number;
  booked_seats: Seat[];
  selected_seats: Seat[];
}
