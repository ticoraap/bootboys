import json
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from controller.shared_controller import get_json_from_request, get_field_from_json
from dao import dock_dao, reservation_dao
from extensions import socket_io
from models.address import Address
from models.dock import Dock
from utils.checklogin import login_required, get_account_id

dock_api = Blueprint('dockApi', __name__)


@dock_api.route('/address', methods=['POST'])
@cross_origin()
@login_required
def add_address():
    userid = get_account_id(request)
    address_json = get_json_from_request(request=request)
    address_json['userid'] = userid
    address = json_to_address(address_json)
    worked = dock_dao.insert_address(address)
    if worked:
        return {"worked": True}
    return {"worked": False}


@dock_api.route('/address', methods=['GET'])
@cross_origin()
def get_all_address():
    userid = get_account_id(request)
    all_address = dock_dao.get_all_addresses(userid)
    return jsonify(all_address)


@dock_api.route('/address/<addressid>', methods=['GET'])
@cross_origin()
def get_address(addressid):
    address = dock_dao.get_address_by_id(addressid)
    return address


@dock_api.route('/dock', methods=['POST'])
@cross_origin()
@login_required
def add_dock():
    userid = get_account_id(request)
    dock_json = get_json_from_request(request=request)

    facilities_string = json.dumps(dock_json['facilities'])
    dock_json['facilities'] = facilities_string
    dock_json['userid'] = userid

    dock = json_to_dock(dock_json)
    dockid = dock_dao.insert_dock(dock)
    if isinstance(dockid,int):
        return {"dockid": dockid}
    return {"worked": False}


@dock_api.route('/dock/<dockid>', methods=['DELETE'])
@cross_origin()
@login_required
def delete_dock(dockid):
    userid = get_account_id(request)

    worked = dock_dao.delete_dock(dockid=dockid, userid=userid)
    if worked:
        return "succes", 200
    return "error", 500


@dock_api.route('/availableDocks')
@cross_origin()
def get_all_available_docks_for_rental():
    available_docks_for_rental = dock_dao.get_all_docks()
    return jsonify(available_docks_for_rental)


@dock_api.route('/userdocks')
@cross_origin()
@login_required
def get_all_docks_from_user():
    userid = get_account_id(request)
    users_docks = dock_dao.get_all_docks_from_user(userid)
    return jsonify(users_docks)


def json_to_address(address_json):
    userid = get_field_from_json(address_json, 'userid')
    street = get_field_from_json(address_json, 'street')
    housenumber = get_field_from_json(address_json, 'houseNumber')
    city = get_field_from_json(address_json, 'city')
    postalcode = get_field_from_json(address_json, 'postalcode')
    country = get_field_from_json(address_json, 'country')
    state = get_field_from_json(address_json, 'state')
    address = Address(userid=userid,
                      street=street,
                      housenumber=housenumber,
                      city=city,
                      postalcode=postalcode,
                      country=country,
                      state=state)

    return address


def json_to_dock(dock_json):
    userid = get_field_from_json(dock_json, 'userid')
    addressid = get_field_from_json(dock_json, 'addressid')
    name = get_field_from_json(dock_json, 'name')
    description = get_field_from_json(dock_json, 'description')
    length = get_field_from_json(dock_json, 'length')
    width = get_field_from_json(dock_json, 'width')
    price = get_field_from_json(dock_json, 'price')
    place = get_field_from_json(dock_json, 'place')
    latitude = get_field_from_json(dock_json, 'latitude')
    longitude = get_field_from_json(dock_json, 'longitude')
    facilities = get_field_from_json(dock_json, 'facilities')

    return Dock(userid=userid,
                addressid=addressid,
                name=name,
                description=description,
                length=length,
                width=width,
                price=price,
                place=place,
                latitude=latitude,
                longitude=longitude,
                facilities=facilities)


@dock_api.route('/getDockById/<dockid>', methods=['GET'])
@cross_origin()
def get_dock_by_dockid(dockid):
    dock = dock_dao.get_dock_by_dockid(dockid)
    address = dock_dao.get_address_by_id(dock[0]['addressid'])
    reservation_dates = get_all_reservationdates(dockid)
    return jsonify(dock[0], address, reservation_dates)


def notify_all_on_dockpage(dock_id, arrival_date, departure_date):
    payload = {"dockid": dock_id, "arrivaldate": arrival_date, "departuredate": departure_date}
    json_payload = json.dumps(payload, indent=4, sort_keys=True, default=str)
    socket_io.emit("dockHasBeenRented", json_payload, json=True, broadcast=True, namespace='/dock')


def get_all_reservationdates(dockid):
    dates = reservation_dao.get_reservation_dates_by_dock_id(dockid)
    return dates
