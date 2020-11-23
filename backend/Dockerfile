FROM python:3.7.7-buster
COPY ./app/requirements.txt /var/www/requirements.txt
RUN pip install -r /var/www/requirements.txt
COPY ./app /app

ENV PYTHONPATH=/app/app
ENV FLASK_APP=app/main:create_app

ENTRYPOINT ["/bin/bash", "app/start.sh"]