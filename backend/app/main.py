from fastapi import FastAPI

from . import db

app = FastAPI()


# Simple API entry points

@app.get("/users/")
def users(id: int | None = None):
    """List of all users.

    If id is not None, the list contains only the country with given id.

    """
    return db.get_users(id)