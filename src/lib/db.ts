import {
  Tenant,
  UserProfile,
  Counter,
  Bus,
  Route,
  Trip,
  Booking,
  Ticket,
  CounterShift,
  AgentAccount,
  FinancialLedgerEntry,
  SeatInventoryItem,
  RefundRequest,
  PaymentRecord
} from './types';
import {
  INITIAL_TENANT,
  INITIAL_COUNTERS,
  INITIAL_BUSES,
  INITIAL_ROUTES,
  generateSeedTrips,
  INITIAL_PROFILES,
  INITIAL_AGENTS,
  INITIAL_SHIFTS,
  INITIAL_PLANS,
} from './mock-data';

// Global in-memory storage simulating PostgreSQL tables
class InMemoryDB {
  tenants: Tenant[] = [INITIAL_TENANT];
  counters: Counter[] = [...INITIAL_COUNTERS];
  buses: Bus[] = [...INITIAL_BUSES];
  routes: Route[] = [...INITIAL_ROUTES];
  trips: Trip[] = generateSeedTrips();
  profiles: UserProfile[] = [...INITIAL_PROFILES];
  agents: AgentAccount[] = [...INITIAL_AGENTS];
  shifts: CounterShift[] = [...INITIAL_SHIFTS];
  bookings: Booking[] = [];
  tickets: Ticket[] = [];
  payments: PaymentRecord[] = [];
  refunds: RefundRequest[] = [];
  ledger: FinancialLedgerEntry[] = [];
  
  // Seat reservations map: key = `${tripId}:${seatNumber}` -> { status, expiresAt, sessionId, bookingId }
  seatReservations: Map<string, {
    status: 'HELD' | 'BOOKED' | 'BLOCKED';
    expiresAt: number; // timestamp ms
    sessionId: string;
    bookingId?: string;
  }> = new Map();

  constructor() {
    this.seedInitialBookings();
  }

  private seedInitialBookings() {
    // Pre-seed some booked seats for realism
    const sampleTrip = this.trips[0];
    if (sampleTrip) {
      const bookedSeats = ['A1', 'A2', 'C1', 'D2'];
      bookedSeats.forEach(seat => {
        this.seatReservations.set(`${sampleTrip.id}:${seat}`, {
          status: 'BOOKED',
          expiresAt: Date.now() + 86400000 * 30,
          sessionId: 'seed-session',
          bookingId: 'book-seed-001',
        });
      });

      const seedBooking: Booking = {
        id: 'book-seed-001',
        pnr: 'AE-784912',
        tenantId: INITIAL_TENANT.id,
        tripId: sampleTrip.id,
        passengerName: 'Kamrul Hasan',
        passengerPhone: '01817-987654',
        passengerEmail: 'kamrul.hasan@gmail.com',
        boardingPoint: 'Gabtoli Counter',
        droppingPoint: 'Dampara Counter',
        seatNumbers: ['A1', 'A2'],
        seatCount: 2,
        subtotal: 1600,
        discount: 0,
        serviceFee: 60,
        totalAmount: 1660,
        paymentMethod: 'BKASH',
        paymentStatus: 'PAID',
        bookingStatus: 'CONFIRMED',
        bookedVia: 'ONLINE',
        verificationToken: 'v-tok-88392174',
        createdAt: '2026-10-29T07:30:00Z',
        trip: sampleTrip,
      };

      this.bookings.push(seedBooking);

      this.tickets.push(
        { id: 'tkt-001', bookingId: seedBooking.id, ticketNumber: 'TKT-2026-001', seatNumber: 'A1', fare: 800, status: 'ISSUED' },
        { id: 'tkt-002', bookingId: seedBooking.id, ticketNumber: 'TKT-2026-002', seatNumber: 'A2', fare: 800, status: 'ISSUED' }
      );

      this.payments.push({
        id: 'pay-001',
        tenantId: INITIAL_TENANT.id,
        bookingId: seedBooking.id,
        amount: 1660,
        currency: 'BDT',
        gateway: 'BKASH',
        transactionReference: 'TRX-BK9912401',
        status: 'SUCCESS',
        createdAt: seedBooking.createdAt,
      });

      this.ledger.push({
        id: 'ledg-001',
        tenantId: INITIAL_TENANT.id,
        date: seedBooking.createdAt,
        entryType: 'TICKET_SALE',
        amount: 1660,
        flow: 'CREDIT',
        description: `Online Booking PNR: ${seedBooking.pnr}`,
        referenceId: seedBooking.pnr,
      });
    }
  }

