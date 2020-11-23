from main import create_app
from test_config import Config
from controller.mail_controller import make_message
from flask_mail import Message, Mail


def test_send_mail():
    app = create_app(Config)
    Mail(app)
    with app.test_request_context('/'):
        make_message('test@test.com', 'test', '<h1>this is a test</h1>')
