from models.user import User


def test_is_password_equal():
    user = User(userid=0, username="testDummy", password="dummy", firstname="hawaii", surname="pizza",
                phonenumber="06666666666", mail="pizzahawaii@ananas.com")
    attemptedpassword = "dummy"

    assert user.is_password_equal(attemptedpassword)


def test_to_dict():
    user = User(userid=0, username="testDummy", firstname="hawaii", surname="pizza",
                phonenumber="06666666666", mail="pizzahawaii@ananas.com")
    result_dict = {
        "userid": 0,
        "username": "testDummy",
        "firstname": "hawaii",
        "surname": "pizza",
        "phonenumber": "06666666666",
        "mail": "pizzahawaii@ananas.com"
    }

    user_dict = user.to_dict()

    assert user_dict == result_dict
