from controller.payment_controller import calculate_if_payment_time_is_expired, json_to_fields_as_array, \
    calculate_price_for_nights, euro_to_euro_cent, round_number_to_integer
import time
import datetime


current_time = int(time.time())
seconds_in_one_hour = 3600
seconds_offset = 100
meta_data_json_input = {
    'Customer Name': 'test test',
    'Username': 'test',
    'Phone Number': '1231231233',
    'Mail Address': 'test@test.com',
    'User ID': 1
}
json_input = {
    'dockId': 1,
    'arrivalDate': '29-6-2020',
    'departureDate': '02-7-2020',
    'tenantId': 1,
    'metaData': meta_data_json_input
}
dock_price = 30
dock_price_in_cents = 3000
nights = 3
price_in_cents_for_3_nights = 13500
round_up_to_1 = 0.56
round_down_to_1 = 1.49


def test_calculate_if_payment_time_is_expired_true():
    time_expired_seconds = current_time - (seconds_in_one_hour + seconds_offset)
    assert calculate_if_payment_time_is_expired(time_expired_seconds)


def test_calculate_if_payment_time_is_expired_false():
    time_expired_seconds = current_time + seconds_offset
    assert (not calculate_if_payment_time_is_expired(time_expired_seconds))


def test_json_to_fields_as_array():
    expected_output = [1, datetime.datetime(2020, 6, 29, 0, 0), datetime.datetime(2020, 7, 2, 0, 0),
                       {'Customer Name': 'test test', 'Username': 'test',
                        'Phone Number': '1231231233',
                        'Mail Address': 'test@test.com', 'User ID': 1}, 1]

    assert json_to_fields_as_array(json_input) == expected_output


def test_calculate_price_for_nights():
    assert calculate_price_for_nights(dock_price, nights) == price_in_cents_for_3_nights


def test_euro_to_euro_cent():
    assert euro_to_euro_cent(dock_price) == dock_price_in_cents


def test_round_up():
    assert round_number_to_integer(round_up_to_1) == 1


def test_round_down():
    assert round_number_to_integer(round_down_to_1) == 1



