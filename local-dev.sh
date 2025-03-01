#!/bin/bash

# Start MySQL container using the local development docker-compose file
echo "Starting MySQL container..."
docker-compose -f docker-compose-local.yml up -d db

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
sleep 10

# Instructions for starting the backend
echo "Starting backend..."
echo "Navigate to the backend directory and run:"
echo "cd backend"
echo "export DATABASE_URL=mysql://cinema_user:arifkhan@localhost/cinema_db"
echo "export FLASK_ENV=development"
echo "pip install -r requirements.txt"
echo "flask run --host=0.0.0.0"

# Instructions for starting the frontend
echo "Starting frontend..."
echo "In a new terminal, navigate to the frontend directory and run:"
echo "cd frontend"
echo "npm install"
echo "npm start"

echo "Your application should be accessible at:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
