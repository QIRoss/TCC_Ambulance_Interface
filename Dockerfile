FROM python:3.9-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBUG False

WORKDIR /app

RUN apt-get update \
    && apt-get install -y \
        gcc \
        libpq-dev \
        libmagic1 \
        ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

ENV MAGIC_PATH /usr/lib/x86_64-linux-gnu/libmagic.so.1

RUN pip install gunicorn

COPY . /app/

RUN python manage.py collectstatic --noinput

EXPOSE 8000

LABEL name="ambulance_interface"

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "Ambulance_Interface_Project.wsgi:application"]
