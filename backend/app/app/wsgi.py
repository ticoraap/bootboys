from gevent import monkey
monkey.patch_all()
from main import create_app # noqa
from extensions import socket_io # noqa
from config import Config # noqa

app = create_app(Config)

if __name__ == '__main__':
    socket_io.run(app, host='0.0.0.0', port=5000)  # nosec
