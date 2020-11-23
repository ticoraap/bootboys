from datetime import date
from flask import Blueprint

base_api = Blueprint('baseApi', __name__)


@base_api.route('/')
def base():
    return \
        {
            "Date": str(date.today()),
            "Version": 1.0,
            "API booted successfully": True
        }
