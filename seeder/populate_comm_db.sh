#!/bin/bash

COMPOSE=../docker-compose/communication/communication.docker-compose.yml
ENV=../docker-compose/communication/communication.env

source $ENV

docker compose -f $COMPOSE --env-file $ENV up -d communication-db
sleep 5
docker compose -f $COMPOSE --env-file $ENV exec communication-db psql -U $DB_USER -d $DB_NAME -f /init/init.sql
docker compose -f $COMPOSE --env-file $ENV down communication-db
