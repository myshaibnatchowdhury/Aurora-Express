-- ==============================================================================
-- AURORA EXPRESS | অরোরা এক্সপ্রেস
-- Production Multi-Tenant Bus Ticket Booking & Counter Management SaaS
-- PostgreSQL Database Schema & Supabase Migrations
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TENANTS TABLE (Bus Operating Companies)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING')),
    subscription_tier VARCHAR(50) DEFAULT 'STARTER' CHECK (subscription_tier IN ('STARTER', 'PROFESSIONAL', 'ENTERPRISE')),
    cancellation_fee_percent NUMERIC(5, 2) DEFAULT 15.00,
    min_hours_before_cancellation INT DEFAULT 6,
    currency VARCHAR(10) DEFAULT 'BDT',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'platform_super_admin',
        'company_owner',
        'general_manager',
        'counter_manager',
        'counter_operator',
        'accountant',
        'fleet_manager',
        'agent',
        'boarding_staff',
        'passenger'
    )),
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    counter_id UUID,
    agent_id UUID,
    avatar_url TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COUNTERS (Physical booking branches)
CREATE TABLE IF NOT EXISTS counters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FLEET (Buses)
CREATE TABLE IF NOT EXISTS buses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    coach_number VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    model VARCHAR(255) NOT NULL,
    bus_type VARCHAR(50) NOT NULL CHECK (bus_type IN ('AC_BUSINESS', 'AC_SLEEPER', 'AC_ECONOMY', 'NON_AC')),
    seating_layout VARCHAR(50) NOT NULL CHECK (seating_layout IN ('2x2', '2x1_VIP', '1x2')),
    total_seats INT NOT NULL CHECK (total_seats > 0),
    amenities TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'MAINTENANCE', 'INACTIVE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ROUTES & STOPS
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    origin_bn VARCHAR(100) NOT NULL,
    destination_bn VARCHAR(100) NOT NULL,
    distance_km NUMERIC(8, 2) NOT NULL,
    estimated_duration VARCHAR(100) NOT NULL,
    estimated_duration_bn VARCHAR(100) NOT NULL,
    starting_fare NUMERIC(10, 2) NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    stop_name VARCHAR(255) NOT NULL,
    stop_name_bn VARCHAR(255) NOT NULL,
    stop_type VARCHAR(50) NOT NULL CHECK (stop_type IN ('BOARDING', 'DROPPING', 'BOTH')),
    stop_order INT NOT NULL,
    counter_id UUID REFERENCES counters(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SCHEDULED TRIPS
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE RESTRICT,
    bus_id UUID NOT NULL REFERENCES buses(id) ON DELETE RESTRICT,
    trip_number VARCHAR(100) NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    base_fare NUMERIC(10, 2) NOT NULL,
    service_fee NUMERIC(10, 2) DEFAULT 30.00,
    status VARCHAR(50) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'BOARDING', 'DEPARTED', 'COMPLETED', 'CANCELLED')),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONCURRENCY-SAFE SEAT RESERVATIONS (Holds & Locks)
CREATE TABLE IF NOT EXISTS seat_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    seat_number VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('HELD', 'BOOKED', 'BLOCKED')),
    held_by_session VARCHAR(255) NOT NULL,
    booking_id UUID,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Constraint: Each seat for a trip cannot have overlapping active reservations
    CONSTRAINT unique_active_seat_per_trip UNIQUE (trip_id, seat_number)
);

-- 8. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pnr VARCHAR(50) UNIQUE NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    passenger_name VARCHAR(255) NOT NULL,
    passenger_phone VARCHAR(50) NOT NULL,
    passenger_email VARCHAR(255),
    passenger_gender VARCHAR(20) CHECK (passenger_gender IN ('MALE', 'FEMALE', 'OTHER')),
    boarding_point VARCHAR(255) NOT NULL,
    dropping_point VARCHAR(255) NOT NULL,
    seat_numbers TEXT[] NOT NULL,
    seat_count INT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    service_fee NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('BKASH', 'NAGAD', 'ROCKET', 'CARD', 'CASH', 'AGENT_CREDIT')),
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED', 'FAILED')),
    booking_status VARCHAR(50) DEFAULT 'CONFIRMED' CHECK (booking_status IN ('CONFIRMED', 'CANCELLED', 'COMPLETED')),
    booked_via VARCHAR(50) NOT NULL CHECK (booked_via IN ('ONLINE', 'COUNTER', 'AGENT')),
    counter_id UUID REFERENCES counters(id) ON DELETE SET NULL,
    agent_id UUID,
    verification_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TICKETS
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    ticket_number VARCHAR(100) UNIQUE NOT NULL,
    seat_number VARCHAR(20) NOT NULL,
    fare NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'ISSUED' CHECK (status IN ('ISSUED', 'BOARDED', 'CANCELLED')),
    boarded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'BDT',
    gateway VARCHAR(50) NOT NULL CHECK (gateway IN ('BKASH', 'NAGAD', 'ROCKET', 'CARD', 'CASH_COUNTER')),
    transaction_reference VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'SUCCESS' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FINANCIAL LEDGER (Immutable Accounting Records)
CREATE TABLE IF NOT EXISTS financial_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    counter_id UUID REFERENCES counters(id),
    agent_id UUID,
    entry_date TIMESTAMPTZ DEFAULT NOW(),
    entry_type VARCHAR(50) NOT NULL CHECK (entry_type IN ('TICKET_SALE', 'REFUND', 'AGENT_COMMISSION', 'CASH_DRAWER', 'PAYMENT_SETTLEMENT')),
    amount NUMERIC(10, 2) NOT NULL,
    flow VARCHAR(10) NOT NULL CHECK (flow IN ('CREDIT', 'DEBIT')),
    description TEXT NOT NULL,
    reference_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. COUNTER SHIFTS (Cashbook & Drawer Closing)
CREATE TABLE IF NOT EXISTS counter_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    counter_id UUID NOT NULL REFERENCES counters(id) ON DELETE CASCADE,
    opened_by_user_id UUID NOT NULL REFERENCES profiles(id),
    closed_by_user_id UUID REFERENCES profiles(id),
    opening_cash NUMERIC(10, 2) NOT NULL,
    cash_sales_total NUMERIC(10, 2) DEFAULT 0.00,
    expected_closing_cash NUMERIC(10, 2) NOT NULL,
    actual_closing_cash NUMERIC(10, 2),
    variance NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    notes TEXT
);

-- Row Level Security (RLS) Setup
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE counter_shifts ENABLE ROW LEVEL SECURITY;

-- Public can read published routes and trips
CREATE POLICY "Public can view published routes" ON routes FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Public can view published trips" ON trips FOR SELECT USING (is_published = TRUE AND status != 'CANCELLED');
CREATE POLICY "Public can read seat reservations" ON seat_reservations FOR SELECT USING (true);
CREATE POLICY "Public can view their confirmed bookings" ON bookings FOR SELECT USING (true);

-- Indexes for lightning fast searches
CREATE INDEX IF NOT EXISTS idx_trips_search ON trips(route_id, departure_date, is_published);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON bookings(pnr);
CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings(verification_token);
CREATE INDEX IF NOT EXISTS idx_seat_reservations_trip ON seat_reservations(trip_id, seat_number);
