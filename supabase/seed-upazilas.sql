-- ============================================================================
-- GADGETBD: Seed upazilas of Bangladesh (representative set per district)
-- Run AFTER seed-districts.sql
-- ============================================================================
-- NOTE: This seeds the major upazilas. District IDs are based on insertion
-- order from seed-districts.sql (1-64).
-- ============================================================================

-- Helper: We reference districts by (division_id, name) to be insertion-order safe.
-- Using a DO block with lookups.

DO $$
DECLARE
  d_id INT;
BEGIN

-- =========================================================================
-- DHAKA DIVISION
-- =========================================================================

-- Dhaka District
SELECT id INTO d_id FROM districts WHERE name = 'Dhaka' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Dhanmondi',         'ধানমন্ডি'),
  (d_id, 'Gulshan',           'গুলশান'),
  (d_id, 'Mirpur',            'মিরপুর'),
  (d_id, 'Mohammadpur',       'মোহাম্মদপুর'),
  (d_id, 'Motijheel',         'মতিঝিল'),
  (d_id, 'Ramna',             'রমনা'),
  (d_id, 'Tejgaon',           'তেজগাঁও'),
  (d_id, 'Uttara',            'উত্তরা'),
  (d_id, 'Badda',             'বাড্ডা'),
  (d_id, 'Banani',            'বনানী'),
  (d_id, 'Cantonment',        'ক্যান্টনমেন্ট'),
  (d_id, 'Demra',             'ডেমরা'),
  (d_id, 'Hazaribagh',        'হাজারীবাগ'),
  (d_id, 'Jatrabari',         'যাত্রাবাড়ী'),
  (d_id, 'Kadamtali',         'কদমতলী'),
  (d_id, 'Kafrul',            'কাফরুল'),
  (d_id, 'Kalabagan',         'কলাবাগান'),
  (d_id, 'Kamrangirchar',     'কামরাঙ্গীরচর'),
  (d_id, 'Khilgaon',          'খিলগাঁও'),
  (d_id, 'Khilkhet',          'খিলক্ষেত'),
  (d_id, 'Kotwali',           'কোতোয়ালী'),
  (d_id, 'Lalbagh',           'লালবাগ'),
  (d_id, 'Mugda',             'মুগদা'),
  (d_id, 'New Market',        'নিউ মার্কেট'),
  (d_id, 'Pallabi',           'পল্লবী'),
  (d_id, 'Paltan',            'পল্টন'),
  (d_id, 'Rampura',           'রামপুরা'),
  (d_id, 'Sabujbagh',         'সবুজবাগ'),
  (d_id, 'Shah Ali',          'শাহ আলী'),
  (d_id, 'Shahbagh',          'শাহবাগ'),
  (d_id, 'Sher-e-Bangla Nagar', 'শেরে বাংলা নগর'),
  (d_id, 'Shyampur',          'শ্যামপুর'),
  (d_id, 'Sutrapur',          'সূত্রাপুর'),
  (d_id, 'Turag',             'তুরাগ'),
  (d_id, 'Wari',              'ওয়ারী'),
  (d_id, 'Dakshin Khan',      'দক্ষিণ খান'),
  (d_id, 'Uttarkhan',         'উত্তরখান'),
  (d_id, 'Vatara',            'ভাটারা'),
  (d_id, 'Bashundhara',       'বসুন্ধরা'),
  (d_id, 'Keraniganj',        'কেরানীগঞ্জ'),
  (d_id, 'Nawabganj',         'নবাবগঞ্জ'),
  (d_id, 'Dohar',             'দোহার'),
  (d_id, 'Savar',             'সাভার'),
  (d_id, 'Dhamrai',           'ধামরাই');

-- Faridpur District
SELECT id INTO d_id FROM districts WHERE name = 'Faridpur' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Faridpur Sadar', 'ফরিদপুর সদর'),
  (d_id, 'Alfadanga',      'আলফাডাঙ্গা'),
  (d_id, 'Bhanga',         'ভাঙ্গা'),
  (d_id, 'Boalmari',       'বোয়ালমারী'),
  (d_id, 'Char Bhadrasan', 'চরভদ্রাসন'),
  (d_id, 'Madhukhali',     'মধুখালী'),
  (d_id, 'Nagarkanda',     'নগরকান্দা'),
  (d_id, 'Sadarpur',       'সদরপুর'),
  (d_id, 'Saltha',         'সালথা');

-- Gazipur District
SELECT id INTO d_id FROM districts WHERE name = 'Gazipur' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Gazipur Sadar', 'গাজীপুর সদর'),
  (d_id, 'Kaliakair',     'কালিয়াকৈর'),
  (d_id, 'Kaliganj',      'কালীগঞ্জ'),
  (d_id, 'Kapasia',       'কাপাসিয়া'),
  (d_id, 'Sreepur',       'শ্রীপুর'),
  (d_id, 'Tongi',         'টঙ্গী');

-- Gopalganj District
SELECT id INTO d_id FROM districts WHERE name = 'Gopalganj' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Gopalganj Sadar', 'গোপালগঞ্জ সদর'),
  (d_id, 'Kashiani',        'কাশিয়ানী'),
  (d_id, 'Kotalipara',      'কোটালীপাড়া'),
  (d_id, 'Muksudpur',       'মুকসুদপুর'),
  (d_id, 'Tungipara',       'টুঙ্গিপাড়া');

