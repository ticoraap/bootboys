from models.dock import Dock


def test_as_dict():
    dock = Dock(dockid=0, userid=0, addressid=0, name="woop", description="testesttest", length=100, width=100,
                price=100, place="testvil", latitude=0, longitude=0, rented=False, facilities="geen")
    result_dict = {"dockid": 0, "userid": 0, "addressid": 0, "name": "woop", "description": "testesttest",
                   "length": 100, "width": 100, "price": 100, "place": "testvil", "latitude": 0, "longitude": 0,
                   "rented": False, "facilities": "geen"}

    user_dict = dock.as_dict()

    assert user_dict == result_dict
