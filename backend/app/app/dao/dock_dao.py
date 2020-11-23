from sqlalchemy.exc import IntegrityError
from sqlalchemy import exc
import traceback
from models.address import Address
from models.dock import Dock
from extensions import db
from controller.shared_controller import format_decimals_in_response_as_dict
import json


def get_address_by_id(addressid):
    return Address.query.get(addressid).as_dict()


def get_all_addresses(userid):
    address_list = []
    for address in Address.query.filter_by(userid=userid).all():
        address_list.append(address.as_dict())
    return address_list


def insert_address(address: Address):
    session = db.session
    try:
        session.add(address)
        session.commit()
    except IntegrityError:
        traceback.print_exc()
        return False
    return True


def insert_dock(dock: Dock):
    session = db.session
    try:
        session.add(dock)
        session.commit()
    except IntegrityError:
        traceback.print_exc()
        return False
    return dock.dockid


def delete_dock(userid, dockid):
    session = db.session
    try:
        dock_to_remove = Dock.query.filter_by(userid=userid,dockid=dockid).first()
        session.delete(dock_to_remove)
        session.commit()
        return True
    except exc.SQLAlchemyError:
        return False


def get_available_docks_for_rental():
    available_docks = []
    for dock in Dock.query.filter_by(rented=False).all():
        available_docks.append(dock_to_dict(dock))
    format_dock_numbers(available_docks)
    return available_docks


def get_all_docks():
    available_docks = []
    for dock in Dock.query.all():
        available_docks.append(dock_to_dict(dock))
    available_docks = format_dock_numbers(available_docks)
    return available_docks


def get_all_docks_from_user(userid):
    user_docks = []
    for dock in Dock.query.filter_by(userid=userid).all():
        user_docks.append(dock_to_dict(dock))
        format_dock_numbers(user_docks)
    return user_docks


def dock_to_dict(dock):
    dock_dict = dock.as_dict()
    facilities = json.loads(dock_dict['facilities'])
    dock_dict['facilities'] = facilities
    return dock_dict


def format_dock_numbers(available_docks):
    return format_decimals_in_response_as_dict(available_docks)


def get_dock_by_dockid(dockid):
    dock = [Dock.query.filter_by(dockid=dockid).first().as_dict()]
    formatted_dock = format_dock_numbers(dock)
    return formatted_dock