-- Kishoreganj District
SELECT id INTO d_id FROM districts WHERE name = 'Kishoreganj' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Kishoreganj Sadar', 'কিশোরগঞ্জ সদর'),
  (d_id, 'Austagram',         'অষ্টগ্রাম'),
  (d_id, 'Bajitpur',          'বাজিতপুর'),
  (d_id, 'Bhairab',           'ভৈরব'),
  (d_id, 'Hossainpur',        'হোসেনপুর'),
  (d_id, 'Itna',              'ইটনা'),
  (d_id, 'Karimganj',         'করিমগঞ্জ'),
  (d_id, 'Katiadi',           'কটিয়াদী'),
  (d_id, 'Kuliarchar',        'কুলিয়ারচর'),
  (d_id, 'Mithamain',         'মিঠামইন'),
  (d_id, 'Nikli',             'নিকলী'),
  (d_id, 'Pakundia',          'পাকুন্দিয়া'),
  (d_id, 'Tarail',            'তাড়াইল');

-- Madaripur District
SELECT id INTO d_id FROM districts WHERE name = 'Madaripur' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Madaripur Sadar', 'মাদারীপুর সদর'),
  (d_id, 'Kalkini',         'কালকিনি'),
  (d_id, 'Rajoir',          'রাজৈর'),
  (d_id, 'Shibchar',        'শিবচর');

-- Manikganj District
SELECT id INTO d_id FROM districts WHERE name = 'Manikganj' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Manikganj Sadar', 'মানিকগঞ্জ সদর'),
  (d_id, 'Daulatpur',       'দৌলতপুর'),
  (d_id, 'Ghior',           'ঘিওর'),
  (d_id, 'Harirampur',      'হরিরামপুর'),
  (d_id, 'Saturia',         'সাটুরিয়া'),
  (d_id, 'Shivalaya',       'শিবালয়'),
  (d_id, 'Singair',         'সিংগাইর');

-- Munshiganj District
SELECT id INTO d_id FROM districts WHERE name = 'Munshiganj' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Munshiganj Sadar', 'মুন্সিগঞ্জ সদর'),
  (d_id, 'Gazaria',          'গজারিয়া'),
  (d_id, 'Lohajang',         'লৌহজং'),
  (d_id, 'Sirajdikhan',      'সিরাজদিখান'),
  (d_id, 'Sreenagar',        'শ্রীনগর'),
  (d_id, 'Tongibari',        'টঙ্গীবাড়ী');

-- Narayanganj District
SELECT id INTO d_id FROM districts WHERE name = 'Narayanganj' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Narayanganj Sadar', 'নারায়ণগঞ্জ সদর'),
  (d_id, 'Araihazar',         'আড়াইহাজার'),
  (d_id, 'Bandar',            'বন্দর'),
  (d_id, 'Rupganj',           'রূপগঞ্জ'),
  (d_id, 'Sonargaon',         'সোনারগাঁও');

-- Narsingdi District
SELECT id INTO d_id FROM districts WHERE name = 'Narsingdi' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Narsingdi Sadar', 'নরসিংদী সদর'),
  (d_id, 'Belabo',           'বেলাবো'),
  (d_id, 'Monohardi',        'মনোহরদী'),
  (d_id, 'Palash',           'পলাশ'),
  (d_id, 'Raipura',          'রায়পুরা'),
  (d_id, 'Shibpur',          'শিবপুর');

-- Rajbari District
SELECT id INTO d_id FROM districts WHERE name = 'Rajbari' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Rajbari Sadar',   'রাজবাড়ী সদর'),
  (d_id, 'Baliakandi',      'বালিয়াকান্দি'),
  (d_id, 'Goalanda',        'গোয়ালন্দ'),
  (d_id, 'Kalukhali',       'কালুখালী'),
  (d_id, 'Pangsha',         'পাংশা');

-- Shariatpur District
SELECT id INTO d_id FROM districts WHERE name = 'Shariatpur' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Shariatpur Sadar', 'শরীয়তপুর সদর'),
  (d_id, 'Bhedarganj',       'ভেদরগঞ্জ'),
  (d_id, 'Damudya',          'ডামুড্যা'),
  (d_id, 'Gosairhat',        'গোসাইরহাট'),
  (d_id, 'Naria',            'নড়িয়া'),
  (d_id, 'Zanjira',          'জাজিরা');

-- Tangail District
SELECT id INTO d_id FROM districts WHERE name = 'Tangail' AND division_id = 1;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Tangail Sadar',  'টাঙ্গাইল সদর'),
  (d_id, 'Basail',         'বাসাইল'),
  (d_id, 'Bhuapur',        'ভুয়াপুর'),
  (d_id, 'Delduar',        'দেলদুয়ার'),
  (d_id, 'Dhanbari',       'ধনবাড়ী'),
  (d_id, 'Ghatail',        'ঘাটাইল'),
  (d_id, 'Gopalpur',       'গোপালপুর'),
  (d_id, 'Kalihati',       'কালিহাতী'),
  (d_id, 'Madhupur',       'মধুপুর'),
  (d_id, 'Mirzapur',       'মির্জাপুর'),
  (d_id, 'Nagarpur',       'নাগরপুর'),
  (d_id, 'Sakhipur',       'সখিপুর');

-- =========================================================================
-- CHATTOGRAM DIVISION
-- =========================================================================

-- Bandarban District
SELECT id INTO d_id FROM districts WHERE name = 'Bandarban' AND division_id = 2;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Bandarban Sadar', 'বান্দরবান সদর'),
  (d_id, 'Alikadam',        'আলীকদম'),
  (d_id, 'Lama',            'লামা'),
  (d_id, 'Naikhongchhari',  'নাইক্ষ্যংছড়ি'),
  (d_id, 'Rowangchhari',    'রোয়াংছড়ি'),
  (d_id, 'Ruma',            'রুমা'),
  (d_id, 'Thanchi',         'থানচি');

