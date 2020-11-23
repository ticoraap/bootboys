FILE=/.env
if [ -f "$FILE" ]; then
  chmod +x app/app/wsgi.py
  python app/app/wsgi.py
fi

