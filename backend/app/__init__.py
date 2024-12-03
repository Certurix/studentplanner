from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import db

app = FastAPI()

origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple API entry points

@app.get("/users/{id}")
def users(id: int | None = None):
    """List of all users.

    If id is not None, the list contains only the country with given id.

    """
    return db.get_users(id)