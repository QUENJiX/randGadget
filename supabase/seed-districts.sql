-- ============================================================================
-- GADGETBD: Seed all 64 districts of Bangladesh
-- Run AFTER schema.sql (divisions must exist)
-- ============================================================================

-- Dhaka Division (division_id = 1)
INSERT INTO districts (division_id, name, bn_name) VALUES
  (1, 'Dhaka',         'ঢাকা'),
  (1, 'Faridpur',      'ফরিদপুর'),
  (1, 'Gazipur',       'গাজীপুর'),
  (1, 'Gopalganj',     'গোপালগঞ্জ'),
  (1, 'Kishoreganj',   'কিশোরগঞ্জ'),
  (1, 'Madaripur',     'মাদারীপুর'),
  (1, 'Manikganj',     'মানিকগঞ্জ'),
  (1, 'Munshiganj',    'মুন্সিগঞ্জ'),
  (1, 'Narayanganj',   'নারায়ণগঞ্জ'),
  (1, 'Narsingdi',     'নরসিংদী'),
  (1, 'Rajbari',       'রাজবাড়ী'),
  (1, 'Shariatpur',    'শরীয়তপুর'),
  (1, 'Tangail',       'টাঙ্গাইল');

-- Chattogram Division (division_id = 2)
INSERT INTO districts (division_id, name, bn_name) VALUES
  (2, 'Bandarban',     'বান্দরবান'),
  (2, 'Brahmanbaria',  'ব্রাহ্মণবাড়িয়া'),
  (2, 'Chandpur',      'চাঁদপুর'),
  (2, 'Chattogram',    'চট্টগ্রাম'),
  (2, 'Comilla',       'কুমিল্লা'),
  (2, 'Cox''s Bazar',  'কক্সবাজার'),
  (2, 'Feni',          'ফেনী'),
  (2, 'Khagrachhari',  'খাগড়াছড়ি'),
  (2, 'Lakshmipur',    'লক্ষ্মীপুর'),
  (2, 'Noakhali',      'নোয়াখালী'),
  (2, 'Rangamati',     'রাঙ্গামাটি');

-- Rajshahi Division (division_id = 3)
INSERT INTO districts (division_id, name, bn_name) VALUES
  (3, 'Bogra',              'বগুড়া'),
  (3, 'Chapainawabganj',    'চাঁপাইনবাবগঞ্জ'),
  (3, 'Joypurhat',          'জয়পুরহাট'),
  (3, 'Naogaon',            'নওগাঁ'),
  (3, 'Natore',             'নাটোর'),
  (3, 'Nawabganj',          'নবাবগঞ্জ'),
  (3, 'Pabna',              'পাবনা'),
  (3, 'Rajshahi',           'রাজশাহী'),
  (3, 'Sirajganj',          'সিরাজগঞ্জ');

-- Khulna Division (division_id = 4)
INSERT INTO districts (division_id, name, bn_name) VALUES
  (4, 'Bagerhat',      'বাগেরহাট'),
  (4, 'Chuadanga',     'চুয়াডাঙ্গা'),
  (4, 'Jessore',       'যশোর'),
  (4, 'Jhenaidah',     'ঝিনাইদহ'),
  (4, 'Khulna',        'খুলনা'),
  (4, 'Kushtia',       'কুষ্টিয়া'),
  (4, 'Magura',        'মাগুরা'),
  (4, 'Meherpur',      'মেহেরপুর'),
  (4, 'Narail',        'নড়াইল'),
  (4, 'Satkhira',      'সাতক্ষীরা');

-- Barishal Division (division_id = 5)
INSERT INTO districts (division_id, name, bn_name) VALUES
  (5, 'Barguna',       'বরগুনা'),
  (5, 'Barishal',      'বরিশাল'),
  (5, 'Bhola',         'ভোলা'),
  (5, 'Jhalokathi',    'ঝালকাঠি'),
  (5, 'Patuakhali',    'পটুয়াখালী'),
  (5, 'Pirojpur',      'পিরোজপুর');

-- Sylhet Division (division_id = 6)
INSERT INTO districts (division_id, name, bn_name) VALUES
  (6, 'Habiganj',      'হবিগঞ্জ'),
  (6, 'Moulvibazar',   'মৌলভীবাজার'),
  (6, 'Sunamganj',     'সুনামগঞ্জ'),
  (6, 'Sylhet',        'সিলেট');

-- Rangpur Division (division_id = 7)
INSERT INTO districts (division_id, name, bn_name) VALUES
  (7, 'Dinajpur',      'দিনাজপুর'),
  (7, 'Gaibandha',     'গাইবান্ধা'),
  (7, 'Kurigram',      'কুড়িগ্রাম'),
  (7, 'Lalmonirhat',   'লালমনিরহাট'),
  (7, 'Nilphamari',    'নীলফামারী'),
  (7, 'Panchagarh',    'পঞ্চগড়'),
  (7, 'Rangpur',       'রংপুর'),
  (7, 'Thakurgaon',    'ঠাকুরগাঁও');

-- Mymensingh Division (division_id = 8)
INSERT INTO districts (division_id, name, bn_name) VALUES
  (8, 'Jamalpur',      'জামালপুর'),
  (8, 'Mymensingh',    'ময়মনসিংহ'),
  (8, 'Netrokona',     'নেত্রকোণা'),
  (8, 'Sherpur',       'শেরপুর');
