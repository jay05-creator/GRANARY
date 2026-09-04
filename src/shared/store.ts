import { create } from "zustand";
import type { Facility, FacilityKind, FarmerRequest, Lot, MapFilter, Operator, Person, PinKind, Role } from "./types";
import {
  DEMO_FARMER_ID,
  DEMO_OPERATOR_ID,
  facilities as seedFacilities,
  farmer,
  farmers as seedFarmers,
  farmerRequests as seedFarmerRequests,
  lots as seedLots,
  operators as seedOperators,
  operators,
} from "../server/seed";


export function occupancyOf(facility: Facility, lots: Lot[]): number {
  const extra = lots
    .filter((l) => l.facilityId === facility.id && l.status !== "released")
    .reduce((sum, l) => sum + l.tons, 0);
  return Math.min(facility.capacityTons, facility.baseOccupiedTons + extra);
}

export function pinKindOf(facility: Facility, lots: Lot[], farmerId: string): PinKind {
  const mine = lots.some(
    (l) =>
      l.facilityId === facility.id &&
      l.farmerId === farmerId &&
      l.status !== "released",
  );
  if (mine) return "mine";
  const remaining = facility.capacityTons - occupancyOf(facility, lots);
  if (remaining <= 0.05) return "full";
  return "empty";
}

export interface GranaryState {
  role: Role;
  farmerId: string;
  operatorId: string;
  isAuthenticated: boolean;
  facilities: Facility[];
  farmersList: Person[];
  operatorsList: Operator[];
  lots: Lot[];
  selectedId: string | null;
  mapFilter: MapFilter;
  query: string;
  farmerRequests: FarmerRequest[];
  selectedRequestId: string | null;
  setRole: (role: Role) => void;
  login: (role: Role, id: string) => void;
  logout: () => void;
  registerUser: (input: {
    name: string;
    phone: string;
    role: Role;
    villageOrContact?: string;
    farmOrCompany?: string;
    crops?: string[];
  }) => { role: Role; id: string };
  selectFacility: (id: string | null) => void;
  selectRequest: (id: string | null) => void;
  setMapFilter: (filter: MapFilter) => void;
  setQuery: (q: string) => void;
  addFacility: (input: {
    name: string;
    city: string;
    address: string;
    capacityTons: number;
    ratePerTonDay: number;
    kind: FacilityKind;
    tempRange?: string;
    crops: string[];
    lat?: number;
    lng?: number;
  }) => Facility;
  bookLot: (input: {
    facilityId: string;
    crop: string;
    variety: string;
    tons: number;
    days: number;
  }) => { ok: true; lot: Lot } | { ok: false; error: string };
  releaseLot: (lotId: string) => void;
  createFarmerRequest: (input: {
    crop: string;
    variety: string;
    tons: number;
    days: number;
    lat?: number;
    lng?: number;
  }) => FarmerRequest;
  allocateStorageToFarmer: (
    requestId: string,
    facilityId: string
  ) => { ok: true; lot: Lot } | { ok: false; error: string };
  denyFarmerRequest: (requestId: string) => void;
  dismissFarmerNotification: (requestId: string) => void;
  occupancy: (facility: Facility) => number;
  remaining: (facility: Facility) => number;
  pinKind: (facility: Facility) => PinKind;
  myLots: () => Lot[];
  operatorFacilities: () => Facility[];
  /** Replace catalogue slices from DB (after loadCatalog / seed). */
  hydrateFromDb: (payload: {
    facilities?: Facility[];
    lots?: Lot[];
    farmerRequests?: FarmerRequest[];
    farmersList?: Person[];
    operatorsList?: Operator[];
  }) => void;
  /** Re-fetch catalogue from DB and hydrate the store (call after mutations). */
  refreshFromDb: () => Promise<void>;
  dbHydrated: boolean;
}