-- Brahmanbaria District
SELECT id INTO d_id FROM districts WHERE name = 'Brahmanbaria' AND division_id = 2;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Brahmanbaria Sadar', 'ব্রাহ্মণবাড়িয়া সদর'),
  (d_id, 'Akhaura',            'আখাউড়া'),
  (d_id, 'Ashuganj',           'আশুগঞ্জ'),
  (d_id, 'Bancharampur',       'বাঞ্ছারামপুর'),
  (d_id, 'Bijoynagar',         'বিজয়নগর'),
  (d_id, 'Kasba',              'কসবা'),
  (d_id, 'Nabinagar',          'নবীনগর'),
  (d_id, 'Nasirnagar',         'নাসিরনগর'),
  (d_id, 'Sarail',             'সরাইল');

-- Chandpur District
SELECT id INTO d_id FROM districts WHERE name = 'Chandpur' AND division_id = 2;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Chandpur Sadar', 'চাঁদপুর সদর'),
  (d_id, 'Faridganj',      'ফরিদগঞ্জ'),
  (d_id, 'Haimchar',       'হাইমচর'),
  (d_id, 'Haziganj',       'হাজীগঞ্জ'),
  (d_id, 'Kachua',         'কচুয়া'),
  (d_id, 'Matlab Dakshin', 'মতলব দক্ষিণ'),
  (d_id, 'Matlab Uttar',   'মতলব উত্তর'),
  (d_id, 'Shahrasti',      'শাহরাস্তি');

-- Chattogram District
SELECT id INTO d_id FROM districts WHERE name = 'Chattogram' AND division_id = 2;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Chattogram Sadar', 'চট্টগ্রাম সদর'),
  (d_id, 'Anwara',           'আনোয়ারা'),
  (d_id, 'Banshkhali',       'বাঁশখালী'),
  (d_id, 'Boalkhali',        'বোয়ালখালী'),
  (d_id, 'Chandanaish',      'চন্দনাইশ'),
  (d_id, 'Fatikchhari',      'ফটিকছড়ি'),
  (d_id, 'Hathazari',        'হাটহাজারী'),
  (d_id, 'Lohagara',         'লোহাগাড়া'),
  (d_id, 'Mirsharai',        'মীরসরাই'),
  (d_id, 'Patiya',           'পটিয়া'),
  (d_id, 'Rangunia',         'রাঙ্গুনিয়া'),
  (d_id, 'Raozan',           'রাউজান'),
  (d_id, 'Sandwip',          'সন্দ্বীপ'),
  (d_id, 'Satkania',         'সাতকানিয়া'),
  (d_id, 'Sitakunda',        'সীতাকুণ্ড');

-- Comilla District
SELECT id INTO d_id FROM districts WHERE name = 'Comilla' AND division_id = 2;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Comilla Sadar',     'কুমিল্লা সদর'),
  (d_id, 'Barura',            'বরুড়া'),
  (d_id, 'Brahmanpara',       'ব্রাহ্মণপাড়া'),
  (d_id, 'Burichang',         'বুড়িচং'),
  (d_id, 'Chandina',          'চান্দিনা'),
  (d_id, 'Chauddagram',       'চৌদ্দগ্রাম'),
  (d_id, 'Daudkandi',         'দাউদকান্দি'),
  (d_id, 'Debidwar',          'দেবিদ্বার'),
  (d_id, 'Homna',             'হোমনা'),
  (d_id, 'Laksam',            'লাকসাম'),
  (d_id, 'Meghna',            'মেঘনা'),
  (d_id, 'Monohorgonj',       'মনোহরগঞ্জ'),
  (d_id, 'Muradnagar',        'মুরাদনগর'),
  (d_id, 'Nangalkot',         'নাঙ্গলকোট'),
  (d_id, 'Titas',             'তিতাস');

-- Cox's Bazar District
SELECT id INTO d_id FROM districts WHERE name = 'Cox''s Bazar' AND division_id = 2;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Cox''s Bazar Sadar', 'কক্সবাজার সদর'),
  (d_id, 'Chakaria',           'চকরিয়া'),
  (d_id, 'Kutubdia',           'কুতুবদিয়া'),
  (d_id, 'Maheshkhali',        'মহেশখালী'),
  (d_id, 'Pekua',              'পেকুয়া'),
  (d_id, 'Ramu',               'রামু'),
  (d_id, 'Teknaf',             'টেকনাফ'),
  (d_id, 'Ukhia',              'উখিয়া');

-- Feni District
SELECT id INTO d_id FROM districts WHERE name = 'Feni' AND division_id = 2;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Feni Sadar',   'ফেনী সদর'),
  (d_id, 'Chhagalnaiya', 'ছাগলনাইয়া'),
  (d_id, 'Daganbhuiyan', 'দাগনভূঞা'),
  (d_id, 'Fulgazi',      'ফুলগাজী'),
  (d_id, 'Parshuram',    'পরশুরাম'),
  (d_id, 'Sonagazi',     'সোনাগাজী');

-- Khagrachhari District
SELECT id INTO d_id FROM districts WHERE name = 'Khagrachhari' AND division_id = 2;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Khagrachhari Sadar', 'খাগড়াছড়ি সদর'),
  (d_id, 'Dighinala',          'দীঘিনালা'),
  (d_id, 'Guimara',            'গুইমারা'),
  (d_id, 'Lakshmichhari',      'লক্ষ্মীছড়ি'),
  (d_id, 'Mahalchhari',        'মহালছড়ি'),
  (d_id, 'Manikchhari',        'মানিকছড়ি'),
  (d_id, 'Matiranga',          'মাটিরাঙ্গা'),
  (d_id, 'Panchhari',          'পানছড়ি'),
  (d_id, 'Ramgarh',            'রামগড়');

