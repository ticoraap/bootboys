from flask import Flask
from flask_cors import CORS
from flask_script import Manager
from flask_migrate import MigrateCommand
from extensions import db, migrate, user_manager, cors, mail, socket_io
from models.user import User
from controller.login_controller import login_api
from controller.register_controller import register_api
from controller.user_controller import user_api
from controller.dock_controller import dock_api
from controller.payment_controller import payment_api, remove_unpaid_reservations
from base_url import base_api
from controller import payment_controller
import atexit
from apscheduler.schedulers.background import BackgroundScheduler

ONE_HOUR_BETWEEN_EXECUTIONS = 3600  # Seconds


def create_app(config):
    set_stripe_secrets(config)
    app = Flask(__name__)
    set_app_context(app)
    app.config.from_object(config)
    register_extensions(app, config)
    register_commands(app)
    register_blueprints(app)
    CORS(app, resources={r"/*": {"origins": config.ALLOWED_ORIGINS}})
    make_and_execute_background_thread()

    return app


def set_stripe_secrets(config):
    payment_controller.stripe.api_key = config.STRIPE_SECRET_KEY
    payment_controller.stripe_webhook_secret = config.STRIPE_SECRET_WEBHOOK


def set_app_context(app):
    payment_controller.app_context = app


def make_and_execute_background_thread():
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=remove_unpaid_reservations, trigger='interval', seconds=ONE_HOUR_BETWEEN_EXECUTIONS)
    scheduler.start()

    # Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown()) # noqa


def register_extensions(app, config):
    db.init_app(app)
    user_manager.init_app(app, db, User)
    migrate.init_app(app, db)
    cors.init_app(app)
    mail.init_app(app)
    socket_io.init_app(app, cors_allowed_origins=config.ALLOWED_ORIGINS)


def register_commands(app):
    manager = Manager(app)
    manager.add_command('db', MigrateCommand)
    

def register_blueprints(app):
    app.register_blueprint(login_api)
    app.register_blueprint(register_api)
    app.register_blueprint(user_api)
    app.register_blueprint(dock_api)
    app.register_blueprint(base_api)
    app.register_blueprint(payment_api)
