#! /bin/bash
docker run -d --net=host \
    -e HASURA_GRAPHQL_DATABASE_URL=postgres://hasura:hasura@localhost:5432/dbname \
    -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
    -e HASURA_GRAPHQL_CONSOLE_ASSETS_DIR=/srv/console-assets \
    hasura/graphql-engine:latest
