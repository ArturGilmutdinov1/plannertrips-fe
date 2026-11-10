export interface CountryOption {
  label: string;
  value: string;
}

export interface Trip {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  country: CountryOption | null;
  childTripIds: string[];
  createdAt: string;
}

export interface CreateTripPayload {
  name: string;
  country: CountryOption | null;
}

export type AddChildTripPayload =
  | { childTripId: string }
  | CreateTripPayload;