export const useGranary = create<GranaryState>((set, get) => ({
  role: "farmer",
  farmerId: DEMO_FARMER_ID,
  operatorId: DEMO_OPERATOR_ID,
  isAuthenticated: false,
  facilities: [],
  farmersList: [],
  operatorsList: [],
  lots: [],
  selectedId: null,
  mapFilter: "all",
  query: "",
  farmerRequests: [],
  selectedRequestId: null,
  dbHydrated: false,
  hydrateFromDb: (payload) =>
    set((state) => ({
      facilities: payload.facilities ?? state.facilities,
      lots: payload.lots ?? state.lots,
      farmerRequests: payload.farmerRequests ?? state.farmerRequests,
      farmersList: payload.farmersList ?? [],
      operatorsList: payload.operatorsList ?? [],
      dbHydrated: true,
    })),
  refreshFromDb: async () => {
    try {
      const { loadCatalog } = await import("@/server/modules/granary");
      const catalog = await loadCatalog();
      get().hydrateFromDb({
        facilities: catalog.facilities,
        lots: catalog.lots,
        farmerRequests: catalog.farmerRequests,
        farmersList: catalog.farmersList,
        operatorsList: catalog.operatorsList,
      });
    } catch (err) {
      console.warn("[granary] refreshFromDb failed:", err);
    }
  },
  selectRequest: (id) => set({ selectedRequestId: id }),
  createFarmerRequest: ({ crop, variety, tons, days, lat, lng }) => {
    const state = get();
    const currentFarmer = state.farmersList.find((f) => f.id === state.farmerId) || farmer;
    const req: FarmerRequest = {
      id: `req-${Date.now()}`,
      farmerId: state.farmerId,
      farmerName: currentFarmer.name,
      farmerVillage: currentFarmer.village,
      farmerContact: "+91 98220 99887",
      crop,
      variety: variety || "Standard",
      tons,
      days,
      lat: lat || currentFarmer.lat,
      lng: lng || currentFarmer.lng,
      requestedAt: new Date().toISOString().slice(0, 10),
      status: "pending",
      ignoredByOperatorIds: [],
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    };
    set({ farmerRequests: [req, ...state.farmerRequests] });
    return req;
  },
  allocateStorageToFarmer: (requestId, facilityId) => {
    const state = get();
    const req = state.farmerRequests.find((r) => r.id === requestId);
    if (!req) return { ok: false, error: "Request not found." };
    const facility = state.facilities.find((f) => f.id === facilityId);
    if (!facility) return { ok: false, error: "Yard facility not found." };
    const op = state.operatorsList.find((o) => o.id === state.operatorId) || operators[0];

    const used = occupancyOf(facility, state.lots);
    if (facility.capacityTons - used < req.tons) {
      return { ok: false, error: "The selected facility does not have enough capacity for this request." };
    }

    const storedAt = new Date();
    const until = new Date(storedAt);
    until.setDate(until.getDate() + req.days);

    const newLot: Lot = {
      id: `lot-${Date.now()}`,
      facilityId,
      farmerId: req.farmerId,
      crop: req.crop,
      variety: req.variety,
      tons: req.tons,
      storedAt: storedAt.toISOString().slice(0, 10),
      until: until.toISOString().slice(0, 10),
      status: "inbound",
    };

    const updatedRequests = state.farmerRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: "approved" as const,
            allocatedFacilityId: facility.id,
            allocatedFacilityName: facility.name,
            operatorId: op.id,
            operatorName: op.name,
            operatorContact: op.contact,
            notifiedFarmer: false,
          }
        : r
    );

    set({
      farmerRequests: updatedRequests,
      lots: [...state.lots, newLot],
      selectedId: facilityId,
      selectedRequestId: null,
    });

    return { ok: true, lot: newLot };
  },
  denyFarmerRequest: (requestId) => {
    const operatorId = get().operatorId;
    set({
      farmerRequests: get().farmerRequests.map((r) =>
        r.id === requestId 
          ? { ...r, ignoredByOperatorIds: [...(r.ignoredByOperatorIds || []), operatorId] } 
          : r
      ),
      selectedRequestId: null,
    });
  },
  dismissFarmerNotification: (requestId) => {
    set({
      farmerRequests: get().farmerRequests.map((r) =>
        r.id === requestId ? { ...r, notifiedFarmer: true } : r
      ),
    });
    // Persist to DB so the modal doesn't reappear on reload
    import("@/server/modules/granary")
      .then(({ dismissFarmerNotificationDb }) =>
        dismissFarmerNotificationDb({ data: { requestId } })
      )
      .catch(() => {});
  },
  setRole: (role) => set({ role }),
  login: (role, id) => {
    if (role === "farmer") {
      set({ role: "farmer", farmerId: id, isAuthenticated: true });
    } else {
      set({ role: "operator", operatorId: id, isAuthenticated: true });
    }
  },
  logout: () => {
    set({ isAuthenticated: false });
  },

  registerUser: (input) => {
    const state = get();
    if (input.role === "farmer") {
      const newFarmer: Person = {
        id: `farmer-${Date.now()}`,
        name: input.name,
        farm: input.farmOrCompany || `${input.name}'s Farm`,
        village: input.villageOrContact || "Niphad",
        district: "Nashik",
        crops: input.crops && input.crops.length > 0 ? input.crops : ["Grapes", "Onion"],
        lat: 20.08,
        lng: 74.11,
        photo: `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(input.name)}&backgroundColor=d7e4d4`,
      };
      set({
        role: "farmer",
        farmerId: newFarmer.id,
        isAuthenticated: true,
        farmersList: [...state.farmersList, newFarmer],
      });
      return { role: "farmer", id: newFarmer.id };
    } else {
      const newOp: Operator = {
        id: `op-${Date.now()}`,
        name: input.farmOrCompany || `${input.name} Warehousing`,
        contact: input.phone || `${input.name}@granary-storage.in`,
        facilityIds: [],
      };
      set({
        role: "operator",
        operatorId: newOp.id,
        isAuthenticated: true,
        operatorsList: [...state.operatorsList, newOp],
      });
      return { role: "operator", id: newOp.id };
    }
  },
  selectFacility: (id) => set({ selectedId: id }),
  setMapFilter: (mapFilter) => set({ mapFilter }),
  setQuery: (query) => set({ query }),
  occupancy: (facility) => occupancyOf(facility, get().lots),
  remaining: (facility) =>
    Math.max(0, facility.capacityTons - occupancyOf(facility, get().lots)),
  pinKind: (facility) => pinKindOf(facility, get().lots, get().farmerId),
  myLots: () =>
    get().lots.filter(
      (l) => l.farmerId === get().farmerId && l.status !== "released",
    ),
  operatorFacilities: () => {
    const state = get();
    const op = state.operatorsList.find((o) => o.id === state.operatorId);
    if (!op) return [];
    return state.facilities.filter((f) => op.facilityIds.includes(f.id));
  },
  addFacility: (input) => {
    const state = get();
    const currentOp = state.operatorsList.find((o) => o.id === state.operatorId);
    const opName = currentOp ? currentOp.name : "Yard Operator";
    
    // Default coordinates near Nashik belt if not specified
    const lat = input.lat || (20.0 + (Math.random() - 0.5) * 0.3);
    const lng = input.lng || (73.9 + (Math.random() - 0.5) * 0.3);
    
    const newFacility: Facility = {
      id: `fac-${Date.now()}`,
      name: input.name,
      operatorId: state.operatorId,
      operator: opName,
      kind: input.kind,
      lat: Number(lat.toFixed(4)),
      lng: Number(lng.toFixed(4)),
      address: input.address,
      city: input.city,
      capacityTons: input.capacityTons,
      baseOccupiedTons: 0,
      ratePerTonDay: input.ratePerTonDay,
      tempRange: input.tempRange || (input.kind === "cold" ? "0 to 4 C" : undefined),
      crops: input.crops.length > 0 ? input.crops : ["Grapes", "Onion"],
      photo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=75",
      hours: "Open 6:00 to 22:00",
    };

    const updatedFacilities = [...state.facilities, newFacility];
    const updatedOperators = state.operatorsList.map((o) =>
      o.id === state.operatorId
        ? { ...o, facilityIds: [...o.facilityIds, newFacility.id] }
        : o,
    );

    set({
      facilities: updatedFacilities,
      operatorsList: updatedOperators,
      selectedId: newFacility.id,
    });

    return newFacility;
  },
  bookLot: ({ facilityId, crop, variety, tons, days }) => {
    const state = get();
    const facility = state.facilities.find((f) => f.id === facilityId);
    if (!facility) return { ok: false, error: "Yard not found." };
    const remaining = Math.max(
      0,
      facility.capacityTons - occupancyOf(facility, state.lots),
    );
    if (tons <= 0) return { ok: false, error: "Enter a weight above zero." };
    if (tons > remaining + 0.001) {
      return {
        ok: false,
        error: `Only ${remaining.toFixed(1)} t left at this yard.`,
      };
    }
    const storedAt = new Date();
    const until = new Date(storedAt);
    until.setDate(until.getDate() + days);
    const lot: Lot = {
      id: `lot-${Date.now()}`,
      facilityId,
      farmerId: state.farmerId,
      crop,
      variety,
      tons,
      storedAt: storedAt.toISOString().slice(0, 10),
      until: until.toISOString().slice(0, 10),
      status: "stored",
    };
    set({ lots: [...state.lots, lot], selectedId: facilityId });
    return { ok: true, lot };
  },
  releaseLot: (lotId) =>
    set({
      lots: get().lots.map((l) =>
        l.id === lotId ? { ...l, status: "released" as const } : l,
      ),
    }),
}));

export { farmer, operators };

export function pinLabel(kind: PinKind): string {
  if (kind === "mine") return "Your harvest";
  if (kind === "full") return "Full";
  return "Available";
}

export function pinColor(kind: PinKind): string {
  if (kind === "mine") return "#c8922a";
  if (kind === "full") return "#c45c3e";
  return "#3f7a52";
}
