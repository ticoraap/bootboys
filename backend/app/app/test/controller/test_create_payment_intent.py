from main import create_app
from test_config import Config
from unittest import mock
import stripe
import json

app = create_app(Config)
client = app.test_client()
url = "/create-payment-intent"
mock_request_headers = {
    "Authorization": "gAAAAABe24fX7nHLJDDG-DuldzdQsngdXA6PL-r_qs7rSCTnxx_rodpcUC0rNKCDMo15lEnPrYR19hD1rI9PNdD72pvdQ"
                     "AlzsfBw3MnboTxRgn3_KQR0w34"
}
mock_request_data = {
    "dockId": 6,
    "arrivalDate": "15-6-2020",
    "departureDate": "16-6-2020",
    "metaData":
        {"Customer Name": "pepep dgh;sjdfhgj;asjfghal",
         "Username": "testAccount98",
         "Phone Number": "789453104864531",
         "Mail Address": "hallo@hallo.com",
         "User ID": 119},
    "tenantId": 119}


class DummyResponse:
    id = None,
    client_secret = None

    def __init__(self, id, client_secret):
        self.id = id
        self.client_secret = client_secret


@mock.patch("controller.payment_controller.get_dock_by_dockid", return_value=[{"dockid": 6, "price": 100}],
            autospec=True)
@mock.patch("controller.payment_controller.insert_reservation_in_database")
@mock.patch("controller.payment_controller.notify_all_on_dockpage")
@mock.patch.object(stripe.PaymentIntent, "create",
                   return_value=DummyResponse(id="pi_1GrpaqKqEvuwI0CidcT9qiAp",
                                              client_secret="pi_1GrpaqKqEvuwI0CidcT9qiAp_secret_G2PeFLI7V8ru7HMmlV2Kwmt4h"),
                   autospec=True)
@mock.patch("utils.checklogin.user_manager.token_manager.verify_token", return_value={"userid": "0"}, autospec=True)
def test_create_post_and_insert_payment_intent_in_database_success(mock_get_dock_by_dockid,
                                                                   mock_insert_reservation_in_db,
                                                                   mock_notify_all_on_dockpage,
                                                                   mock_create_payment_intent, mock_verify_token):
    response = client.post(url, data=json.dumps(mock_request_data), content_type='application/json',
                           headers=mock_request_headers
                           )
    assert response.status_code == 200


@mock.patch("controller.payment_controller.get_dock_by_dockid", return_value=None,
            autospec=True)
@mock.patch("utils.checklogin.user_manager.token_manager.verify_token", return_value={"userid": "0"}, autospec=True)
def test_create_post_and_insert_payment_intent_in_database_no_dock(mock_get_dock_by_dockid, mock_verify_token):
    response = client.post(url, data=json.dumps(mock_request_data), content_type='application/json',
                           headers=mock_request_headers
                           )
    response_payload_json = json.loads(response.data)

    assert response_payload_json["status"] == 404


@mock.patch("controller.payment_controller.get_dock_by_dockid", return_value=[{"dockid": 6, "price": 100}],
            autospec=True)
@mock.patch("controller.payment_controller.insert_reservation_in_database")
@mock.patch("controller.payment_controller.notify_all_on_dockpage")
@mock.patch.object(stripe.PaymentIntent, "create", return_value=None, autospec=True)
def test_create_post_and_insert_payment_intent_in_database_no_payment_intent(mock_get_dock_by_dockid,
                                                                             mock_insert_reservation_in_db,
                                                                             mock_notify_all_on_dockpage,
                                                                             mock_create_payment_intent):
    response = client.post(url, data=json.dumps(mock_request_data), content_type='application/json',
                           headers=mock_request_headers
                           )

    assert response.status_code == 403
