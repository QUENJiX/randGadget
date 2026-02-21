-- ============================================================================
-- GADGETBD: Map upazilas to delivery zones
-- Run AFTER seed-upazilas.sql
-- ============================================================================
-- Zone 1: Inside Dhaka       (Dhaka city thanas)
-- Zone 2: Dhaka Suburb       (Gazipur, Narayanganj, Savar, Keraniganj, etc.)
-- Zone 3: Outside Dhaka      (All other mainland districts)
-- Zone 4: Remote Area        (Hill tracts, island upazilas)
-- ============================================================================

DO $$
DECLARE
  zone_inside_dhaka   INT := 1;
  zone_dhaka_suburb   INT := 2;
  zone_outside_dhaka  INT := 3;
  zone_remote         INT := 4;
  d_id INT;
  u RECORD;
BEGIN

-- =========================================================================
-- ZONE 1 — Inside Dhaka (Dhaka District metro thanas)
-- =========================================================================
SELECT id INTO d_id FROM districts WHERE name = 'Dhaka' AND division_id = 1;
FOR u IN
  SELECT id FROM upazilas
  WHERE district_id = d_id
    AND name NOT IN ('Keraniganj', 'Nawabganj', 'Dohar', 'Savar', 'Dhamrai')
LOOP
  INSERT INTO upazila_zone_map (upazila_id, delivery_zone_id)
  VALUES (u.id, zone_inside_dhaka)
  ON CONFLICT (upazila_id) DO NOTHING;
END LOOP;

-- =========================================================================
-- ZONE 2 — Dhaka Suburb (peri-urban Dhaka + adjacent districts)
-- =========================================================================

-- Dhaka District suburban upazilas
FOR u IN
  SELECT id FROM upazilas
  WHERE district_id = d_id
    AND name IN ('Keraniganj', 'Nawabganj', 'Dohar', 'Savar', 'Dhamrai')
LOOP
  INSERT INTO upazila_zone_map (upazila_id, delivery_zone_id)
  VALUES (u.id, zone_dhaka_suburb)
  ON CONFLICT (upazila_id) DO NOTHING;
END LOOP;

-- Gazipur District → Dhaka Suburb
SELECT id INTO d_id FROM districts WHERE name = 'Gazipur' AND division_id = 1;
FOR u IN SELECT id FROM upazilas WHERE district_id = d_id LOOP
  INSERT INTO upazila_zone_map (upazila_id, delivery_zone_id)
  VALUES (u.id, zone_dhaka_suburb) ON CONFLICT (upazila_id) DO NOTHING;
END LOOP;

-- Narayanganj District → Dhaka Suburb
SELECT id INTO d_id FROM districts WHERE name = 'Narayanganj' AND division_id = 1;
FOR u IN SELECT id FROM upazilas WHERE district_id = d_id LOOP
  INSERT INTO upazila_zone_map (upazila_id, delivery_zone_id)
  VALUES (u.id, zone_dhaka_suburb) ON CONFLICT (upazila_id) DO NOTHING;
END LOOP;

-- Munshiganj District → Dhaka Suburb
SELECT id INTO d_id FROM districts WHERE name = 'Munshiganj' AND division_id = 1;
FOR u IN SELECT id FROM upazilas WHERE district_id = d_id LOOP
  INSERT INTO upazila_zone_map (upazila_id, delivery_zone_id)
  VALUES (u.id, zone_dhaka_suburb) ON CONFLICT (upazila_id) DO NOTHING;
END LOOP;

-- Narsingdi District → Dhaka Suburb
SELECT id INTO d_id FROM districts WHERE name = 'Narsingdi' AND division_id = 1;
FOR u IN SELECT id FROM upazilas WHERE district_id = d_id LOOP
  INSERT INTO upazila_zone_map (upazila_id, delivery_zone_id)
  VALUES (u.id, zone_dhaka_suburb) ON CONFLICT (upazila_id) DO NOTHING;
END LOOP;

-- Manikganj District → Dhaka Suburb
SELECT id INTO d_id FROM districts WHERE name = 'Manikganj' AND division_id = 1;
FOR u IN SELECT id FROM upazilas WHERE district_id = d_id LOOP
  INSERT INTO upazila_zone_map (upazila_id, delivery_zone_id)
  VALUES (u.id, zone_dhaka_suburb) ON CONFLICT (upazila_id) DO NOTHING;
END LOOP;

-- =========================================================================
-- ZONE 4 — Remote Areas (CHT hill districts + island upazilas)
-- =========================================================================

-- Bandarban District → Remote
SELECT id INTO d_id FROM districts WHERE name = 'Bandarban' AND division_id = 2;
FOR u IN SELECT id FROM upazilas WHERE district_id = d_id LOOP
  INSERT INTO upazila_zone_map (upazila_id, delivery_zone_id)
  VALUES (u.id, zone_remote) ON CONFLICT (upazila_id) DO NOTHING;
END LOOP;

-- Khagrachhari District → Remote
SELECT id INTO d_id FROM districts WHERE name = 'Khagrachhari' AND division_id = 2;
FOR u IN SELECT id FROM upazilas WHERE district_id = d_id LOOP
  INSERT INTO upazila_zone_map (upazila_id, delivery_zone_id)
  VALUES (u.id, zone_remote) ON CONFLICT (upazila_id) DO NOTHING;
END LOOP;

-- Rangamati District → Remote
SELECT id INTO d_id FROM districts WHERE name = 'Rangamati' AND division_id = 2;
FOR u IN SELECT id FROM upazilas WHERE district_id = d_id LOOP
  INSERT INTO upazila_zone_map (upazila_id, delivery_zone_id)
  VALUES (u.id, zone_remote) ON CONFLICT (upazila_id) DO NOTHING;
END LOOP;

-- =========================================================================
-- ZONE 3 — Outside Dhaka (everything else not yet mapped)
-- =========================================================================
INSERT INTO upazila_zone_map (upazila_id, delivery_zone_id)
SELECT up.id, zone_outside_dhaka
FROM upazilas up
WHERE NOT EXISTS (
  SELECT 1 FROM upazila_zone_map m WHERE m.upazila_id = up.id
);

END;
$$;
