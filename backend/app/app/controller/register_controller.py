from flask import Blueprint, request
from flask_cors import cross_origin
from dao import user_dao
from models.user import User
from controller.shared_controller import get_json_from_request, get_field_from_json, is_json_field_valid_type

register_api = Blueprint('registerApi', __name__)

username = 'username'
password = 'password'  # nosec
firstname = 'firstname'
surname = 'surname'
phonenumber = 'phonenumber'
mail = 'mail'


@register_api.route('/register', methods=['POST'])
@cross_origin()
def register():
    user_json = get_json_from_request(request=request)
    if validate_input(user_json):
        user = json_to_user(user_json)
        worked = user_dao.insert_user(user)
        if worked:
            return {"worked": True}
    return {"worked": False}


def validate_input(json):
    return is_json_field_valid_type(json, username, str) and is_json_field_valid_type(json, password, str) and \
           is_json_field_valid_type(json, firstname, str) and is_json_field_valid_type(json, mail, str) and \
           is_json_field_valid_type(json, phonenumber, str)


def json_to_user(user_json):
    return User(username=get_field_from_json(user_json, username), password=get_field_from_json(user_json, password)
                , firstname=get_field_from_json(user_json, firstname),
                surname=get_field_from_json(user_json, surname)
                , phonenumber=get_field_from_json(user_json, phonenumber),
                mail=get_field_from_json(user_json, mail))
