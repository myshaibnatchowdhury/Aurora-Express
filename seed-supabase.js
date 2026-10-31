const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ynmpljrhskxsuuaxszyl.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Fixed valid UUIDs for clean relational mapping
const TENANT_ID = '11111111-1111-1111-1111-111111111111';

const COUNTER_IDS = {
  gabtoli: '22222222-2222-2222-2222-222222220001',
  sayedabad: '22222222-2222-2222-2222-222222220002',
  dampara: '22222222-2222-2222-2222-222222220003',
  kolatoli: '22222222-2222-2222-2222-222222220004',
  kadamtoli: '22222222-2222-2222-2222-222222220005',
  shiroil: '22222222-2222-2222-2222-222222220006',
};

const BUS_IDS = {
  scania: '33333333-3333-3333-3333-333333330001',
  hyundai: '33333333-3333-3333-3333-333333330002',
  hino: '33333333-3333-3333-3333-333333330003',
  volvo: '33333333-3333-3333-3333-333333330004',
};

const ROUTE_IDS = {
  dhakaCtg: '44444444-4444-4444-4444-444444440001',
  ctgDhaka: '44444444-4444-4444-4444-444444440002',
  dhakaSylhet: '44444444-4444-4444-4444-444444440003',
  dhakaCox: '44444444-4444-4444-4444-444444440004',
  dhakaRajshahi: '44444444-4444-4444-4444-444444440005',
};

