import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    DEBUG = bool(os.environ['DEBUG'])
    TESTING = bool(os.environ['TESTING'])
    CSRF_ENABLED = True
    SECRET_KEY = os.environ['SECRET_KEY']

    MAIL_DEBUG = False
    MAIL_SUPPRESS_SEND = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.environ['EMAIL']
    MAIL_PASSWORD = os.environ['EMAIL_PASS']

    USER_ENABLE_EMAIL = False
    USER_ENABLE_USERNAME = True

    STRIPE_SECRET_KEY = os.environ['STRIPE_SECRET_KEY']
    STRIPE_SECRET_WEBHOOK = os.environ['STRIPE_WEBHOOK_SECRET']
    ALLOWED_ORIGINS = os.environ['ALLOWED_ORIGINS']

    DATABASE_DRIVER = os.environ['DATABASE_DRIVER']
    DATABASE_IP = os.environ['DATABASE_IP']
    DATABASE_PORT = os.environ['DATABASE_PORT']
    DATABASE_USERNAME = os.environ['DATABASE_USERNAME']
    DATABASE_PASSWORD = os.environ['DATABASE_PASSWORD']
    DATABASE_NAME = os.environ['DATABASE_NAME']
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = DATABASE_DRIVER + "://" + \
        DATABASE_USERNAME + ":" + DATABASE_PASSWORD + "@" + \
        DATABASE_IP + ":" + DATABASE_PORT + "/" + DATABASE_NAME


class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
