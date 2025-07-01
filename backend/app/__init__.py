from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

from . import db

app = FastAPI(root_path="/api")

origins = [
    "http://localhost:3000", 
    "localhost:3000", 
    "http://localhost:5173", 
    "localhost:5173", 
    "http://localhost:5174", 
    "localhost:5174",
    "http://157.90.111.60",
    "http://frontend.157.90.111.60.sslip.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request bodies
class LoginUser(BaseModel):
    email: str
    password: str
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
    userId: int
    title: str
    description: str
    type: int
    priority: int
    startdate: str
    enddate: str
    place: str
    
# Simple API entry points

@app.post("/login")
def login(user: LoginUser):
    """Login user."""
    user_id = db.verify_user(user.email, user.password)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user_id

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

@app.get("/users/{id}/profile")
def user_profile(id: int):
    """Get user profile data."""
    return db.get_user_profile(id)

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
def set_user_class(id: int, classname: UserClass):
    """Set user class."""
    return db.set_user_class(id, classname.classname)

@app.get("/users/{id}/lastname")
def user_lastname(id: int):
    """Get user lastname."""
    return db.get_user_lastname(id)

@app.post("/users/{id}/lastname")
def set_user_lastname(id: int, lastname: UserLastname):
    """Set user lastname."""
    return db.set_user_lastname(id, lastname.lastname)

@app.post("/users/{id}/password")
def set_user_password(id: int, password: str):
    """Set user password."""
    return db.set_user_password(id, password)

@app.get("/users/{id}/avatar")
def user_avatar(id: int):
    """Get user avatar."""
    return db.get_user_avatar(id)

@app.post("/users/{id}/avatar")
def set_user_avatar(id: int, avatar: str):
    """Set user avatar."""
    return db.set_user_avatar(id, avatar)

@app.get("/events/{id}/month/{month}")
def events_month(id: int, month: int, future: bool = False, type: int | None = None):
    """Get events for a given month. If future is True, only return future events. If event_type is provided, filter by event type."""
    return db.get_events_month(id, month, future, type)

@app.get("/events/{id}/week/{week}")
def events_week(id: int, week: int, future: bool = False, type: int | None = None):
    """Get events for a given week. If future is True, only return future events. If event_type is provided, filter by event type."""
    return db.get_events_week(id, week, future, type)

@app.post("/events/create")
def create_event(event: Event):
    """Create a new event."""
    event.startdate = datetime.fromisoformat(event.startdate.replace("Z", "")).strftime('%Y-%m-%d %H:%M:%S')
    event.enddate = datetime.fromisoformat(event.enddate.replace("Z", "")).strftime('%Y-%m-%d %H:%M:%S')
    return db.set_event(event.userId, event.title, event.description, event.type, event.priority, event.startdate, event.enddate, event.place)

@app.delete("/events/delete/{id}")
def delete_event(id: int):
    """Delete an event by ID."""
    return db.delete_event(id)

@app.put("/events/update/{id}")
def update_event(id: int, event: Event):
    """Update an existing event by ID."""
    event.startdate = datetime.fromisoformat(event.startdate.replace("Z", "")).strftime('%Y-%m-%d %H:%M:%S')
    event.enddate = datetime.fromisoformat(event.enddate.replace("Z", "")).strftime('%Y-%m-%d %H:%M:%S')
    return db.update_event(id, event.title, event.description, event.type, event.priority, event.startdate, event.enddate, event.place)

@app.get("/events/search")
def search_events(query: str, user_id: int):
    """Search for events by query for a specific user."""
    print(f"Searching for '{query}' for user {user_id}")
    try:
        results = db.search_events(query, user_id)
        print(f"Found {len(results)} results")
        return results
    except Exception as e:
        print(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
