from extensions import db


class Address(db.Model):
    __tablename__ = 'address'
    userid = db.Column(db.Integer, db.ForeignKey('users.userid'), nullable=False)
    addressid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    street = db.Column(db.Text, nullable=False, unique=False)
    housenumber = db.Column(db.Text, nullable=False)
    city = db.Column(db.Text, nullable=False)
    postalcode = db.Column(db.Text, nullable=False)
    country = db.Column(db.Text, nullable=False)
    state = db.Column(db.Text, nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
