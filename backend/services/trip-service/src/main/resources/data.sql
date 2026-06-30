-- Seed trips
INSERT INTO trips (id, title, description, trip_type, status, max_capacity, creator_id, created_at, updated_at)
VALUES
  ('b1000001-0000-0000-0000-000000000001', 'Ancient Rome & Tuscany',
   'A 10-day cultural journey through Rome, Florence and the Tuscan countryside. We visit ruins, eat like locals, and stay in agriturismos.',
   'CULTURAL',   'OPEN', 4, 'a1b2c3d4-0001-0001-0001-000000000001', NOW(), NOW()),
  ('b1000002-0000-0000-0000-000000000002', 'Dolomites Summits Trek',
   'Epic 8-day hiking loop across the Alta Via 1. Rifugio nights, glaciers, and the most dramatic skyline in Europe.',
   'HIKING',     'OPEN', 5, 'a1b2c3d4-0002-0002-0002-000000000002', NOW(), NOW()),
  ('b1000003-0000-0000-0000-000000000003', 'Tokyo Foodie Weekend',
   'Three days of ramen, izakayas, tsukiji breakfast, depachika crawl, and a teamLab digital art night.',
   'CITY_BREAK', 'OPEN', 3, 'a1b2c3d4-0003-0003-0003-000000000003', NOW(), NOW()),
  ('b1000004-0000-0000-0000-000000000004', 'Pacific Coast Road Trip',
   'Drive Highway 1 from San Francisco to LA over 7 days. Big Sur, Hearst Castle, Santa Barbara — van camping all the way.',
   'ADVENTURE',  'OPEN', 4, 'a1b2c3d4-0004-0004-0004-000000000004', NOW(), NOW()),
  ('b1000005-0000-0000-0000-000000000005', 'Bali Wellness Retreat',
   'A week of yoga, spa treatments, rice-paddy walks and sunset dinners in Ubud and Seminyak. Slow travel at its finest.',
   'BEACH',      'OPEN', 3, 'a1b2c3d4-0005-0005-0005-000000000005', NOW(), NOW()),
  ('b1000006-0000-0000-0000-000000000006', 'Lisbon & Sintra Long Weekend',
   'Four days in Portugal: Alfama viewpoints, pastéis de nata, Sintra palaces, and a day trip to Cascais.',
   'CITY_BREAK', 'OPEN', 4, 'a1b2c3d4-0001-0001-0001-000000000001', NOW(), NOW()),
  ('b1000007-0000-0000-0000-000000000007', 'Patagonia End of the World',
   'Two weeks crossing Torres del Paine, Fitz Roy and the Carretera Austral. Tents, glaciers, and zero phone signal.',
   'HIKING',     'OPEN', 4, 'a1b2c3d4-0002-0002-0002-000000000002', NOW(), NOW()),
  ('b1000008-0000-0000-0000-000000000008', 'Medellin City & Coffee Region',
   'Five days: cable-car barrios, history tour, salsa nights, and a day on a coffee finca in the Zona Cafetera.',
   'CULTURAL',   'OPEN', 5, 'a1b2c3d4-0004-0004-0004-000000000004', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Seed itineraries
INSERT INTO itineraries (id, trip_id, start_name, start_lat, start_lng, start_time, end_time)
VALUES
  ('c1000001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001', 'Rome, Italy',               41.9028,   12.4964,  '2026-08-10 09:00:00+00', '2026-08-20 18:00:00+00'),
  ('c1000002-0000-0000-0000-000000000002', 'b1000002-0000-0000-0000-000000000002', 'Cortina d''Ampezzo, Italy',  46.5362,   12.1356,  '2026-07-15 07:00:00+00', '2026-07-23 17:00:00+00'),
  ('c1000003-0000-0000-0000-000000000003', 'b1000003-0000-0000-0000-000000000003', 'Tokyo, Japan',              35.6762,  139.6503,  '2026-09-05 08:00:00+00', '2026-09-08 21:00:00+00'),
  ('c1000004-0000-0000-0000-000000000004', 'b1000004-0000-0000-0000-000000000004', 'San Francisco, USA',        37.7749, -122.4194,  '2026-10-01 10:00:00+00', '2026-10-08 18:00:00+00'),
  ('c1000005-0000-0000-0000-000000000005', 'b1000005-0000-0000-0000-000000000005', 'Ubud, Bali, Indonesia',     -8.5069,  115.2625,  '2026-11-01 10:00:00+00', '2026-11-08 12:00:00+00'),
  ('c1000006-0000-0000-0000-000000000006', 'b1000006-0000-0000-0000-000000000006', 'Lisbon, Portugal',          38.7223,   -9.1393,  '2026-07-04 08:00:00+00', '2026-07-08 20:00:00+00'),
  ('c1000007-0000-0000-0000-000000000007', 'b1000007-0000-0000-0000-000000000007', 'Puerto Natales, Chile',    -51.7235,  -72.4980,  '2026-12-01 07:00:00+00', '2026-12-15 18:00:00+00'),
  ('c1000008-0000-0000-0000-000000000008', 'b1000008-0000-0000-0000-000000000008', 'Medellin, Colombia',         6.2442,  -75.5812,  '2026-08-20 09:00:00+00', '2026-08-25 21:00:00+00')
ON CONFLICT DO NOTHING;
