# Backend Dockerfile for FastAPI
# Uses official Python image for security and compatibility
FROM python:3.12-slim

# Set work directory
WORKDIR /app


# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libmariadb-dev

# Install dependencies
COPY requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . /app
COPY model.sql ./app/model.sql

# Expose FastAPI port
EXPOSE 8888

# Run FastAPI app
CMD ["fastapi", "run", "app", "--port", "8888"]