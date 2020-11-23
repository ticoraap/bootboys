import json
from unittest import mock
from main import create_app
from test_config import Config


@mock.patch("controller.register_controller.user_dao.insert_user", return_value=True, autospec=True)
def test_register(mock_user_dao):
    app = create_app(Config)
    client = app.test_client()
    url = '/register'
    mock_request_data = {
        'username': 'Pepie',
        'password': 'testPass',
        'firstname': 'testFirst',
        'surname': 'testSur',
        'phonenumber': '911112144',
        'mail': 'test@test.com'
    }
    response = client.post(url, data=json.dumps(mock_request_data), content_type='application/json')

    assert response.status_code == 200
