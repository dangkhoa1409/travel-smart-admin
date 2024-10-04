/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Destination {
  name: string;
  lat: number;
  lng: number;
  description?: string;
  imageUrl?: string; 
  address?: string; 
  reviews?: string[]; 
}

export interface DistanceData {
  distance: number;
  travelTime: any;
}

export interface Day {
  date: string;
  destinations: Destination[];
}

export interface DestinationsState {
  days: Day[];
  distances: Record<string, Record<number, DistanceData>>;
  destext: string;
  selectedCityCoordinates: { lat: number; lng: number } | null;
  selectedDay: string | null;
}

export interface AddDestinationPayload {
  date: string;
  destination: Destination;
}

export interface RemoveDestinationPayload {
  date: string;
  destination: Destination;
}
export interface CityType {
  id: string;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  latitude: string;
  longitude: string;
}
