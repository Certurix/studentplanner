# Backend Dockerfile for FastAPI
# Uses official Python image for security and compatibility
FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/app ./app
COPY backend/model.sql ./model.sql

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "app.__init__:app", "--host", "0.0.0.0", "--port", "8000"]
