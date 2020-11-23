from sqlalchemy.exc import IntegrityError
import traceback
from models.reservation import Reservation
from extensions import db
session = db.session


def insert_reservation(reservation: Reservation):
    try:
        session.add(reservation)
        session.commit()
    except IntegrityError:
        traceback.print_exc()
        return False
    return True


def update_paid(payment_id):
    reservation = get_reservation_by_payment_id(payment_id)
    setattr(reservation, 'paid', True)
    session.commit()


def get_reservation_by_payment_id(payment_id):
    return Reservation.query.filter_by(paymentid=payment_id).first()


def get_reservation_by_reservation_id(reservation_id):
    return Reservation.query.filter_by(reservationid=reservation_id).first()


def get_reservation_dates_by_dock_id(dockid):
    return Reservation.query.with_entities(Reservation.arrivaldate, Reservation.departuredate)\
        .filter_by(dockid=dockid).all()


def get_all_reservations():
    return Reservation.query.all()


def remove_reservation_by_reservation_id(reservation_id):
    try:
        reservation_to_remove = get_reservation_by_reservation_id(reservation_id)
        session.delete(reservation_to_remove)
        session.commit()
    except Exception as exception:
        print(exception)
