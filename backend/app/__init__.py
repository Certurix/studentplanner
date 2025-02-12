from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from . import db

app = FastAPI()

origins = ["http://localhost:3000", "localhost:3000", "http://localhost:5173", "localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request bodies
class RegisterUser(BaseModel):
    name: str
    lastname: str
    email: str
    password: str

class UserEmail(BaseModel):
    email: str

class UserName(BaseModel):
    name: str

class UserSchool(BaseModel):
    school: str

class UserClass(BaseModel):
    classname: str

class UserLastname(BaseModel):
    lastname: str

class Event(BaseModel):
    user_id: int
    title: str
    description: str
    type: str
    priority: int
    startdate: str
    enddate: str
    place: str
    
# Simple API entry points

@app.post("/register")
def register(user: RegisterUser):
    """Register a new user."""
    return db.register_user(user.name, user.lastname, user.email, user.password)

@app.get("/users/{id}")
def users(id: int | None = None):
    """List of all users.

    If id is not None, the list contains only the country with given id.

    """
    return db.get_users(id)

@app.get("/users/{id}/email")
def user_email(id: int):
    """Get user email."""
    return db.get_user_email(id)

@app.post("/users/{id}/email")
def set_user_email(id: int, email: UserEmail):
    """Set user email."""
    return db.set_user_email(id, email.email)

@app.get("/users/{id}/name")
def user_name(id: int):
    """Get user name."""
    return db.get_user_name(id)

@app.post("/users/{id}/name")
def set_user_name(id: int, name: UserName):
    """Set user name."""
    return db.set_user_name(id, name.name)

@app.get("/users/{id}/school")
def user_school(id: int):
    """Get user school."""
    return db.get_user_school(id)

@app.post("/users/{id}/school")
def set_user_school(id: int, school: UserSchool):
    """Set user school."""
    return db.set_user_school(id, school.school)

@app.get("/users/{id}/classname")
def user_class(id: int):
    """Get user class."""
    return db.get_user_class(id)

@app.post("/users/{id}/classname")
def set_user_class(id: int, className: UserClass):
    """Set user class."""
    return db.set_user_class(id, className.classname)

@app.get("/users/{id}/lastname")
def user_lastname(id: int):
    """Get user lastname."""
    return db.get_user_lastname(id)

@app.post("/users/{id}/lastname")
def set_user_lastname(id: int, lastname: UserLastname):
    """Set user lastname."""
    return db.set_user_lastname(id, lastname.lastname)

@app.get("/users/{id}/avatar")
def user_avatar(id: int):
    """Get user avatar."""
    return db.get_user_avatar(id)

@app.post("/users/{id}/avatar")
def set_user_avatar(id: int, avatar: str):
    """Set user avatar."""
    return db.set_user_avatar(id, avatar)

@app.get("/events/{id}/month/{month}")
def events_month(id:int, month: int):
    """Get events for a given month."""
    return db.get_events_month(id, month)

@app.get("/events/{id}/week/{week}")
def events_week(id:int, week: int):
    """Get events for a given week."""
    return db.get_events_week(id, week)

@app.post("/events/create")
def create_event(event: Event):
    """Create a new event."""
    return db.create_event(event.user_id, event.title, event.description, event.type, event.priority, event.startdate, event.enddate, event.place)