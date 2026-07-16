export interface ITechnicianProfile {
  bio?: string;
  experience: number;
  hourlyRate: number;
  location: string;
}

export interface IUpdateAvailability {
  availability: string;
  isAvailable?: boolean;
}

export interface IUpdateTechnicianProfile {
  bio?: string;
  experience?: number;
  hourlyRate?: number;
  location?: string;
  isAvailable?: boolean;
}
