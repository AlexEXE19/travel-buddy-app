#!/bin/bash

echo "Populating interests table..."

docker compose exec postgres-profile psql -U postgres -d profile_db -c "
INSERT INTO interests (id, name) VALUES
  (gen_random_uuid(), 'Photography'),
  (gen_random_uuid(), 'Hiking'),
  (gen_random_uuid(), 'Cooking'),
  (gen_random_uuid(), 'Music'),
  (gen_random_uuid(), 'Reading'),
  (gen_random_uuid(), 'Gaming'),
  (gen_random_uuid(), 'Fitness'),
  (gen_random_uuid(), 'Art'),
  (gen_random_uuid(), 'Cinema'),
  (gen_random_uuid(), 'Dancing'),
  (gen_random_uuid(), 'Yoga'),
  (gen_random_uuid(), 'Cycling'),
  (gen_random_uuid(), 'Swimming'),
  (gen_random_uuid(), 'Surfing'),
  (gen_random_uuid(), 'Skiing'),
  (gen_random_uuid(), 'Climbing'),
  (gen_random_uuid(), 'Meditation'),
  (gen_random_uuid(), 'Volunteering'),
  (gen_random_uuid(), 'Languages'),
  (gen_random_uuid(), 'Astronomy')
ON CONFLICT (name) DO NOTHING;
"

echo "Done! Interests inserted:"
docker compose exec postgres-profile psql -U postgres -d profile_db -c "SELECT name FROM interests ORDER BY name;"
