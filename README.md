# GIC-Cinemas
 GIC Cinema booking application

## Local Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js and npm 
- Python and pip

### Running Locally

1. **Start the MySQL database in Docker**:
   ```bash
   docker-compose -f docker-compose-local.yml up -d db
   ```

2. **Set up and run the backend**:
   ```bash
   cd backend
   
   # Set environment variables
   # For Windows:
   set DATABASE_URL=mysql://cinema_user:arifkhan@localhost/cinema_db
   set FLASK_ENV=development
   
   # For Linux/Mac:
   export DATABASE_URL=mysql://cinema_user:arifkhan@localhost/cinema_db
   export FLASK_ENV=development
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run the backend
   flask run --host=0.0.0.0
   ```

3. **Set up and run the frontend**:
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Run the frontend
   npm start
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Using the Helper Script
Alternatively, you can use the provided helper script:
```bash
chmod +x local-dev.sh
./local-dev.sh
```

### Full Deployment
To run the full application using Docker (database, backend, and frontend):
```bash
docker-compose up -d
```
