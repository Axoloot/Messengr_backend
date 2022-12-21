#!/bin/bash


docker kill jessie_postgres_1
docker rm jessie_postgres_1
docker-compose up -d --build postgres
cat ../backups/dump.sql | docker exec -i jessie_postgres_1 psql -U postgres