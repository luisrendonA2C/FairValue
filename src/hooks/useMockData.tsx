'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  Vehicle,
  VehicleStatus,
  Offer,
  Lead,
  LeadStatus,
  Event,
  EventStatus,
  Dealer,
  DealerApprovalStatus,
  User,
  VerificationStatus,
  Message,
} from '@/types';
import {
  vehicles as initialVehicles,
  offers as initialOffers,
  leads as initialLeads,
  events as initialEvents,
  dealers as initialDealers,
  users as initialUsers,
  messages as initialMessages,
} from '@/data';

// ─── Types ──────────────────────────────────────────────────────────────────

interface DataContextValue {
  vehicles: Vehicle[];
  offers: Offer[];
  leads: Lead[];
  events: Event[];
  dealers: Dealer[];
  users: User[];
  messages: Message[];
  // Mutations
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  addLead: (lead: Lead) => void;
  addLeads: (leads: Lead[]) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  updateEventStatus: (eventId: string, status: EventStatus) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'views' | 'submissionDate'>) => void;
  updateVerificationStatus: (userId: string, status: VerificationStatus) => void;
  updateDealerStatus: (dealerId: string, status: DealerApprovalStatus) => void;
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  unlockLead: (leadId: string) => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
}

// ─── Context ────────────────────────────────────────────────────────────────

const DataContext = createContext<DataContextValue | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [dealers, setDealers] = useState<Dealer[]>(initialDealers);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const addOffer = useCallback((offer: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...offer,
      id: `offer-${Date.now()}`,
    };
    setOffers((prev) => [...prev, newOffer]);
  }, []);

  const addLead = useCallback((lead: Lead) => {
    setLeads((prev) => {
      // Avoid duplicates by id
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
      prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
    );
  }, []);

  const updateEventStatus = useCallback((eventId: string, status: EventStatus) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, status } : event))
    );
  }, []);

  const addVehicle = useCallback(
    (vehicle: Omit<Vehicle, 'id' | 'views' | 'submissionDate'>) => {
      const newVehicle: Vehicle = {
        ...vehicle,
        id: `vehicle-${Date.now()}`,
        views: 0,
        submissionDate: new Date().toISOString(),
        status: 'pending_approval' as VehicleStatus,
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

  const addMessage = useCallback((message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
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
