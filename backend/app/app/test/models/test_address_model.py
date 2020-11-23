from models.address import Address


def test_as_dict():
    address = Address(userid=0, addressid=0, street="testStreet", housenumber="5", city="testville",
                      postalcode="6000db", country="NL", state="ZH")
    result_dict = {"userid": 0, "addressid": 0, "street": "testStreet", "housenumber": "5", "city": "testville",
                   "postalcode": "6000db", "country": "NL", "state": "ZH"}

    address_dict = address.as_dict()

    assert address_dict == result_dict
