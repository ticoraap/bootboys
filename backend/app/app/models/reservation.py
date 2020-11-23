from extensions import db


class Reservation(db.Model):
    __tablename__ = 'rented'
    reservationid = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    tenantid = db.Column(db.Integer, db.ForeignKey('users.userid'), nullable=False)
    dockid = db.Column(db.Integer, db.ForeignKey('dock.dockid'), nullable=False)
    reservationtimestamp = db.Column(db.Integer, nullable=False)
    arrivaldate = db.Column(db.Text, nullable=False)
    departuredate = db.Column(db.Text, nullable=False)
    paid = db.Column(db.Boolean, nullable=False, default=False)
    price = db.Column(db.Integer, nullable=False)
    paymentid = db.Column(db.Text, nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
