from sqlalchemy.exc import IntegrityError
import traceback
from models.user import User
from extensions import db

session = db.session


def get_user_by_username(username):
    return User.query.filter_by(username=username).first()


def get_user_by_email(email):
    return User.query.filter_by(mail=email).first()


def insert_user(user: User):
    try:
        session.add(user)
        session.commit()
    except IntegrityError:
        traceback.print_exc()
        return False
    return True


def update_user_with_changes(changes):
    user = get_user_by_userid(changes['userid'])
    for i in changes:
        setattr(user, i, changes[i])
        session.commit()


def does_value_exist(label, value):
    kwargs = {label: value}
    if not User.query.filter_by(**kwargs).all():
        return False
    return True


def get_user_by_userid(userid):
    return session.query(User).filter_by(userid=userid).first()
