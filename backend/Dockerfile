FROM python:3.9-slim

WORKDIR /app

# Install build tools and MySQL development libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    && apt-get clean

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
ENV FLASK_ENV=development

EXPOSE 5000

# Optimize Gunicorn for CORS handling
# --timeout 120: Increase timeout for longer operations
# --workers 4: Increase worker count for concurrency (adjust based on your CPU cores)
# --threads 2: Use threads for handling concurrent requests
# --max-requests 1000: Restart workers occasionally to prevent memory leaks
# --access-logfile -: Log to stdout for Docker to capture
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "120", "--workers", "4", "--threads", "2", "--max-requests", "1000", "--access-logfile", "-", "app:app"]
