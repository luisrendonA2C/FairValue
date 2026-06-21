'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  Vehicle,
  VehicleStatus,
  Offer,
  Lead,
  Event,
  Dealer,
  User,
  Message,
  LeadStatus,
  EventStatus,
  VerificationStatus,
  DealerApprovalStatus,
} from '@/types';
import { vehicles as initialVehicles } from '@/data/vehicles';
import { offers as initialOffers } from '@/data/offers';
import { leads as initialLeads } from '@/data/leads';
import { events as initialEvents } from '@/data/events';
import { dealers as initialDealers } from '@/data/dealers';
import { users as initialUsers } from '@/data/users';
import { messages as initialMessages } from '@/data/messages';

// ─── Types ──────────────────────────────────────────────────────────────────

interface DataContextValue {
  vehicles: Vehicle[];
  offers: Offer[];
  leads: Lead[];
  events: Event[];
  dealers: Dealer[];
  users: User[];
  messages: Message[];
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  addLead: (lead: Lead) => void;
  addLeads: (leads: Lead[]) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  updateEventStatus: (eventId: string, status: EventStatus) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'submissionDate' | 'views'>) => void;
  updateVerificationStatus: (userId: string, status: VerificationStatus) => void;
  updateDealerStatus: (dealerId: string, status: DealerApprovalStatus) => void;
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  unlockLead: (leadId: string) => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  toggleUserActive: (userId: string) => void;
}

// ─── Event Status Transition Validation ─────────────────────────────────────

const EVENT_STATUS_ORDER: EventStatus[] = [
  'scheduled',
  'active',
  'closed',
  'in_review',
  'finished',
];

function isValidEventStatusTransition(
  current: EventStatus,
  next: EventStatus
): boolean {
  const currentIndex = EVENT_STATUS_ORDER.indexOf(current);
  const nextIndex = EVENT_STATUS_ORDER.indexOf(next);
  // Only allow sequential forward transitions
  return nextIndex === currentIndex + 1;
}

// ─── Context ────────────────────────────────────────────────────────────────

const DataContext = createContext<DataContextValue | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([...initialVehicles]);
  const [offers, setOffers] = useState<Offer[]>([...initialOffers]);
  const [leads, setLeads] = useState<Lead[]>([...initialLeads]);
  const [events, setEvents] = useState<Event[]>([...initialEvents]);
  const [dealers, setDealers] = useState<Dealer[]>([...initialDealers]);
  const [users, setUsers] = useState<User[]>([...initialUsers]);
  const [messages, setMessages] = useState<Message[]>([...initialMessages]);

  const addOffer = useCallback((offer: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...offer,
      id: `offer-${Date.now()}`,
    };
    setOffers((prev) => [...prev, newOffer]);

    // Increment offerCount on the related event
    setEvents((prev) =>
      prev.map((event) =>
        event.id === offer.eventId
          ? { ...event, offerCount: event.offerCount + 1 }
          : event
      )
    );
  }, []);

  const addLead = useCallback((lead: Lead) => {
    setLeads((prev) => {
      if (prev.some((l) => l.id === lead.id)) return prev;
      return [...prev, lead];
    });
  }, []);

  const addLeads = useCallback((newLeads: Lead[]) => {
    setLeads((prev) => {
      const existingIds = new Set(prev.map((l) => l.id));
      const unique = newLeads.filter((l) => !existingIds.has(l.id));
      return [...prev, ...unique];
    });
  }, []);

  const updateLeadStatus = useCallback((leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status } : lead
      )
    );
  }, []);

  const updateEventStatus = useCallback((eventId: string, status: EventStatus) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;
        // Validate sequential transition
        if (!isValidEventStatusTransition(event.status, status)) {
          return event;
        }
        return { ...event, status };
      })
    );
  }, []);

  const addVehicle = useCallback(
    (vehicle: Omit<Vehicle, 'id' | 'submissionDate' | 'views'>) => {
      const newVehicle: Vehicle = {
        ...vehicle,
        id: `vehicle-${Date.now()}`,
        submissionDate: new Date().toISOString(),
        views: 0,
      };
      setVehicles((prev) => [...prev, newVehicle]);
    },
    []
  );

  const updateVerificationStatus = useCallback(
    (userId: string, status: VerificationStatus) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, verificationStatus: status } : user
        )
      );
    },
    []
  );

  const updateDealerStatus = useCallback(
    (dealerId: string, status: DealerApprovalStatus) => {
      setDealers((prev) =>
        prev.map((dealer) =>
          dealer.id === dealerId ? { ...dealer, approvalStatus: status } : dealer
        )
      );
    },
    []
  );

  const updateVehicleStatus = useCallback(
    (vehicleId: string, status: VehicleStatus) => {
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === vehicleId ? { ...vehicle, status } : vehicle
        )
      );
    },
    []
  );

  const unlockLead = useCallback((leadId: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, isUnlocked: true } : lead
      )
    );
  }, []);

  const toggleUserActive = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  }, []);

  const addMessage = useCallback((message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
      ...message,
      id: `message-${Date.now()}`,
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const value: DataContextValue = {
    vehicles,
    offers,
    leads,
    events,
    dealers,
    users,
    messages,
    addOffer,
    addLead,
    addLeads,
    updateLeadStatus,
    updateEventStatus,
    addVehicle,
    updateVerificationStatus,
    updateDealerStatus,
    updateVehicleStatus,
    unlockLead,
    addMessage,
    toggleUserActive,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useMockData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useMockData must be used within a DataProvider');
  }
  return context;
}

export type { DataContextValue };
