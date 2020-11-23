from main import create_app
from test_config import Config
from flask import Flask


def test_create_app():
    app = create_app(Config)
    assert isinstance(app, Flask)
