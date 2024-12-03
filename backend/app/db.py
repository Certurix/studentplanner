import mariadb
import os
from dotenv import load_dotenv


load_dotenv()


def get_connection():
    """Get connection to database."""
    connection = mariadb.connect(
        user ="root",
        password ="123456789",
        host ="localhost",
        port =3306,
        database = "studentplanner"
    )
    return connection

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