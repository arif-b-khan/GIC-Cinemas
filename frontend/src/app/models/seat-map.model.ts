export interface SeatInfo {
  status: string;
  booking_id: string;
}

export interface SeatMap {
  movie_id: number;
  title: string;
  total_rows: number;
  seats_per_row: number;
  available_seats: number;
  seating_map: {
    [row: string]: (string | SeatInfo)[];
  };
}