-- Lakshmipur District
SELECT id INTO d_id FROM districts WHERE name = 'Lakshmipur' AND division_id = 2;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Lakshmipur Sadar', 'লক্ষ্মীপুর সদর'),
  (d_id, 'Kamalnagar',       'কমলনগর'),
  (d_id, 'Raipur',           'রায়পুর'),
  (d_id, 'Ramganj',          'রামগঞ্জ'),
  (d_id, 'Ramgati',          'রামগতি');

-- Noakhali District
SELECT id INTO d_id FROM districts WHERE name = 'Noakhali' AND division_id = 2;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Noakhali Sadar',  'নোয়াখালী সদর'),
  (d_id, 'Begumganj',       'বেগমগঞ্জ'),
  (d_id, 'Chatkhil',        'চাটখিল'),
  (d_id, 'Companiganj',     'কোম্পানীগঞ্জ'),
  (d_id, 'Hatiya',          'হাতিয়া'),
  (d_id, 'Kabirhat',        'কবিরহাট'),
  (d_id, 'Senbagh',         'সেনবাগ'),
  (d_id, 'Sonaimuri',       'সোনাইমুড়ী'),
  (d_id, 'Subarnachar',     'সুবর্ণচর');

-- Rangamati District
SELECT id INTO d_id FROM districts WHERE name = 'Rangamati' AND division_id = 2;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Rangamati Sadar', 'রাঙ্গামাটি সদর'),
  (d_id, 'Baghaichhari',    'বাঘাইছড়ি'),
  (d_id, 'Barkal',          'বরকল'),
  (d_id, 'Belaichhari',     'বিলাইছড়ি'),
  (d_id, 'Juraichhari',     'জুরাছড়ি'),
  (d_id, 'Kaptai',          'কাপ্তাই'),
  (d_id, 'Kawkhali',        'কাউখালী'),
  (d_id, 'Langadu',         'লংগদু'),
  (d_id, 'Naniarchar',      'নানিয়ারচর'),
  (d_id, 'Rajasthali',      'রাজস্থলী');

-- =========================================================================
-- RAJSHAHI DIVISION
-- =========================================================================

-- Bogra District
SELECT id INTO d_id FROM districts WHERE name = 'Bogra' AND division_id = 3;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Bogra Sadar',  'বগুড়া সদর'),
  (d_id, 'Adamdighi',    'আদমদিঘি'),
  (d_id, 'Dhunat',       'ধুনট'),
  (d_id, 'Dupchanchia',  'দুপচাঁচিয়া'),
  (d_id, 'Gabtali',      'গাবতলী'),
  (d_id, 'Kahaloo',      'কাহালু'),
  (d_id, 'Nandigram',    'নন্দীগ্রাম'),
  (d_id, 'Sariakandi',   'সারিয়াকান্দি'),
  (d_id, 'Shajahanpur',  'শাজাহানপুর'),
  (d_id, 'Sherpur',      'শেরপুর'),
  (d_id, 'Shibganj',     'শিবগঞ্জ'),
  (d_id, 'Sonatola',     'সোনাতলা');

-- Chapainawabganj District
SELECT id INTO d_id FROM districts WHERE name = 'Chapainawabganj' AND division_id = 3;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Chapainawabganj Sadar', 'চাঁপাইনবাবগঞ্জ সদর'),
  (d_id, 'Bholahat',              'ভোলাহাট'),
  (d_id, 'Gomastapur',            'গোমস্তাপুর'),
  (d_id, 'Nachole',               'নাচোল'),
  (d_id, 'Shibganj',              'শিবগঞ্জ');

-- Joypurhat District
SELECT id INTO d_id FROM districts WHERE name = 'Joypurhat' AND division_id = 3;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Joypurhat Sadar', 'জয়পুরহাট সদর'),
  (d_id, 'Akkelpur',        'আক্কেলপুর'),
  (d_id, 'Kalai',           'কালাই'),
  (d_id, 'Khetlal',         'ক্ষেতলাল'),
  (d_id, 'Panchbibi',       'পাঁচবিবি');

-- Naogaon District
SELECT id INTO d_id FROM districts WHERE name = 'Naogaon' AND division_id = 3;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Naogaon Sadar', 'নওগাঁ সদর'),
  (d_id, 'Atrai',         'আত্রাই'),
  (d_id, 'Badalgachhi',   'বদলগাছী'),
  (d_id, 'Dhamoirhat',    'ধামইরহাট'),
  (d_id, 'Manda',         'মান্দা'),
  (d_id, 'Mohadevpur',    'মহাদেবপুর'),
  (d_id, 'Niamatpur',     'নিয়ামতপুর'),
  (d_id, 'Patnitala',     'পত্নীতলা'),
  (d_id, 'Porsha',        'পোরশা'),
  (d_id, 'Raninagar',     'রাণীনগর'),
  (d_id, 'Sapahar',       'সাপাহার');

-- Natore District
SELECT id INTO d_id FROM districts WHERE name = 'Natore' AND division_id = 3;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Natore Sadar',  'নাটোর সদর'),
  (d_id, 'Bagatipara',    'বাগাতিপাড়া'),
  (d_id, 'Baraigram',     'বড়াইগ্রাম'),
  (d_id, 'Gurudaspur',    'গুরুদাসপুর'),
  (d_id, 'Lalpur',        'লালপুর'),
  (d_id, 'Singra',        'সিংড়া');

-- Nawabganj District
SELECT id INTO d_id FROM districts WHERE name = 'Nawabganj' AND division_id = 3;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Nawabganj Sadar', 'নবাবগঞ্জ সদর'),
  (d_id, 'Bholahat',        'ভোলাহাট'),
  (d_id, 'Gomastapur',      'গোমস্তাপুর'),
  (d_id, 'Nachole',         'নাচোল'),
  (d_id, 'Shibganj',        'শিবগঞ্জ');