  // --- SEAT MANAGEMENT & CONCURRENCY ---

  getTripSeatInventory(tripId: string, currentSessionId?: string): SeatInventoryItem[] {
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) return [];

    const bus = this.buses.find(b => b.id === trip.busId);
    const layout = bus?.seatingLayout || '2x2';
    const totalSeats = bus?.totalSeats || 36;
    const now = Date.now();

    const items: SeatInventoryItem[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    if (layout === '2x1_VIP') {
      // 3 seats per row: [Col 1, Col 2, aisle, Col 3] -> e.g. A1, A2, A3
      const numRows = Math.ceil(totalSeats / 3);
      for (let r = 0; r < numRows; r++) {
        const rowLetter = rows[r] || `R${r+1}`;
        for (let c = 1; c <= 3; c++) {
          const seatNum = `${rowLetter}${c}`;
          const resKey = `${tripId}:${seatNum}`;
          const res = this.seatReservations.get(resKey);

          let status: 'AVAILABLE' | 'HELD' | 'BOOKED' | 'BLOCKED' | 'SELECTED' = 'AVAILABLE';
          let heldUntil: string | undefined = undefined;

          if (res) {
            if (res.status === 'BOOKED') {
              status = 'BOOKED';
            } else if (res.status === 'BLOCKED') {
              status = 'BLOCKED';
            } else if (res.status === 'HELD') {
              if (res.expiresAt > now) {
                if (currentSessionId && res.sessionId === currentSessionId) {
                  status = 'SELECTED';
                } else {
                  status = 'HELD';
                }
                heldUntil = new Date(res.expiresAt).toISOString();
              } else {
                // Expired hold auto-released
                this.seatReservations.delete(resKey);
                status = 'AVAILABLE';
              }
            }
          }

          items.push({
            seatNumber: seatNum,
            rowNumber: r + 1,
            colNumber: c,
            seatClass: c === 3 ? 'VIP' : 'BUSINESS',
            status,
            fare: trip.baseFare,
            heldUntil,
          });
        }
      }
    } else {
      // 2x2 layout: 4 seats per row -> A1, A2 (Aisle) A3, A4
      const numRows = Math.ceil(totalSeats / 4);
      for (let r = 0; r < numRows; r++) {
        const rowLetter = rows[r] || `R${r+1}`;
        for (let c = 1; c <= 4; c++) {
          const seatNum = `${rowLetter}${c}`;
          const resKey = `${tripId}:${seatNum}`;
          const res = this.seatReservations.get(resKey);

          let status: 'AVAILABLE' | 'HELD' | 'BOOKED' | 'BLOCKED' | 'SELECTED' = 'AVAILABLE';
          let heldUntil: string | undefined = undefined;

          if (res) {
            if (res.status === 'BOOKED') {
              status = 'BOOKED';
            } else if (res.status === 'BLOCKED') {
              status = 'BLOCKED';
            } else if (res.status === 'HELD') {
              if (res.expiresAt > now) {
                if (currentSessionId && res.sessionId === currentSessionId) {
                  status = 'SELECTED';
                } else {
                  status = 'HELD';
                }
                heldUntil = new Date(res.expiresAt).toISOString();
              } else {
                // Expired hold auto-released
                this.seatReservations.delete(resKey);
                status = 'AVAILABLE';
              }
            }
          }

          items.push({
            seatNumber: seatNum,
            rowNumber: r + 1,
            colNumber: c,
            seatClass: 'ECONOMY',
            status,
            fare: trip.baseFare,
            heldUntil,
          });
        }
      }
    }

    return items;
  }

