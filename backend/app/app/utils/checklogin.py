from functools import wraps
from flask import request, Response
from extensions import user_manager


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'Authorization' in request.headers:
            account = user_manager.token_manager.verify_token(request.headers['Authorization'])
            if account is not None and len(account) != 0:
                return f(*args, **kwargs)
        return Response(status=403)
    return decorated_function


def get_account_id(request):
    return user_manager.token_manager.verify_token(request.headers['Authorization'])[0]