-- Pabna District
SELECT id INTO d_id FROM districts WHERE name = 'Pabna' AND division_id = 3;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Pabna Sadar',   'পাবনা সদর'),
  (d_id, 'Atgharia',      'আটঘরিয়া'),
  (d_id, 'Bera',          'বেড়া'),
  (d_id, 'Bhangura',      'ভাঙ্গুড়া'),
  (d_id, 'Chatmohar',     'চাটমোহর'),
  (d_id, 'Faridpur',      'ফরিদপুর'),
  (d_id, 'Ishwardi',      'ঈশ্বরদী'),
  (d_id, 'Santhia',       'সাঁথিয়া'),
  (d_id, 'Sujanagar',     'সুজানগর');

-- Rajshahi District
SELECT id INTO d_id FROM districts WHERE name = 'Rajshahi' AND division_id = 3;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Rajshahi Sadar', 'রাজশাহী সদর'),
  (d_id, 'Bagha',          'বাঘা'),
  (d_id, 'Bagmara',        'বাগমারা'),
  (d_id, 'Charghat',       'চারঘাট'),
  (d_id, 'Durgapur',       'দুর্গাপুর'),
  (d_id, 'Godagari',       'গোদাগাড়ী'),
  (d_id, 'Mohanpur',       'মোহনপুর'),
  (d_id, 'Paba',           'পবা'),
  (d_id, 'Puthia',         'পুঠিয়া'),
  (d_id, 'Tanore',         'তানোর');

-- Sirajganj District
SELECT id INTO d_id FROM districts WHERE name = 'Sirajganj' AND division_id = 3;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Sirajganj Sadar', 'সিরাজগঞ্জ সদর'),
  (d_id, 'Belkuchi',        'বেলকুচি'),
  (d_id, 'Chauhali',        'চৌহালী'),
  (d_id, 'Kamarkhanda',     'কামারখন্দ'),
  (d_id, 'Kazipur',         'কাজীপুর'),
  (d_id, 'Raiganj',         'রায়গঞ্জ'),
  (d_id, 'Shahjadpur',      'শাহজাদপুর'),
  (d_id, 'Tarash',          'তাড়াশ'),
  (d_id, 'Ullahpara',       'উল্লাপাড়া');

-- =========================================================================
-- KHULNA DIVISION
-- =========================================================================

-- Bagerhat District
SELECT id INTO d_id FROM districts WHERE name = 'Bagerhat' AND division_id = 4;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Bagerhat Sadar', 'বাগেরহাট সদর'),
  (d_id, 'Chitalmari',     'চিতলমারী'),
  (d_id, 'Fakirhat',       'ফকিরহাট'),
  (d_id, 'Kachua',         'কচুয়া'),
  (d_id, 'Mollahat',       'মোল্লাহাট'),
  (d_id, 'Mongla',         'মোংলা'),
  (d_id, 'Morrelganj',     'মোড়েলগঞ্জ'),
  (d_id, 'Rampal',         'রামপাল'),
  (d_id, 'Sarankhola',     'শরণখোলা');

-- Chuadanga District
SELECT id INTO d_id FROM districts WHERE name = 'Chuadanga' AND division_id = 4;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Chuadanga Sadar', 'চুয়াডাঙ্গা সদর'),
  (d_id, 'Alamdanga',       'আলমডাঙ্গা'),
  (d_id, 'Damurhuda',       'দামুড়হুদা'),
  (d_id, 'Jibannagar',      'জীবননগর');

-- Jessore District
SELECT id INTO d_id FROM districts WHERE name = 'Jessore' AND division_id = 4;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Jessore Sadar',  'যশোর সদর'),
  (d_id, 'Abhaynagar',     'অভয়নগর'),
  (d_id, 'Bagherpara',     'বাঘারপাড়া'),
  (d_id, 'Chaugachha',     'চৌগাছা'),
  (d_id, 'Jhikargachha',   'ঝিকরগাছা'),
  (d_id, 'Keshabpur',      'কেশবপুর'),
  (d_id, 'Manirampur',     'মণিরামপুর'),
  (d_id, 'Sharsha',        'শার্শা');

-- Jhenaidah District
SELECT id INTO d_id FROM districts WHERE name = 'Jhenaidah' AND division_id = 4;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Jhenaidah Sadar', 'ঝিনাইদহ সদর'),
  (d_id, 'Harinakunda',     'হরিণাকুন্ডু'),
  (d_id, 'Kaliganj',        'কালীগঞ্জ'),
  (d_id, 'Kotchandpur',     'কোটচাঁদপুর'),
  (d_id, 'Maheshpur',       'মহেশপুর'),
  (d_id, 'Shailkupa',       'শৈলকুপা');

-- Khulna District
SELECT id INTO d_id FROM districts WHERE name = 'Khulna' AND division_id = 4;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Khulna Sadar',  'খুলনা সদর'),
  (d_id, 'Batiaghata',    'বটিয়াঘাটা'),
  (d_id, 'Dacope',        'দাকোপ'),
  (d_id, 'Dumuria',       'ডুমুরিয়া'),
  (d_id, 'Dighalia',      'দিঘলিয়া'),
  (d_id, 'Koyra',         'কয়রা'),
  (d_id, 'Paikgachha',    'পাইকগাছা'),
  (d_id, 'Phultala',      'ফুলতলা'),
  (d_id, 'Rupsa',         'রূপসা'),
  (d_id, 'Terokhada',     'তেরখাদা');

-- Kushtia District
SELECT id INTO d_id FROM districts WHERE name = 'Kushtia' AND division_id = 4;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Kushtia Sadar',  'কুষ্টিয়া সদর'),
  (d_id, 'Bheramara',      'ভেড়ামারা'),
  (d_id, 'Daulatpur',      'দৌলতপুর'),
  (d_id, 'Khoksa',         'খোকসা'),
  (d_id, 'Kumarkhali',     'কুমারখালী'),
  (d_id, 'Mirpur',         'মিরপুর');

