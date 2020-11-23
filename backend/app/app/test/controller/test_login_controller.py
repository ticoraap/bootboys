import json
from unittest import mock
from main import create_app
from models.user import User
from test_config import Config


@mock.patch("controller.login_controller.user_dao.get_user_by_username",
            return_value=User(userid=0, username="testDummy", password="dummy", firstname="hawaii", surname="pizza",
                              phonenumber="06666666666", mail="pizzahawaii@ananas.com"),
            autospec=True)
@mock.patch("controller.user_controller.create_token", return_value="token", autospec=True)
def test_try_login_success(mock_user_dao, mock_create_token):
    app = create_app(Config)
    client = app.test_client()
    url = "/trylogin"
    mock_request_data = {
        "username": "testDummy",
        "password": "dummy"
    }

    response = client.post(url, data=json.dumps(mock_request_data), content_type='application/json')

    assert response.status_code == 200


@mock.patch("controller.login_controller.user_dao",
            return_value={"userid": 0, "username": "testDummy", "password": "dummy", "firstname": "hawaii",
                          "surname": "pizza",
                          "phonenumber": "06666666666", "mail": "pizzahawaii@ananas.com"},
            autospec=True)
def test_try_login_failure(mock_user_dao):
    app = create_app(Config)
    client = app.test_client()
    url = "/trylogin"
    mock_request_data = {
        "username": "pizzaHawaii",
        "password": "ananas_op_pizza_is_het_beste"
    }

    response = client.post(url, data=json.dumps(mock_request_data), content_type='application/json')

    assert response.status_code == 401


@mock.patch("controller.login_controller.user_dao.get_user_by_username",
            return_value=User(userid=0, username="testDummy", password="dummy", firstname="hawaii", surname="pizza",
                              phonenumber="06666666666", mail="pizzahawaii@ananas.com"),
            autospec=True)
@mock.patch("controller.user_controller.create_token", return_value="token", autospec=True)
def test_try_login_token_insert(mock_user_dao, mock_create_token):
    app = create_app(Config)
    client = app.test_client()
    url = "/trylogin"
    mock_request_data = {
        "username": "testDummy",
        "password": "dummy"
    }

    response = client.post(url, data=json.dumps(mock_request_data), content_type='application/json')
    response_json = json.loads(response.data.decode())

    assert response_json["user"]["token"] == "token"
