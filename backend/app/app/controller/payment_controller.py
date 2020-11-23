import os
import stripe
from flask import Blueprint, request, jsonify
from controller.shared_controller import string_date_to_datetime_object, get_nights_between_datetime_days, \
    get_json_from_request, get_field_from_json, get_seconds_since_epoch
from dao.dock_dao import get_dock_by_dockid
from dao.reservation_dao import insert_reservation, update_paid, remove_reservation_by_reservation_id
from models.reservation import Reservation
from controller.dock_controller import notify_all_on_dockpage
from dao.reservation_dao import get_all_reservations
from utils.checklogin import login_required

payment_api = Blueprint('paymentApi', __name__)
stripe.api_key = ""
stripe_webhook_secret = ''  # nosec
commission_fee_multiplier = 1.5
info_dock_id = 0
info_arrival_date = 1
info_departure_date = 2
info_meta_data = 3
info_tenant_id = 4
first_dock_in_array = 0
one_day_old_reservation = -2 
seconds_in_one_hour = 3600
app_context = None
arrivalDate = 'arrivalDate'
departureDate = 'departureDate'
dockId = 'dockId'
tenantId = 'tenantId'
metaData = 'metaData'


def remove_unpaid_reservations():
    with app_context.app_context():
        reservations = get_all_reservations()
        for reservation in reservations:
            if check_if_should_be_removed(reservation):
                remove_reservation_by_reservation_id(reservation.reservationid)


def check_if_should_be_removed(reservation):
    if not reservation.paid:
        return calculate_if_payment_time_is_expired(reservation.reservationtimestamp)
    return False


def calculate_if_payment_time_is_expired(payment_time_stamp):
    current_time = get_seconds_since_epoch()
    return (current_time - payment_time_stamp) >= seconds_in_one_hour


@payment_api.route('/create-payment-intent', methods=['POST'])
@login_required
def create_post_and_insert_payment_intent_in_database():
    json_input = get_json_from_request(request)
    info = json_to_fields_as_array(json_input)
    dock = get_dock_by_dockid(info[info_dock_id])

    if dock is not None:
        amount_of_nights = get_nights_between_datetime_days(info[info_arrival_date], info[info_departure_date])
        price = calculate_price_for_nights(dock[first_dock_in_array]['price'], amount_of_nights)
        metadata = add_dock_info_to_metadata(info, json_input)

        payment_intent = create_payment_intent(price, metadata)

        try:
            insert_reservation_in_database(info, price, payment_intent.id)
            notify_all_on_dockpage(info[info_dock_id], info[info_arrival_date], info[info_departure_date])
            return jsonify(
                {'publishableKey': os.getenv('STRIPE_PUBLISHABLE_KEY'), 'clientSecret': payment_intent.client_secret})
        except Exception as e:
            return jsonify(error=str(e)), 403

    return jsonify(status=404)


@payment_api.route('/webhookstripepaymentsuccess', methods=['POST'])
def recieve_and_process_webhook_from_stripe_payment_succsessfull():
    request_data = request.get_json()

    if stripe_webhook_secret:
        signature = request.headers.get('stripe-signature')
        try:
            event = create_stripe_webhook_event(request, signature, stripe_webhook_secret)
            check_and_update_reservation(event, request_data)
        except Exception as e:
            print(e)
    return jsonify({'status': 'success'})


def create_stripe_webhook_event(request, signature, stripe_webhook_secret):
    return stripe.Webhook.construct_event(
                payload=request.data, sig_header=signature, secret=stripe_webhook_secret
            )


def check_and_update_reservation(event, request_data):
    event_type = event['type']
    if event_type == 'payment_intent.succeeded':
        payment_id = request_data['data']['object']['id']
        update_reservation_paid(payment_id)


def add_dock_info_to_metadata(info, json_input):
    info[info_meta_data][dockId] = info[info_dock_id]
    info[info_meta_data][arrivalDate] = get_field_from_json(json_input, arrivalDate)
    info[info_meta_data][departureDate] = get_field_from_json(json_input, departureDate)
    return info[info_meta_data]


def json_to_fields_as_array(json_input):
    dock_id = get_field_from_json(json_input, dockId)
    arrival_date = string_date_to_datetime_object(get_field_from_json(json_input, arrivalDate))
    departure_date = string_date_to_datetime_object(get_field_from_json(json_input, departureDate))
    tenant_id = get_field_from_json(json_input, tenantId)
    meta_data = get_field_from_json(json_input, metaData)

    info = [dock_id, arrival_date, departure_date, meta_data, tenant_id]
    return info


def create_payment_intent(amount, metadata):
    payment_intent = stripe.PaymentIntent.create(
        amount=amount,
        currency='eur',
        payment_method_types=['card', 'ideal'],
        metadata=metadata
    )
    return payment_intent


def calculate_price_for_nights(dock_price, amount_nights):
    price_for_nights = dock_price * amount_nights
    total_price_including_fee = price_for_nights * commission_fee_multiplier
    total_price_including_fee_in_cents = euro_to_euro_cent(total_price_including_fee)
    total_price_including_fee_in_cents = round_number_to_integer(total_price_including_fee_in_cents)

    return total_price_including_fee_in_cents


def euro_to_euro_cent(price):
    return price * 100


def round_number_to_integer(number):
    return int(round(number, 0))


def insert_reservation_in_database(info, price, paymentid):
    reservation = fields_to_reservation(info, price, paymentid)
    insert_reservation(reservation)


def fields_to_reservation(info, price, paymentid):
    return Reservation(tenantid=info[info_tenant_id], dockid=info[info_dock_id],
                       reservationtimestamp=get_seconds_since_epoch(), arrivaldate=info[info_arrival_date],
                       departuredate=info[info_departure_date], paid=False, price=price, paymentid=paymentid
                       )


def update_reservation_paid(payment_id):
    update_paid(payment_id)
