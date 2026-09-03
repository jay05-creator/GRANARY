export type FacilityKind = "cold" | "dry" | "packhouse";
export type LotStatus = "stored" | "inbound" | "released";
export type PinKind = "empty" | "full" | "mine";
export type MapFilter = "all" | PinKind;
export type Role = "farmer" | "operator";

export interface Facility {
  id: string;
  name: string;
  operatorId: string;
  operator: string;
  kind: FacilityKind;
  lat: number;
  lng: number;
  address: string;
  city: string;
  capacityTons: number;
  /** Occupancy from other farmers, not including lots in this app. */
  baseOccupiedTons: number;
  ratePerTonDay: number;
  tempRange?: string;
  crops: string[];
  photo: string;
  hours: string;
}

export interface Lot {
  id: string;
  facilityId: string;
  farmerId: string;
  crop: string;
  variety: string;
  tons: number;
  storedAt: string;
  until: string;
  status: LotStatus;
}

export interface Person {
  id: string;
  name: string;
  farm: string;
  village: string;
  district: string;
  crops: string[];
  lat: number;
  lng: number;
  photo: string;
}

export type RequestStatus = "pending" | "approved" | "denied";

export interface FarmerRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerVillage: string;
  farmerContact: string;
  crop: string;
  variety: string;
  tons: number;
  days: number;
  lat: number;
  lng: number;
  requestedAt: string;
  status: RequestStatus;
  allocatedFacilityId?: string;
  allocatedFacilityName?: string;
  operatorId?: string;
  operatorName?: string;
  operatorContact?: string;
  notifiedFarmer?: boolean;
}

export interface Operator {
  id: string;
  name: string;
  contact: string;
  facilityIds: string[];
}