-- Magura District
SELECT id INTO d_id FROM districts WHERE name = 'Magura' AND division_id = 4;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Magura Sadar',    'মাগুরা সদর'),
  (d_id, 'Mohammadpur',     'মোহাম্মদপুর'),
  (d_id, 'Shalikha',        'শালিখা'),
  (d_id, 'Sreepur',         'শ্রীপুর');

-- Meherpur District
SELECT id INTO d_id FROM districts WHERE name = 'Meherpur' AND division_id = 4;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Meherpur Sadar',  'মেহেরপুর সদর'),
  (d_id, 'Gangni',          'গাংনী'),
  (d_id, 'Mujibnagar',      'মুজিবনগর');

-- Narail District
SELECT id INTO d_id FROM districts WHERE name = 'Narail' AND division_id = 4;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Narail Sadar',   'নড়াইল সদর'),
  (d_id, 'Kalia',          'কালিয়া'),
  (d_id, 'Lohagara',       'লোহাগড়া');

-- Satkhira District
SELECT id INTO d_id FROM districts WHERE name = 'Satkhira' AND division_id = 4;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Satkhira Sadar', 'সাতক্ষীরা সদর'),
  (d_id, 'Assasuni',       'আশাশুনি'),
  (d_id, 'Debhata',        'দেবহাটা'),
  (d_id, 'Kalaroa',        'কলারোয়া'),
  (d_id, 'Kaliganj',       'কালীগঞ্জ'),
  (d_id, 'Shyamnagar',     'শ্যামনগর'),
  (d_id, 'Tala',           'তালা');

-- =========================================================================
-- BARISHAL DIVISION
-- =========================================================================

-- Barguna District
SELECT id INTO d_id FROM districts WHERE name = 'Barguna' AND division_id = 5;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Barguna Sadar',  'বরগুনা সদর'),
  (d_id, 'Amtali',         'আমতলী'),
  (d_id, 'Bamna',          'বামনা'),
  (d_id, 'Betagi',         'বেতাগী'),
  (d_id, 'Patharghata',    'পাথরঘাটা'),
  (d_id, 'Taltali',        'তালতলী');

-- Barishal District
SELECT id INTO d_id FROM districts WHERE name = 'Barishal' AND division_id = 5;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Barishal Sadar', 'বরিশাল সদর'),
  (d_id, 'Agailjhara',     'আগৈলঝাড়া'),
  (d_id, 'Babuganj',       'বাবুগঞ্জ'),
  (d_id, 'Bakerganj',      'বাকেরগঞ্জ'),
  (d_id, 'Banaripara',     'বানারীপাড়া'),
  (d_id, 'Gaurnadi',       'গৌরনদী'),
  (d_id, 'Hizla',          'হিজলা'),
  (d_id, 'Mehendiganj',    'মেহেন্দিগঞ্জ'),
  (d_id, 'Muladi',         'মুলাদী'),
  (d_id, 'Wazirpur',       'ওয়াজিপুর');

-- Bhola District
SELECT id INTO d_id FROM districts WHERE name = 'Bhola' AND division_id = 5;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Bhola Sadar',   'ভোলা সদর'),
  (d_id, 'Borhanuddin',   'বোরহানউদ্দিন'),
  (d_id, 'Char Fasson',   'চরফ্যাশন'),
  (d_id, 'Daulatkhan',    'দৌলতখান'),
  (d_id, 'Lalmohan',      'লালমোহন'),
  (d_id, 'Manpura',       'মনপুরা'),
  (d_id, 'Tazumuddin',    'তজুমদ্দিন');

-- Jhalokathi District
SELECT id INTO d_id FROM districts WHERE name = 'Jhalokathi' AND division_id = 5;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Jhalokathi Sadar', 'ঝালকাঠি সদর'),
  (d_id, 'Kathalia',         'কাঠালিয়া'),
  (d_id, 'Nalchity',         'নলছিটি'),
  (d_id, 'Rajapur',          'রাজাপুর');

-- Patuakhali District
SELECT id INTO d_id FROM districts WHERE name = 'Patuakhali' AND division_id = 5;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Patuakhali Sadar', 'পটুয়াখালী সদর'),
  (d_id, 'Bauphal',          'বাউফল'),
  (d_id, 'Dashmina',         'দশমিনা'),
  (d_id, 'Dumki',            'দুমকী'),
  (d_id, 'Galachipa',        'গলাচিপা'),
  (d_id, 'Kalapara',         'কলাপাড়া'),
  (d_id, 'Mirzaganj',        'মির্জাগঞ্জ'),
  (d_id, 'Rangabali',        'রাঙ্গাবালী');

-- Pirojpur District
SELECT id INTO d_id FROM districts WHERE name = 'Pirojpur' AND division_id = 5;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Pirojpur Sadar',    'পিরোজপুর সদর'),
  (d_id, 'Bhandaria',         'ভাণ্ডারিয়া'),
  (d_id, 'Kawkhali',          'কাউখালী'),
  (d_id, 'Mathbaria',         'মঠবাড়িয়া'),
  (d_id, 'Nazirpur',          'নাজিরপুর'),
  (d_id, 'Nesarabad',         'নেছারাবাদ'),
  (d_id, 'Zianagar',          'জিয়ানগর');

-- =========================================================================
-- SYLHET DIVISION
-- =========================================================================

