#!/bin/bash

COMPOSE=../docker-compose/task/task.docker-compose.yml
ENV=../docker-compose/task/task.env

source $ENV

docker compose -f $COMPOSE --env-file $ENV up -d task-db
sleep 5
docker compose -f $COMPOSE --env-file $ENV exec task-db /docker-entrypoint-initdb.d/schema.sh
docker compose -f $COMPOSE --env-file $ENV exec task-db /docker-entrypoint-initdb.d/seed.sh
docker compose -f $COMPOSE --env-file $ENV down task-db
