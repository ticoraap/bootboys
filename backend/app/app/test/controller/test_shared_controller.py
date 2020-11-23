import json
from controller import shared_controller
import datetime


def test_get_field_from_json():
    json_payload = '{"username": "pizza"}'
    json_object = json.loads(json_payload)
    assert shared_controller.get_field_from_json(json_object, "username") == "pizza"


def test_format_decimal_number_int():
    assert isinstance(shared_controller.format_decimal_number(1), int)


def test_format_decimal_number_float():
    assert isinstance(shared_controller.format_decimal_number(1.5), float)


def test_hash_to_sha256_str():
    assert shared_controller.hash_to_sha256_str('testHash256') == 'b00e90f49394ce3532726822162bf613a75061e1330c777605d5bccc77bf6f44'


def test_string_date_to_datetime_object_double_digit_month_and_day():
    assert shared_controller.string_date_to_datetime_object('25-06-2020') == datetime.datetime(2020, 6, 25, 0, 0)


def test_string_date_to_datetime_object_single_digit_month_and_day():
    assert shared_controller.string_date_to_datetime_object('2-6-2020') == datetime.datetime(2020, 6, 2, 0, 0)


def test_get_nights_between_datetime_days():
    arrival_day = shared_controller.string_date_to_datetime_object('25-06-2020')
    departure_day = shared_controller.string_date_to_datetime_object('26-06-2020')
    assert shared_controller.get_nights_between_datetime_days(arrival_day, departure_day) == 1


def test_is_json_field_valid_type_success():
    json = {"username": "test"}
    assert shared_controller.is_json_field_valid_type(json, "username", str)


def test_is_json_field_valid_type_fail():
    json = {"username": "test"}
    assert not shared_controller.is_json_field_valid_type(json, "username", int)


def test_is_phonenumber_valid_success():
    test_number = "1234567980"
    assert shared_controller.is_phonenumber_valid(test_number)


def test_is_phonenumber_valid_too_short():
    test_number = "12"
    assert not shared_controller.is_phonenumber_valid(test_number)


def test_is_phonenumber_valid_too_long():
    test_number = "1234567980111213141516171819"
    assert not shared_controller.is_phonenumber_valid(test_number)