  // Atomic hold operation with 10-minute lock
  holdSeats(tripId: string, seatNumbers: string[], sessionId: string): { success: boolean; message: string; heldSeats?: string[] } {
    const now = Date.now();
    const expiry = now + 10 * 60 * 1000; // 10 minutes lock

    // 1. Check if ANY of the requested seats is currently unavailable
    for (const seat of seatNumbers) {
      const key = `${tripId}:${seat}`;
      const existing = this.seatReservations.get(key);
      if (existing) {
        if (existing.status === 'BOOKED' || existing.status === 'BLOCKED') {
          return { success: false, message: `Seat ${seat} is already booked or blocked.` };
        }
        if (existing.status === 'HELD' && existing.expiresAt > now && existing.sessionId !== sessionId) {
          return { success: false, message: `Seat ${seat} is currently held by another passenger. Please try another seat.` };
        }
      }
    }

    // 2. Safely apply hold to all requested seats
    for (const seat of seatNumbers) {
      const key = `${tripId}:${seat}`;
      this.seatReservations.set(key, {
        status: 'HELD',
        expiresAt: expiry,
        sessionId,
      });
    }

    return { success: true, message: 'Seats locked successfully for 10 minutes.', heldSeats: seatNumbers };
  }

  // Release a held seat
  releaseSeats(tripId: string, seatNumbers: string[], sessionId: string): void {
    for (const seat of seatNumbers) {
      const key = `${tripId}:${seat}`;
      const existing = this.seatReservations.get(key);
      if (existing && existing.sessionId === sessionId && existing.status === 'HELD') {
        this.seatReservations.delete(key);
      }
    }
  }

  // Confirm booking & convert holds to BOOKED status atomically
  confirmBooking(params: {
    tripId: string;
    seatNumbers: string[];
    sessionId: string;
    passengerName: string;
    passengerPhone: string;
    passengerEmail?: string;
    passengerGender?: 'MALE' | 'FEMALE' | 'OTHER';
    boardingPoint: string;
    droppingPoint: string;
    paymentMethod: 'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD' | 'CASH' | 'AGENT_CREDIT';
    transactionRef?: string;
    bookedVia: 'ONLINE' | 'COUNTER' | 'AGENT';
    counterId?: string;
    agentId?: string;
    userId?: string;
    discount?: number;
  }): { success: boolean; message: string; booking?: Booking } {
    const {
      tripId,
      seatNumbers,
      sessionId,
      passengerName,
      passengerPhone,
      passengerEmail,
      passengerGender,
      boardingPoint,
      droppingPoint,
      paymentMethod,
      transactionRef,
      bookedVia,
      counterId,
      agentId,
      userId,
      discount = 0,
    } = params;

    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) {
      return { success: false, message: 'Trip not found.' };
    }

    const now = Date.now();

    // Verify all seats are validly held by this session
    for (const seat of seatNumbers) {
      const key = `${tripId}:${seat}`;
      const res = this.seatReservations.get(key);
      if (!res) {
        return { success: false, message: `Reservation hold for seat ${seat} has expired. Please select again.` };
      }
      if (res.status === 'BOOKED') {
        return { success: false, message: `Seat ${seat} is already confirmed booked.` };
      }
      if (res.sessionId !== sessionId && res.expiresAt > now) {
        return { success: false, message: `Seat ${seat} is held by a different session.` };
      }
    }

    // Generate unique PNR and booking ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const pnr = `AE-${randomSuffix}`;
    const bookingId = `book-${Date.now()}-${randomSuffix}`;
    const verificationToken = `v-tok-${Math.random().toString(36).substring(2, 10)}${Date.now()}`;

    const subtotal = trip.baseFare * seatNumbers.length;
    const serviceFee = trip.serviceFee * seatNumbers.length;
    const totalAmount = Math.max(0, subtotal + serviceFee - discount);

    const booking: Booking = {
      id: bookingId,
      pnr,
      tenantId: trip.tenantId,
      tripId,
      userId,
      passengerName,
      passengerPhone,
      passengerEmail,
      passengerGender,
      boardingPoint,
      droppingPoint,
      seatNumbers,
      seatCount: seatNumbers.length,
      subtotal,
      discount,
      serviceFee,
      totalAmount,
      paymentMethod,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      bookedVia,
      counterId,
      agentId,
      verificationToken,
      createdAt: new Date().toISOString(),
      trip,
    };

    // Atomic update to BOOKED
    for (const seat of seatNumbers) {
      const key = `${tripId}:${seat}`;
      this.seatReservations.set(key, {
        status: 'BOOKED',
        expiresAt: Date.now() + 86400000 * 365,
        sessionId,
        bookingId,
      });

      // Generate Ticket record
      const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      this.tickets.push({
        id: `tkt-${Date.now()}-${seat}`,
        bookingId,
        ticketNumber,
        seatNumber: seat,
        fare: trip.baseFare,
        status: 'ISSUED',
      });
    }

