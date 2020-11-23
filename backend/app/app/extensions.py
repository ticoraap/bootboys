from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_user import UserManager
from flask_migrate import Migrate
from flask_cors import CORS
from flask_socketio import SocketIO
db = SQLAlchemy()
user_manager = UserManager(None, None, None)
migrate = Migrate()
cors = CORS()
mail = Mail()
socket_io = SocketIO()
