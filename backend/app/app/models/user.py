from flask_user import UserMixin
from extensions import db


class User(db.Model, UserMixin):

    __tablename__ = 'users'
    userid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)
    firstname = db.Column(db.Text, nullable=False)
    surname = db.Column(db.Text, nullable=False)
    phonenumber = db.Column(db.Text, nullable=False, unique=True)
    mail = db.Column(db.Text, nullable=False, unique=True)

    def is_password_equal(self, attempted_password):
        return self.password == attempted_password

    def to_dict(self):
        return {
            "userid": self.userid,
            "username": self.username,
            "firstname": self.firstname,
            "surname": self.surname,
            "phonenumber": self.phonenumber,
            "mail": self.mail
        }