    this.bookings.unshift(booking);

    // Record payment
    const paymentRef = transactionRef || `TXN-${paymentMethod.slice(0, 3)}-${randomSuffix}`;
    this.payments.push({
      id: `pay-${Date.now()}`,
      tenantId: trip.tenantId,
      bookingId,
      amount: totalAmount,
      currency: 'BDT',
      gateway: paymentMethod === 'CASH' ? 'CASH_COUNTER' : (paymentMethod as any),
      transactionReference: paymentRef,
      status: 'SUCCESS',
      createdAt: booking.createdAt,
    });

    // Record in financial ledger
    this.ledger.push({
      id: `ledg-${Date.now()}`,
      tenantId: trip.tenantId,
      counterId,
      agentId,
      date: booking.createdAt,
      entryType: 'TICKET_SALE',
      amount: totalAmount,
      flow: 'CREDIT',
      description: `Ticket booking PNR ${pnr} via ${bookedVia} (${seatNumbers.join(', ')})`,
      referenceId: pnr,
    });

    // If counter booking, update shift cash balance
    if (counterId && paymentMethod === 'CASH') {
      const activeShift = this.shifts.find(s => s.counterId === counterId && s.status === 'OPEN');
      if (activeShift) {
        activeShift.cashSalesTotal += totalAmount;
        activeShift.expectedClosingCash = activeShift.openingCash + activeShift.cashSalesTotal;
      }
    }

    // If agent booking, calculate agent commission and update balance
    if (agentId) {
      const agent = this.agents.find(a => a.id === agentId);
      if (agent) {
        const commission = Math.round((totalAmount * agent.commissionRatePercent) / 100);
        agent.currentBalance += commission;
        this.ledger.push({
          id: `ledg-comm-${Date.now()}`,
          tenantId: trip.tenantId,
          agentId,
          date: booking.createdAt,
          entryType: 'AGENT_COMMISSION',
          amount: commission,
          flow: 'DEBIT',
          description: `Commission ${agent.commissionRatePercent}% for PNR ${pnr}`,
          referenceId: pnr,
        });
      }
    }

    return { success: true, message: 'Booking confirmed successfully!', booking };
  }

  // Verification lookup by verification token or PNR
  verifyTicket(query: string): { verified: boolean; booking?: Booking; tickets?: Ticket[]; message: string } {
    const clean = query.trim().toUpperCase();
    const booking = this.bookings.find(
      b => b.pnr.toUpperCase() === clean || b.verificationToken === query || b.id === query
    );

    if (!booking) {
      return { verified: false, message: 'Ticket not found or invalid QR code.' };
    }

    const tix = this.tickets.filter(t => t.bookingId === booking.id);
    return {
      verified: booking.bookingStatus === 'CONFIRMED',
      booking,
      tickets: tix,
      message: booking.bookingStatus === 'CONFIRMED' ? 'Valid and verified ticket.' : `Booking is ${booking.bookingStatus}.`,
    };
  }

  // Search trips
  searchTrips(params: {
    origin?: string;
    destination?: string;
    date?: string;
    busType?: string;
  }): Trip[] {
    let results = this.trips.filter(t => t.isPublished);

    if (params.origin) {
      const q = params.origin.toLowerCase();
      results = results.filter(t =>
        t.route?.origin.toLowerCase().includes(q) ||
        t.route?.originBn.includes(params.origin!)
      );
    }

    if (params.destination) {
      const q = params.destination.toLowerCase();
      results = results.filter(t =>
        t.route?.destination.toLowerCase().includes(q) ||
        t.route?.destinationBn.includes(params.destination!)
      );
    }

    if (params.date) {
      results = results.filter(t => t.departureDate === params.date);
    }

    if (params.busType && params.busType !== 'ALL') {
      results = results.filter(t => t.bus?.busType === params.busType);
    }

    return results;
  }
}

// Singleton global DB instance
declare global {
  var __AURORA_DB__: InMemoryDB | undefined;
}

export const db: InMemoryDB = global.__AURORA_DB__ || new InMemoryDB();
if (process.env.NODE_ENV !== 'production') {
  global.__AURORA_DB__ = db;
}
