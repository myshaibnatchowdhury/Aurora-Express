export type UserRole =
  | 'platform_super_admin'
  | 'company_owner'
  | 'general_manager'
  | 'counter_manager'
  | 'counter_operator'
  | 'accountant'
  | 'fleet_manager'
  | 'agent'
  | 'boarding_staff'
  | 'passenger';

export type BusType = 'AC_BUSINESS' | 'AC_SLEEPER' | 'AC_ECONOMY' | 'NON_AC';
export type SeatingLayout = '2x2' | '2x1_VIP' | '1x2';

export interface Tenant {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  subscriptionTier: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  cancellationFeePercent: number;
  minHoursBeforeCancellation: number;
  currency: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  tenantId?: string;
  counterId?: string;
  agentId?: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Counter {
  id: string;
  tenantId: string;
  name: string;
  nameBn: string;
  city: string;
  address: string;
  phone: string;
  isActive: boolean;
}

export interface Bus {
  id: string;
  tenantId: string;
  coachNumber: string;
  registrationNumber: string;
  model: string;
  busType: BusType;
  seatingLayout: SeatingLayout;
  totalSeats: number;
  amenities: string[];
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

export interface BusSeat {
  id: string;
  busId: string;
  seatNumber: string;
  rowNumber: number;
  colNumber: number;
  seatClass: 'ECONOMY' | 'BUSINESS' | 'VIP';
  isBlocked: boolean;
}

export interface RouteStop {
  id: string;
  routeId: string;
  stopName: string;
  stopNameBn: string;
  stopType: 'BOARDING' | 'DROPPING' | 'BOTH';
  stopOrder: number;
  counterId?: string;
}

export interface Route {
  id: string;
  tenantId: string;
  origin: string;
  destination: string;
  originBn: string;
  destinationBn: string;
  distanceKm: number;
  estimatedDuration: string;
  estimatedDurationBn: string;
  startingFare: number;
  isPopular: boolean;
  imageUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  stops: RouteStop[];
}

export interface Trip {
  id: string;
  tenantId: string;
  routeId: string;
  busId: string;
  tripNumber: string;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  arrivalTime: string;   // HH:mm
  baseFare: number;
  serviceFee: number;
  status: 'SCHEDULED' | 'BOARDING' | 'DEPARTED' | 'COMPLETED' | 'CANCELLED';
  isPublished: boolean;
  bus?: Bus;
  route?: Route;
}

export type SeatState = 'AVAILABLE' | 'HELD' | 'BOOKED' | 'BLOCKED' | 'SELECTED';

export interface SeatInventoryItem {
  seatNumber: string;
  rowNumber: number;
  colNumber: number;
  seatClass: 'ECONOMY' | 'BUSINESS' | 'VIP';
  status: SeatState;
  fare: number;
  heldUntil?: string;
}

export interface Booking {
  id: string;
  pnr: string;
  tenantId: string;
  tripId: string;
  userId?: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail?: string;
  passengerGender?: 'MALE' | 'FEMALE' | 'OTHER';
  boardingPoint: string;
  droppingPoint: string;
  seatNumbers: string[];
  seatCount: number;
  subtotal: number;
  discount: number;
  serviceFee: number;
  totalAmount: number;
  paymentMethod: 'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD' | 'CASH' | 'AGENT_CREDIT';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  bookingStatus: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  bookedVia: 'ONLINE' | 'COUNTER' | 'AGENT';
  counterId?: string;
  agentId?: string;
  verificationToken: string;
  createdAt: string;
  trip?: Trip;
}

export interface Ticket {
  id: string;
  bookingId: string;
  ticketNumber: string;
  seatNumber: string;
  fare: number;
  status: 'ISSUED' | 'BOARDED' | 'CANCELLED';
  boardedAt?: string;
}

export interface PaymentRecord {
  id: string;
  tenantId: string;
  bookingId: string;
  amount: number;
  currency: string;
  gateway: 'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD' | 'CASH_COUNTER';
  transactionReference: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  createdAt: string;
}

export interface RefundRequest {
  id: string;
  tenantId: string;
  bookingId: string;
  pnr: string;
  requestedBy: string;
  passengerPhone: string;
  totalAmount: number;
  cancellationFee: number;
  refundableAmount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
}

export interface CounterShift {
  id: string;
  counterId: string;
  counterName: string;
  openedByUserId: string;
  openedByName: string;
  closedByUserId?: string;
  openingCash: number;
  cashSalesTotal: number;
  expectedClosingCash: number;
  actualClosingCash?: number;
  variance?: number;
  status: 'OPEN' | 'CLOSED';
  openedAt: string;
  closedAt?: string;
  notes?: string;
}

export interface AgentAccount {
  id: string;
  tenantId: string;
  agencyName: string;
  agentName: string;
  phone: string;
  email: string;
  commissionRatePercent: number;
  creditLimit: number;
  currentBalance: number;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface FinancialLedgerEntry {
  id: string;
  tenantId: string;
  date: string;
  entryType: 'TICKET_SALE' | 'REFUND' | 'AGENT_COMMISSION' | 'CASH_DRAWER' | 'PAYMENT_SETTLEMENT';
  amount: number;
  flow: 'CREDIT' | 'DEBIT';
  description: string;
  referenceId: string;
  counterId?: string;
  agentId?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  maxBuses: number;
  maxCounters: number;
  maxStaff: number;
  features: string[];
}
