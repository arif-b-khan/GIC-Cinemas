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
ENV FLASK_ENV=production

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
