from flask_restx import Api, Resource, fields, reqparse
from models import db, Movie, Booking, Seat
import random
import string
from flask import request

api = Api(
    version='1.0',
    title='GIC Cinemas API',
    description='API for the GIC Cinemas Booking System',
    doc='/swagger'
)

# Create namespaces
movies_ns = api.namespace('movies', description='Movie operations')
bookings_ns = api.namespace('bookings', description='Booking operations')

# Models for serialization
movie_model = api.model('Movie', {
    'id': fields.Integer(readonly=True),
    'title': fields.String(required=True, description='Movie title'),
    'total_rows': fields.Integer(required=True, description='Total number of rows'),
    'seats_per_row': fields.Integer(required=True, description='Number of seats per row'),
    'available_seats': fields.Integer(readonly=True, description='Number of available seats')
})

seat_model = api.model('Seat', {
    'id': fields.Integer(readonly=True),
    'row': fields.String(required=True, description='Row letter'),
    'seat_number': fields.Integer(required=True, description='Seat number'),
    'seat_code': fields.String(readonly=True, description='Seat code (e.g., A01)')
})

booking_model = api.model('Booking', {
    'id': fields.Integer(readonly=True),
    'booking_id': fields.String(readonly=True, description='Booking ID (e.g., GIC0001)'),
    'movie_id': fields.Integer(required=True, description='Movie ID'),
    'num_tickets': fields.Integer(required=True, description='Number of tickets'),
    'created_at': fields.DateTime(readonly=True),
    'seats': fields.List(fields.Nested(seat_model))
})

# Helper function to generate booking IDs
def generate_booking_id():
    last_booking = Booking.query.order_by(Booking.id.desc()).first()
    if last_booking:
        number = int(last_booking.booking_id[3:]) + 1
    else:
        number = 1
    return f"GIC{number:04d}"

# Parser for movie creation
movie_parser = reqparse.RequestParser()
movie_parser.add_argument('title', type=str, required=True, help='Movie title')
movie_parser.add_argument('total_rows', type=int, required=True, help='Total number of rows')
movie_parser.add_argument('seats_per_row', type=int, required=True, help='Number of seats per row')

# Parser for booking creation
booking_parser = reqparse.RequestParser()
booking_parser.add_argument('movie_id', type=int, required=True, help='Movie ID')
booking_parser.add_argument('num_tickets', type=int, required=True, help='Number of tickets')
booking_parser.add_argument('start_seat', type=str, required=False, help='Start seat (e.g., B03)')

@movies_ns.route('/')
class MovieList(Resource):
    @movies_ns.marshal_list_with(movie_model)
    def get(self):
        """List all movies"""
        return Movie.query.all()
    
    @movies_ns.expect(movie_parser)
    @movies_ns.marshal_with(movie_model, code=201)
    def post(self):
        """Create a new movie"""
        args = movie_parser.parse_args()
        
        # Validate input
        if args['total_rows'] > 26:
            api.abort(400, "Maximum number of rows is 26")
        if args['seats_per_row'] > 50:
            api.abort(400, "Maximum number of seats per row is 50")
        
        movie = Movie(
            title=args['title'],
            total_rows=args['total_rows'],
            seats_per_row=args['seats_per_row']
        )
        db.session.add(movie)
        db.session.commit()
        return movie, 201

@movies_ns.route('/<int:id>')
class MovieDetail(Resource):
    @movies_ns.marshal_with(movie_model)
    def get(self, id):
        """Get a specific movie"""
        movie = Movie.query.get_or_404(id)
        return movie

@bookings_ns.route('/')
class BookingList(Resource):
    @bookings_ns.marshal_list_with(booking_model)
    def get(self):
        """List all bookings"""
        return Booking.query.all()
    
    @bookings_ns.expect(booking_parser)
    @bookings_ns.marshal_with(booking_model, code=201)
    def post(self):
        """Create a new booking"""
        args = booking_parser.parse_args()
        movie = Movie.query.get_or_404(args['movie_id'])
        
        # Check if there are enough seats available
        if args['num_tickets'] > movie.available_seats:
            api.abort(400, f"Not enough seats available. Only {movie.available_seats} seats left.")
        
        # Create booking
        booking = Booking(
            booking_id=generate_booking_id(),
            movie_id=args['movie_id'],
            num_tickets=args['num_tickets']
        )
        db.session.add(booking)
        db.session.flush()  # Get the booking ID without committing
        
        # Allocate seats
        allocated_seats = allocate_seats(movie, booking, args['num_tickets'], args.get('start_seat'))
        
        for seat_data in allocated_seats:
            seat = Seat(
                booking_id=booking.id,
                row=seat_data['row'],
                seat_number=seat_data['seat_number']
            )
            db.session.add(seat)
        
        db.session.commit()
        return booking, 201

