#!/bin/bash

COMPOSE=../docker-compose/rumors/rumors.docker-compose.yml
ENV=../docker-compose/rumors/rumors.env

source $ENV

docker compose -f $COMPOSE --env-file $ENV up -d rumors-db
sleep 5
docker compose -f $COMPOSE --env-file $ENV exec rumors-db psql -U $DB_USER -d $DB_NAME -f /init/init.sql
docker compose -f $COMPOSE --env-file $ENV down rumors-db
