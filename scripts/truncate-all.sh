#!/bin/bash

TRUNCATE_CMD="DO \$\$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE'; END LOOP; END \$\$;"

echo "Truncating auth_db..."
docker compose exec postgres-auth psql -U postgres -d auth_db -c "$TRUNCATE_CMD"

echo "Truncating profile_db..."
docker compose exec postgres-profile psql -U postgres -d profile_db -c "$TRUNCATE_CMD"

echo "Truncating trip_db..."
docker compose exec postgres-trip psql -U postgres -d trip_db -c "$TRUNCATE_CMD"

echo "Truncating matching_db..."
docker compose exec postgres-matching psql -U postgres -d matching_db -c "$TRUNCATE_CMD"

echo "Done!"
