from flask import Blueprint, request, jsonify
from dao.user_dao import does_value_exist, update_user_with_changes, get_user_by_userid
from utils.checklogin import login_required
from extensions import user_manager
from controller.shared_controller import is_json_field_valid_type, is_phonenumber_valid

user_api = Blueprint('userApi', __name__)


@user_api.route("/tryAccountUpdate", methods=['POST'])
@login_required
def try_update_user():
    changes = request.get_json()
    result = check_for_uniqueness(changes.copy())
    if not result and validate_changes(changes):
        update_user_with_changes(changes)
        user_to_frontend = create_user_for_frontend(get_user_by_userid(changes['userid']))

        return jsonify(user_to_frontend), 200

    result['status'] = 413
    return jsonify(result), 200


def check_for_uniqueness(values_to_check):
    non_unique_values = {}
    for i in remove_allowed_duplicates_fields(values_to_check):
        if does_value_exist(i, values_to_check[i]):
            non_unique_values[i] = values_to_check[i]
    return non_unique_values


def create_token(userid, username):
    token_manager = user_manager.token_manager
    return token_manager.generate_token(str(userid), username)


def create_user_for_frontend(user):
    user_to_frontend = user.to_dict()
    user_to_frontend['token'] = create_token(user.userid, user.username)
    return user_to_frontend


def remove_allowed_duplicates_fields(values_to_check):
    allowed_duplicates = ['userid', 'password', 'surname', 'firstname']
    for i in allowed_duplicates:
        if i in values_to_check:
            values_to_check.pop(i)
    return values_to_check


def validate_changes(changes):
    validation_output = []
    for i in changes:
        if i == "userid":
            validation_output.append(is_json_field_valid_type(changes, i, int))
        else:
            validation_output.append(is_json_field_valid_type(changes, i, str))

    if "phonenumber" in changes:
        validation_output.append(is_phonenumber_valid(changes["phonenumber"]))

    return False not in validation_output
