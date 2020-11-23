from controller.user_controller import validate_changes


def test_validate_changes_success():
    test_set = {"userid": 1, "username": "hallo"}
    assert validate_changes(test_set)


def test_validate_changes_fail():
    test_set = {"userid": "1", "username": "hallo"}
    assert not validate_changes(test_set)
