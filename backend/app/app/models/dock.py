from extensions import db


class Dock(db.Model):
    __tablename__ = 'dock'
    dockid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userid = db.Column(db.Integer, db.ForeignKey('users.userid'), nullable=False)
    addressid = db.Column(db.Integer, db.ForeignKey('address.addressid'), nullable=False)
    name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    length = db.Column(db.Numeric, nullable=False)
    width = db.Column(db.Numeric, nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    place = db.Column(db.Text, nullable=False)
    latitude = db.Column(db.Numeric, nullable=False)
    longitude = db.Column(db.Numeric, nullable=False)
    rented = db.Column(db.Boolean, nullable=False, default=False)
    facilities = db.Column(db.Text, nullable=True)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