@bookings_ns.route('/<string:booking_id>')
class BookingDetail(Resource):
    @bookings_ns.marshal_with(booking_model)
    def get(self, booking_id):
        """Get a specific booking by booking_id"""
        booking = Booking.query.filter_by(booking_id=booking_id).first_or_404()
        return booking

def allocate_seats(movie, booking, num_tickets, start_seat=None):
    """Allocate seats according to the rules in the requirements"""
    # Get all currently booked seats
    booked_seats = []
    all_bookings = Booking.query.filter_by(movie_id=movie.id).all()
    for b in all_bookings:
        for seat in b.seats:
            booked_seats.append((seat.row, seat.seat_number))
    
    # Create a seating map
    rows = [chr(65 + i) for i in range(movie.total_rows)][::-1]  # A, B, C, ... starting from furthest row
    seating_map = {}
    for row in rows:
        seating_map[row] = [False] * movie.seats_per_row  # False means empty seat
    
    # Mark booked seats
    for row, seat_num in booked_seats:
        seating_map[row][seat_num - 1] = True
    
    allocated = []
    
    # Parse start_seat if provided
    start_row = None
    start_col = None
    if start_seat:
        if len(start_seat) >= 2:
            start_row = start_seat[0].upper()
            try:
                start_col = int(start_seat[1:]) - 1  # Convert to 0-based index
                if start_col < 0 or start_col >= movie.seats_per_row:
                    start_col = None
            except ValueError:
                start_col = None
    
    # If start_seat is valid, use it as the starting position
    if start_row and start_row in rows and start_col is not None:
        row_idx = rows.index(start_row)
        remaining = num_tickets
        
        while remaining > 0 and row_idx < len(rows):
            row = rows[row_idx]
            col = start_col if row_idx == rows.index(start_row) else (movie.seats_per_row // 2 - remaining // 2)
            
            while col < movie.seats_per_row and remaining > 0:
                if not seating_map[row][col]:
                    allocated.append({'row': row, 'seat_number': col + 1})
                    seating_map[row][col] = True
                    remaining -= 1
                col += 1
            
            row_idx += 1
    else:
        # Default allocation - start from furthest row, middle seats
        for row in rows:
            # Calculate the middle position
            middle = movie.seats_per_row // 2
            seats_to_allocate = min(num_tickets, movie.seats_per_row)
            start_col = max(0, middle - seats_to_allocate // 2)
            
            allocated_in_row = 0
            for i in range(start_col, movie.seats_per_row):
                if not seating_map[row][i] and allocated_in_row < seats_to_allocate:
                    allocated.append({'row': row, 'seat_number': i + 1})
                    seating_map[row][i] = True
                    allocated_in_row += 1
            
            num_tickets -= allocated_in_row
            if num_tickets <= 0:
                break
    
    return allocated

@bookings_ns.route('/seats/<int:movie_id>')
class SeatMap(Resource):
    def get(self, movie_id):
        """Get the seat map for a movie"""
        movie = Movie.query.get_or_404(movie_id)
        
        # Create a seating map
        rows = [chr(65 + i) for i in range(movie.total_rows)]
        seating_map = {}
        for row in rows:
            seating_map[row] = ["available"] * movie.seats_per_row
        
        # Mark booked seats
        all_bookings = Booking.query.filter_by(movie_id=movie.id).all()
        for b in all_bookings:
            for seat in b.seats:
                seating_map[seat.row][seat.seat_number - 1] = {
                    "status": "booked",
                    "booking_id": b.booking_id
                }
        
        return {
            "movie_id": movie.id,
            "title": movie.title,
            "total_rows": movie.total_rows,
            "seats_per_row": movie.seats_per_row,
            "available_seats": movie.available_seats,
            "seating_map": seating_map
        }