-- Habiganj District
SELECT id INTO d_id FROM districts WHERE name = 'Habiganj' AND division_id = 6;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Habiganj Sadar', 'হবিগঞ্জ সদর'),
  (d_id, 'Ajmiriganj',     'আজমিরীগঞ্জ'),
  (d_id, 'Bahubal',        'বাহুবল'),
  (d_id, 'Baniachong',     'বানিয়াচং'),
  (d_id, 'Chunarughat',    'চুনারুঘাট'),
  (d_id, 'Lakhai',         'লাখাই'),
  (d_id, 'Madhabpur',      'মাধবপুর'),
  (d_id, 'Nabiganj',       'নবীগঞ্জ'),
  (d_id, 'Sayestaganj',    'সায়েস্তাগঞ্জ');

-- Moulvibazar District
SELECT id INTO d_id FROM districts WHERE name = 'Moulvibazar' AND division_id = 6;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Moulvibazar Sadar', 'মৌলভীবাজার সদর'),
  (d_id, 'Barlekha',          'বড়লেখা'),
  (d_id, 'Juri',              'জুড়ী'),
  (d_id, 'Kamalganj',         'কমলগঞ্জ'),
  (d_id, 'Kulaura',           'কুলাউড়া'),
  (d_id, 'Rajnagar',          'রাজনগর'),
  (d_id, 'Sreemangal',        'শ্রীমঙ্গল');

-- Sunamganj District
SELECT id INTO d_id FROM districts WHERE name = 'Sunamganj' AND division_id = 6;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Sunamganj Sadar',  'সুনামগঞ্জ সদর'),
  (d_id, 'Bishwamvarpur',    'বিশ্বম্ভরপুর'),
  (d_id, 'Chhatak',          'ছাতক'),
  (d_id, 'Derai',            'দিরাই'),
  (d_id, 'Dharampasha',      'ধর্মপাশা'),
  (d_id, 'Dowarabazar',      'দোয়ারাবাজার'),
  (d_id, 'Jagannathpur',     'জগন্নাথপুর'),
  (d_id, 'Jamalganj',        'জামালগঞ্জ'),
  (d_id, 'Sulla',            'শাল্লা'),
  (d_id, 'Tahirpur',         'তাহিরপুর');

-- Sylhet District
SELECT id INTO d_id FROM districts WHERE name = 'Sylhet' AND division_id = 6;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Sylhet Sadar',     'সিলেট সদর'),
  (d_id, 'Balaganj',         'বালাগঞ্জ'),
  (d_id, 'Beanibazar',       'বিয়ানীবাজার'),
  (d_id, 'Bishwanath',       'বিশ্বনাথ'),
  (d_id, 'Companiganj',      'কোম্পানীগঞ্জ'),
  (d_id, 'Dakshin Surma',    'দক্ষিণ সুরমা'),
  (d_id, 'Fenchuganj',       'ফেঞ্চুগঞ্জ'),
  (d_id, 'Golapganj',        'গোলাপগঞ্জ'),
  (d_id, 'Gowainghat',       'গোয়াইনঘাট'),
  (d_id, 'Jaintiapur',       'জৈন্তাপুর'),
  (d_id, 'Kanaighat',        'কানাইঘাট'),
  (d_id, 'Osmaninagar',      'ওসমানীনগর'),
  (d_id, 'Zakiganj',         'জকিগঞ্জ');

-- =========================================================================
-- RANGPUR DIVISION
-- =========================================================================

-- Dinajpur District
SELECT id INTO d_id FROM districts WHERE name = 'Dinajpur' AND division_id = 7;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Dinajpur Sadar', 'দিনাজপুর সদর'),
  (d_id, 'Birampur',       'বীরামপুর'),
  (d_id, 'Birganj',        'বীরগঞ্জ'),
  (d_id, 'Biral',          'বিরল'),
  (d_id, 'Bochaganj',      'বোচাগঞ্জ'),
  (d_id, 'Chirirbandar',   'চিরিরবন্দর'),
  (d_id, 'Fulbari',        'ফুলবাড়ী'),
  (d_id, 'Ghoraghat',      'ঘোড়াঘাট'),
  (d_id, 'Hakimpur',       'হাকিমপুর'),
  (d_id, 'Kaharole',       'কাহারোল'),
  (d_id, 'Khansama',       'খানসামা'),
  (d_id, 'Nawabganj',      'নবাবগঞ্জ'),
  (d_id, 'Parbatipur',     'পার্বতীপুর');

-- Gaibandha District
SELECT id INTO d_id FROM districts WHERE name = 'Gaibandha' AND division_id = 7;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Gaibandha Sadar', 'গাইবান্ধা সদর'),
  (d_id, 'Fulchhari',       'ফুলছড়ি'),
  (d_id, 'Gobindaganj',     'গোবিন্দগঞ্জ'),
  (d_id, 'Palashbari',      'পলাশবাড়ী'),
  (d_id, 'Sadullapur',      'সাদুল্লাপুর'),
  (d_id, 'Saghata',         'সাঘাটা'),
  (d_id, 'Sundarganj',      'সুন্দরগঞ্জ');

-- Kurigram District
SELECT id INTO d_id FROM districts WHERE name = 'Kurigram' AND division_id = 7;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Kurigram Sadar',  'কুড়িগ্রাম সদর'),
  (d_id, 'Bhurungamari',    'ভূরুঙ্গামারী'),
  (d_id, 'Char Rajibpur',   'চর রাজিবপুর'),
  (d_id, 'Chilmari',        'চিলমারী'),
  (d_id, 'Nageshwari',      'নাগেশ্বরী'),
  (d_id, 'Phulbari',        'ফুলবাড়ী'),
  (d_id, 'Rajarhat',        'রাজারহাট'),
  (d_id, 'Raumari',         'রৌমারী'),
  (d_id, 'Ulipur',          'উলিপুর');

