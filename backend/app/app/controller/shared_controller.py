import uuid
import hashlib
import datetime
from decimal import Decimal
import time

from extensions import db


def get_uuid4():
    return uuid.uuid4()


def get_seconds_since_epoch():
    return int(time.time())


def get_uuid4_as_string():
    return str(get_uuid4())


def get_field_from_json(json, field_name):
    return json[field_name]


def get_json_from_request(request):
    return request.get_json()


def hash_to_sha256(normal_input):
    normal_input = encode_to_utf_8(normal_input)
    generated_hash = generate_hash(normal_input)
    readable_hash = hash_to_readable_form(generated_hash)
    return readable_hash


def encode_to_utf_8(input_to_encode):
    return input_to_encode.encode('utf-8')


def generate_hash(input_to_hash):
    return hashlib.sha256(input_to_hash)


def hash_to_readable_form(generated_hash):
    return generated_hash.hexdigest()


def hash_to_sha256_str(normal_input):
    return str(hash_to_sha256(normal_input))


def get_database_session():
    return db.session


def format_decimals_in_response_as_dict(array_all_elements):
    for element in array_all_elements:
        for field in element:
            if isinstance(element[field], Decimal):
                element[field] = format_decimal_number(element[field])
    return array_all_elements


def format_decimal_number(number):
    if number % 1 == 0:
        return int(number)
    return float(number)


def string_date_to_datetime_object(date_string):
    return datetime.datetime.strptime(date_string, '%d-%m-%Y')


def get_nights_between_datetime_days(arrival_date, departure_date):
    return (departure_date - arrival_date).days


def convert_string_date_to_date_object(date):
    return datetime.datetime.strptime(date, '%Y-%m-%d %H:%M:%S')


def get_current_date():
    return datetime.datetime.today()


def get_current_date_with_time():
    return datetime.datetime.today()


def is_json_field_valid_type(json, field, datatype):
    return isinstance(get_field_from_json(json, field), datatype)


def is_phonenumber_valid(phone_number):
    return 8 < len(phone_number) < 16
