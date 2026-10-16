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
  createdAt: string;
}

export interface CreateTripPayload {
  name: string;
  country: CountryOption | null;
}
