import mariadb
import os
from dotenv import load_dotenv


load_dotenv()


def get_connection():
    """Get connection to database."""
    connection = mariadb.connect(
        user ="",
        password ="",
        host ="",
        port ="",
        database = ""
    )
    return connection
