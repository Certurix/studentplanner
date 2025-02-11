import mariadb
import os
from dotenv import load_dotenv


load_dotenv()


def get_connection():
    """Get connection to database."""
    connection = mariadb.connect(
        user ="root",
        password ="123456789",
        host ="127.0.0.1",
        port =3306,
        database = "studentplanner"
    )
    return connection

def register_user(name, lastname, email, password):
    """Register new user."""
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('''
        INSERT INTO user (name, lastname, email, password)
        VALUES (?, ?, ?, ?)
    ''', (name, lastname, email, password))
    connection.commit()
    cursor.close()
    return True

def get_users(id=None):
    """Get list of users.

    If id is not None, the list contains only the country with given id.

    """
    cursor = get_connection().cursor(dictionary = True)
    if id is None:
        cursor.execute('''
            SELECT *
            FROM user
        ''')
        rows = cursor.fetchall()
    else:
        rows = cursor.execute('''
            SELECT *
            FROM user
            WHERE id = ?
        ''', (id,))
        rows = cursor.fetchone()
    cursor.close()
    return rows

def get_user_name(id):
    """Get user name."""
    cursor = get_connection().cursor()
    cursor.execute('''
        SELECT name
        FROM user
        WHERE id = ?
    ''', (id,))
    row = cursor.fetchone()
    cursor.close()
    return row[0] if row else None

def get_user_lastname(id):
    """Get user lastname."""
    cursor = get_connection().cursor()
    cursor.execute('''
        SELECT lastname
        FROM user
        WHERE id = ?
    ''', (id,))
    row = cursor.fetchone()
    cursor.close()
    return row[0] if row else None

def get_user_email(id):
    """Get user email."""
    cursor = get_connection().cursor()
    cursor.execute('''
        SELECT email
        FROM user
        WHERE id = ?
    ''', (id,))
    row = cursor.fetchone()
    cursor.close()
    return row[0] if row else None

def get_user_school(id):
    """Get user school."""
    cursor = get_connection().cursor()
    cursor.execute('''
        SELECT school
        FROM user
        WHERE id = ?
    ''', (id,))
    row = cursor.fetchone()
    cursor.close()
    return row[0] if row else None

def get_user_class(id):
    """Get user class."""
    cursor = get_connection().cursor()
    cursor.execute('''
        SELECT class
        FROM user
        WHERE id = ?
    ''', (id,))
    row = cursor.fetchone()
    cursor.close()
    return row[0] if row else None

def get_user_avatar(id):
    """Get user avatar."""
    cursor = get_connection().cursor()
    cursor.execute('''
        SELECT avatar
        FROM user
        WHERE id = ?
    ''', (id,))
    row = cursor.fetchone()
    cursor.close()
    return row[0] if row else None

def set_user_name(id, name):
    """Update user name."""
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('''
        UPDATE user
        SET name = ?
        WHERE id = ?
    ''', (name, id))
    connection.commit()
    cursor.close()
    return True

def set_user_lastname(id, lastname):
    """Update user lastname."""
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('''
        UPDATE user
        SET lastname = ?
        WHERE id = ?
    ''', (lastname, id))
    connection.commit()
    cursor.close()
    return True

def set_user_email(id, email):
    """Update user email."""
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('''
        UPDATE user
        SET email = ?
        WHERE id = ?
    ''', (email, id))
    connection.commit()
    cursor.close()
    return True

def set_user_school(id, school):
    """Update user school."""
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('''
        UPDATE user
        SET school = ?
        WHERE id = ?
    ''', (school, id))
    connection.commit()
    cursor.close()
    return True

def set_user_class(id, user_class):
    """Update user class."""
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('''
        UPDATE user
        SET class = ?
        WHERE id = ?
    ''', (user_class, id))
    connection.commit()
    cursor.close()
    return True

def set_user_avatar(id, avatar):
    """Update user avatar."""
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('''
        UPDATE user
        SET avatar = ?
        WHERE id = ?
    ''', (avatar, id))
    connection.commit()
    cursor.close()
    return True

def get_events_month(id, month):
    """Get list of events in given month and user ID."""
    cursor = get_connection().cursor(dictionary=True)
    cursor.execute('''
        SELECT ID, title, description, type, priority, startdate, enddate, place
        FROM events
        WHERE (MONTH(startdate) = ? OR MONTH(enddate) = ?) AND id_user = ?
    ''', (month, month, id))
    rows = cursor.fetchall()
    cursor.close()
    return rows

def get_events_week(id, week):
    """Get list of events in given week and user ID."""
    cursor = get_connection().cursor(dictionary=True)
    cursor.execute('''
        SELECT ID, title, description, type, priority, startdate, enddate, place
        FROM events
        WHERE (WEEK(startdate) = ? OR WEEK(enddate) = ?) AND id_user = ?
    ''', (week, week, id))
    rows = cursor.fetchall()
    cursor.close()
    return rows

def set_event(id, title, description, type, priority, startdate, enddate, place):
    """Set event."""
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('''
        INSERT INTO events (id_user, title, description, type, priority, startdate, enddate, place)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (id, title, description, type, priority, startdate, enddate, place))
    connection.commit()
    cursor.close()
    return True