-- Lalmonirhat District
SELECT id INTO d_id FROM districts WHERE name = 'Lalmonirhat' AND division_id = 7;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Lalmonirhat Sadar', 'লালমনিরহাট সদর'),
  (d_id, 'Aditmari',          'আদিতমারী'),
  (d_id, 'Hatibandha',        'হাতীবান্ধা'),
  (d_id, 'Kaliganj',          'কালীগঞ্জ'),
  (d_id, 'Patgram',           'পাটগ্রাম');

-- Nilphamari District
SELECT id INTO d_id FROM districts WHERE name = 'Nilphamari' AND division_id = 7;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Nilphamari Sadar', 'নীলফামারী সদর'),
  (d_id, 'Dimla',            'ডিমলা'),
  (d_id, 'Domar',            'ডোমার'),
  (d_id, 'Jaldhaka',         'জলঢাকা'),
  (d_id, 'Kishoreganj',      'কিশোরগঞ্জ'),
  (d_id, 'Saidpur',          'সৈয়দপুর');

-- Panchagarh District
SELECT id INTO d_id FROM districts WHERE name = 'Panchagarh' AND division_id = 7;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Panchagarh Sadar', 'পঞ্চগড় সদর'),
  (d_id, 'Atwari',           'আটোয়ারী'),
  (d_id, 'Boda',             'বোদা'),
  (d_id, 'Debiganj',         'দেবীগঞ্জ'),
  (d_id, 'Tetulia',          'তেতুলিয়া');

-- Rangpur District
SELECT id INTO d_id FROM districts WHERE name = 'Rangpur' AND division_id = 7;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Rangpur Sadar',  'রংপুর সদর'),
  (d_id, 'Badarganj',      'বদরগঞ্জ'),
  (d_id, 'Gangachara',     'গঙ্গাচড়া'),
  (d_id, 'Kaunia',         'কাউনিয়া'),
  (d_id, 'Mithapukur',     'মিঠাপুকুর'),
  (d_id, 'Pirgachha',      'পীরগাছা'),
  (d_id, 'Pirganj',        'পীরগঞ্জ'),
  (d_id, 'Taraganj',       'তারাগঞ্জ');

-- Thakurgaon District
SELECT id INTO d_id FROM districts WHERE name = 'Thakurgaon' AND division_id = 7;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Thakurgaon Sadar', 'ঠাকুরগাঁও সদর'),
  (d_id, 'Baliadangi',       'বালিয়াডাঙ্গী'),
  (d_id, 'Haripur',          'হরিপুর'),
  (d_id, 'Pirganj',          'পীরগঞ্জ'),
  (d_id, 'Ranisankail',      'রাণীশংকৈল');

-- =========================================================================
-- MYMENSINGH DIVISION
-- =========================================================================

-- Jamalpur District
SELECT id INTO d_id FROM districts WHERE name = 'Jamalpur' AND division_id = 8;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Jamalpur Sadar', 'জামালপুর সদর'),
  (d_id, 'Bakshiganj',     'বকশীগঞ্জ'),
  (d_id, 'Dewanganj',      'দেওয়ানগঞ্জ'),
  (d_id, 'Islampur',       'ইসলামপুর'),
  (d_id, 'Madarganj',      'মাদারগঞ্জ'),
  (d_id, 'Melandaha',      'মেলান্দহ'),
  (d_id, 'Sarishabari',    'সরিষাবাড়ী');

-- Mymensingh District
SELECT id INTO d_id FROM districts WHERE name = 'Mymensingh' AND division_id = 8;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Mymensingh Sadar', 'ময়মনসিংহ সদর'),
  (d_id, 'Bhaluka',          'ভালুকা'),
  (d_id, 'Dhobaura',         'ধোবাউড়া'),
  (d_id, 'Fulbaria',         'ফুলবাড়িয়া'),
  (d_id, 'Gaffargaon',       'গফরগাঁও'),
  (d_id, 'Gauripur',         'গৌরীপুর'),
  (d_id, 'Haluaghat',        'হালুয়াঘাট'),
  (d_id, 'Ishwarganj',       'ঈশ্বরগঞ্জ'),
  (d_id, 'Muktagachha',      'মুক্তাগাছা'),
  (d_id, 'Nandail',          'নান্দাইল'),
  (d_id, 'Phulpur',          'ফুলপুর'),
  (d_id, 'Trishal',          'ত্রিশাল');

-- Netrokona District
SELECT id INTO d_id FROM districts WHERE name = 'Netrokona' AND division_id = 8;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Netrokona Sadar', 'নেত্রকোণা সদর'),
  (d_id, 'Atpara',          'আটপাড়া'),
  (d_id, 'Barhatta',        'বারহাট্টা'),
  (d_id, 'Durgapur',        'দুর্গাপুর'),
  (d_id, 'Kalmakanda',      'কলমাকান্দা'),
  (d_id, 'Kendua',          'কেন্দুয়া'),
  (d_id, 'Khaliajuri',      'খালিয়াজুরী'),
  (d_id, 'Madan',           'মদন'),
  (d_id, 'Mohanganj',       'মোহনগঞ্জ'),
  (d_id, 'Purbadhala',      'পূর্বধলা');

-- Sherpur District
SELECT id INTO d_id FROM districts WHERE name = 'Sherpur' AND division_id = 8;
INSERT INTO upazilas (district_id, name, bn_name) VALUES
  (d_id, 'Sherpur Sadar',  'শেরপুর সদর'),
  (d_id, 'Jhenaigati',     'ঝিনাইগাতী'),
  (d_id, 'Nakla',          'নকলা'),
  (d_id, 'Nalitabari',     'নালিতাবাড়ী'),
  (d_id, 'Sreebardi',      'শ্রীবরদী');

END;
$$;
