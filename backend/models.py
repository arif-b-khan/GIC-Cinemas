from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    total_rows = db.Column(db.Integer, nullable=False)
    seats_per_row = db.Column(db.Integer, nullable=False)
    bookings = db.relationship('Booking', backref='movie', lazy=True)

    @property
    def available_seats(self):
        booked_seats = sum(booking.num_tickets for booking in self.bookings)
        return (self.total_rows * self.seats_per_row) - booked_seats

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.String(10), unique=True, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    num_tickets = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    seats = db.relationship('Seat', backref='booking', lazy=True)

class Seat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'))
    row = db.Column(db.String(1), nullable=False)
    seat_number = db.Column(db.Integer, nullable=False)
    
    @property
    def seat_code(self):
        return f"{self.row}{self.seat_number:02d}"