async function seed() {
  console.log('--- Starting Supabase Database Seed for Aurora Express ---');

  // 1. TENANT
  console.log('1. Inserting Tenant...');
  const { data: tenant, error: tenantErr } = await supabase.from('tenants').upsert([
    {
      id: TENANT_ID,
      name: 'Aurora Express Ltd.',
      name_bn: 'অরোরা এক্সপ্রেস লিঃ',
      slug: 'aurora-express',
      logo_url: '/images/aurora-logo.jpg',
      contact_email: 'contact@auroraexpress.com',
      contact_phone: '+880 1711-000000',
      address: 'Level 4, Gabtoli Bus Terminal Commercial Complex, Dhaka-1216, Bangladesh',
      status: 'ACTIVE',
      subscription_tier: 'ENTERPRISE',
      cancellation_fee_percent: 15.00,
      min_hours_before_cancellation: 6,
      currency: 'BDT'
    }
  ], { onConflict: 'id' }).select();

  if (tenantErr) {
    console.error('Tenant insert error:', tenantErr);
    return;
  }
  console.log('✓ Tenant inserted successfully!');

  // 2. COUNTERS
  console.log('2. Inserting Counters...');
  const counters = [
    {
      id: COUNTER_IDS.gabtoli,
      tenant_id: TENANT_ID,
      name: 'Gabtoli Main Counter',
      name_bn: 'গাবতলী প্রধান কাউন্টার',
      city: 'Dhaka',
      address: 'Counter 12-14, Gabtoli Inter-District Bus Terminal, Dhaka',
      phone: '01711-123451',
      is_active: true
    },
    {
      id: COUNTER_IDS.sayedabad,
      tenant_id: TENANT_ID,
      name: 'Sayedabad Terminal Counter',
      name_bn: 'সায়েদাবাদ টার্মিনাল কাউন্টার',
      city: 'Dhaka',
      address: 'Counter 4-5, Sayedabad Central Bus Terminal, Dhaka',
      phone: '01711-123452',
      is_active: true
    },
    {
      id: COUNTER_IDS.dampara,
      tenant_id: TENANT_ID,
      name: 'Dampara Counter',
      name_bn: 'দামপাড়া কাউন্টার (চট্টগ্রাম)',
      city: 'Chittagong',
      address: 'Near Police Line, Dampara, Chittagong',
      phone: '01811-123453',
      is_active: true
    },
    {
      id: COUNTER_IDS.kolatoli,
      tenant_id: TENANT_ID,
      name: 'Kolatoli Beach Counter',
      name_bn: 'কলাতলী বিচ কাউন্টার',
      city: "Cox's Bazar",
      address: 'Hotel Motel Zone, Kolatoli Point, Cox\'s Bazar',
      phone: '01811-123454',
      is_active: true
    },
    {
      id: COUNTER_IDS.kadamtoli,
      tenant_id: TENANT_ID,
      name: 'Kadamtoli Counter',
      name_bn: 'কদমতলী বাস টার্মিনাল কাউন্টার',
      city: 'Sylhet',
      address: 'Kadamtoli Bus Terminal, South Surma, Sylhet',
      phone: '01911-123455',
      is_active: true
    },
    {
      id: COUNTER_IDS.shiroil,
      tenant_id: TENANT_ID,
      name: 'Shiroil Railway Counter',
      name_bn: 'শিরোইল রেলগেট কাউন্টার',
      city: 'Rajshahi',
      address: 'Shiroil Bus Stand, Rajshahi',
      phone: '01711-123456',
      is_active: true
    }
  ];

  const { error: cntErr } = await supabase.from('counters').upsert(counters, { onConflict: 'id' });
  if (cntErr) console.error('Counters insert error:', cntErr);
  else console.log('✓ 6 Counters inserted successfully!');

  // 3. BUSES
  console.log('3. Inserting Buses...');
  const buses = [
    {
      id: BUS_IDS.scania,
      tenant_id: TENANT_ID,
      coach_number: 'AE-101',
      registration_number: 'ঢাকা মেট্রো ব-১৪-৭৮৯১',
      model: 'Scania K410 Multi-Axle',
      bus_type: 'AC_SLEEPER',
      seating_layout: '2x1_VIP',
      total_seats: 28,
      amenities: ['High-speed WiFi', 'Mineral Water', 'Clean Blanket', 'USB Fast Charger', 'Full Recliner', 'Air Suspension'],
      status: 'ACTIVE'
    },
    {
      id: BUS_IDS.hyundai,
      tenant_id: TENANT_ID,
      coach_number: 'AE-102',
      registration_number: 'ঢাকা মেট্রো ব-১৫-২৩৪৫',
      model: 'Hyundai Universe Luxury',
      bus_type: 'AC_BUSINESS',
      seating_layout: '2x2',
      total_seats: 36,
      amenities: ['High-speed WiFi', 'Mineral Water', 'Reclining Ergonomic Seat', 'Reading Light', 'Air Conditioned'],
      status: 'ACTIVE'
    },
    {
      id: BUS_IDS.hino,
      tenant_id: TENANT_ID,
      coach_number: 'AE-103',
      registration_number: 'ঢাকা মেট্রো ব-১১-৯৮১২',
      model: 'Hino 1J Plus Deluxe',
      bus_type: 'NON_AC',
      seating_layout: '2x2',
      total_seats: 40,
      amenities: ['Spacious Legroom', 'Comfortable Suspension', 'Sound System', 'First Aid Box'],
      status: 'ACTIVE'
    },
    {
      id: BUS_IDS.volvo,
      tenant_id: TENANT_ID,
      coach_number: 'AE-104',
      registration_number: 'ঢাকা মেট্রো ব-১৬-৫৬৭৮',
      model: 'Volvo B11R Euro VI',
      bus_type: 'AC_BUSINESS',
      seating_layout: '2x2',
      total_seats: 36,
      amenities: ['High-speed WiFi', 'Mineral Water', 'Premium Snack Box', 'USB Charger', 'Individual AC Vents'],
      status: 'ACTIVE'
    }
  ];

  const { error: busErr } = await supabase.from('buses').upsert(buses, { onConflict: 'id' });
  if (busErr) console.error('Buses insert error:', busErr);
  else console.log('✓ 4 Buses inserted successfully!');

  // 4. ROUTES
  console.log('4. Inserting Routes...');
  const routes = [
    {
      id: ROUTE_IDS.dhakaCtg,
      tenant_id: TENANT_ID,
      origin: 'Dhaka',
      destination: 'Chittagong',
      origin_bn: 'ঢাকা',
      destination_bn: 'চট্টগ্রাম',
      distance_km: 245.0,
      estimated_duration: '3h 30m',
      estimated_duration_bn: '৩ ঘণ্টা ৩০ মিনিট',
      starting_fare: 550.00,
      is_popular: true,
      image_url: '/images/route-dhaka-ctg.jpg',
      status: 'ACTIVE'
    },
    {
      id: ROUTE_IDS.ctgDhaka,
      tenant_id: TENANT_ID,
      origin: 'Chittagong',
      destination: 'Dhaka',
      origin_bn: 'চট্টগ্রাম',
      destination_bn: 'ঢাকা',
      distance_km: 245.0,
      estimated_duration: '3h 30m',
      estimated_duration_bn: '৩ ঘণ্টা ৩০ মিনিট',
      starting_fare: 550.00,
      is_popular: true,
      image_url: '/images/route-ctg-dhaka.jpg',
      status: 'ACTIVE'
    },
    {
      id: ROUTE_IDS.dhakaSylhet,
      tenant_id: TENANT_ID,
      origin: 'Dhaka',
      destination: 'Sylhet',
      origin_bn: 'ঢাকা',
      destination_bn: 'সিলেট',
      distance_km: 240.0,
      estimated_duration: '7h 15m',
      estimated_duration_bn: '৭ ঘণ্টা ১৫ মিনিট',
      starting_fare: 650.00,
      is_popular: true,
      image_url: '/images/route-dhaka-sylhet.jpg',
      status: 'ACTIVE'
    },
    {
      id: ROUTE_IDS.dhakaCox,
      tenant_id: TENANT_ID,
      origin: 'Dhaka',
      destination: "Cox's Bazar",
      origin_bn: 'ঢাকা',
      destination_bn: "কক্সবাজার",
      distance_km: 390.0,
      estimated_duration: '8h 30m',
      estimated_duration_bn: '৮ ঘণ্টা ৩০ মিনিট',
      starting_fare: 850.00,
      is_popular: true,
      image_url: '/images/route-dhaka-cox.jpg',
      status: 'ACTIVE'
    },
    {
      id: ROUTE_IDS.dhakaRajshahi,
      tenant_id: TENANT_ID,
      origin: 'Dhaka',
      destination: 'Rajshahi',
      origin_bn: 'ঢাকা',
      destination_bn: 'রাজশাহী',
      distance_km: 250.0,
      estimated_duration: '5h 45m',
      estimated_duration_bn: '৫ ঘণ্টা ৪৫ মিনিট',
      starting_fare: 450.00,
      is_popular: true,
      image_url: '/images/route-dhaka-rajshahi.jpg',
      status: 'ACTIVE'
    }
  ];

  const { error: routeErr } = await supabase.from('routes').upsert(routes, { onConflict: 'id' });
  if (routeErr) console.error('Routes insert error:', routeErr);
  else console.log('✓ 5 Routes inserted successfully!');

  // 5. ROUTE STOPS
  console.log('5. Inserting Route Stops...');
  const routeStops = [
    { route_id: ROUTE_IDS.dhakaCtg, stop_name: 'Gabtoli Counter', stop_name_bn: 'গাবতলী কাউন্টার', stop_type: 'BOARDING', stop_order: 1, counter_id: COUNTER_IDS.gabtoli },
    { route_id: ROUTE_IDS.dhakaCtg, stop_name: 'Sayedabad Terminal', stop_name_bn: 'সায়েদাবাদ টার্মিনাল', stop_type: 'BOARDING', stop_order: 2, counter_id: COUNTER_IDS.sayedabad },
    { route_id: ROUTE_IDS.dhakaCtg, stop_name: 'Kanchpur Bridge', stop_name_bn: 'কাঁচপুর ব্রিজ', stop_type: 'BOARDING', stop_order: 3 },
    { route_id: ROUTE_IDS.dhakaCtg, stop_name: 'Bhatiari', stop_name_bn: 'ভাটিয়ারী', stop_type: 'DROPPING', stop_order: 4 },
    { route_id: ROUTE_IDS.dhakaCtg, stop_name: 'Dampara Counter', stop_name_bn: 'দামপাড়া কাউন্টার', stop_type: 'DROPPING', stop_order: 5, counter_id: COUNTER_IDS.dampara },

    { route_id: ROUTE_IDS.dhakaCox, stop_name: 'Gabtoli Counter', stop_name_bn: 'গাবতলী কাউন্টার', stop_type: 'BOARDING', stop_order: 1, counter_id: COUNTER_IDS.gabtoli },
    { route_id: ROUTE_IDS.dhakaCox, stop_name: 'Sayedabad Terminal', stop_name_bn: 'সায়েদাবাদ টার্মিনাল', stop_type: 'BOARDING', stop_order: 2, counter_id: COUNTER_IDS.sayedabad },
    { route_id: ROUTE_IDS.dhakaCox, stop_name: 'Kolatoli Beach Counter', stop_name_bn: 'কলাতলী বিচ কাউন্টার', stop_type: 'DROPPING', stop_order: 3, counter_id: COUNTER_IDS.kolatoli },

    { route_id: ROUTE_IDS.dhakaSylhet, stop_name: 'Sayedabad Terminal', stop_name_bn: 'সায়েদাবাদ টার্মিনাল', stop_type: 'BOARDING', stop_order: 1, counter_id: COUNTER_IDS.sayedabad },
    { route_id: ROUTE_IDS.dhakaSylhet, stop_name: 'Kadamtoli Counter', stop_name_bn: 'কদমতলী কাউন্টার', stop_type: 'DROPPING', stop_order: 2, counter_id: COUNTER_IDS.kadamtoli }
  ];

  const { error: stopsErr } = await supabase.from('route_stops').insert(routeStops);
  if (stopsErr) console.warn('Route stops notice:', stopsErr.message);
  else console.log('✓ Route stops inserted successfully!');

  // 6. SCHEDULED TRIPS
  console.log('6. Inserting Scheduled Trips...');
  const trips = [];
  const baseDate = new Date();

  for (let dayOffset = 0; dayOffset <= 10; dayOffset++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + dayOffset);
    const dateStr = d.toISOString().split('T')[0];

    trips.push({
      tenant_id: TENANT_ID,
      route_id: ROUTE_IDS.dhakaCtg,
      bus_id: BUS_IDS.scania,
      trip_number: `AE-701-${dateStr.replace(/-/g, '').slice(4)}`,
      departure_date: dateStr,
      departure_time: '06:30:00',
      arrival_time: '10:00:00',
      base_fare: 800.00,
      service_fee: 30.00,
      status: 'SCHEDULED',
      is_published: true
    });

    trips.push({
      tenant_id: TENANT_ID,
      route_id: ROUTE_IDS.dhakaCtg,
      bus_id: BUS_IDS.hyundai,
      trip_number: `AE-703-${dateStr.replace(/-/g, '').slice(4)}`,
      departure_date: dateStr,
      departure_time: '11:30:00',
      arrival_time: '15:00:00',
      base_fare: 550.00,
      service_fee: 25.00,
      status: 'SCHEDULED',
      is_published: true
    });

    trips.push({
      tenant_id: TENANT_ID,
      route_id: ROUTE_IDS.dhakaCox,
      bus_id: BUS_IDS.scania,
      trip_number: `AE-999-${dateStr.replace(/-/g, '').slice(4)}`,
      departure_date: dateStr,
      departure_time: '22:30:00',
      arrival_time: '07:00:00',
      base_fare: 1200.00,
      service_fee: 50.00,
      status: 'SCHEDULED',
      is_published: true
    });

    trips.push({
      tenant_id: TENANT_ID,
      route_id: ROUTE_IDS.dhakaSylhet,
      bus_id: BUS_IDS.volvo,
      trip_number: `AE-901-${dateStr.replace(/-/g, '').slice(4)}`,
      departure_date: dateStr,
      departure_time: '08:00:00',
      arrival_time: '15:15:00',
      base_fare: 650.00,
      service_fee: 30.00,
      status: 'SCHEDULED',
      is_published: true
    });
  }

  const { error: tripsErr } = await supabase.from('trips').insert(trips);
  if (tripsErr) console.error('Trips insert error:', tripsErr);
  else console.log(`✓ ${trips.length} Trips inserted successfully into Supabase!`);

  console.log('--- Supabase Seeding Completed Successfully! ---');
}

seed().catch(console.error);
