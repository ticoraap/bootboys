class Config:
    DEBUG = True
    TESTING = True
    CSRF_ENABLED = True
    SECRET_KEY = "ikbengeheim"

    MAIL_DEBUG = True
    MAIL_SUPPRESS_SEND = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = "test@email.com"
    MAIL_PASSWORD = "herpederp"

    USER_ENABLE_EMAIL = False
    USER_ENABLE_USERNAME = True

    STRIPE_SECRET_KEY = "ggrwefwefwefwwef"
    STRIPE_SECRET_WEBHOOK = ''
    ALLOWED_ORIGINS = '*'

    DATABASE_DRIVER = "postgres"
    DATABASE_IP = "127.0.0.1"
    DATABASE_PORT = "5432"
    DATABASE_USERNAME = "testUser"
    DATABASE_PASSWORD = "Sinterklaas"
    DATABASE_NAME = "kerstman"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = DATABASE_DRIVER + "://" + \
                              DATABASE_USERNAME + ":" + DATABASE_PASSWORD + "@" + \
                              DATABASE_IP + ":" + DATABASE_PORT + "/" + DATABASE_NAME
