export interface StationRouteData {
  name: string;
  station: string; 
  timeInMinutes: number;
};

export interface Train {
  name: string;
  capacityInKg: number;
  startingStation: string;
};

export interface Package {
  name: string;
  weightInKg: number;
  startingStation: string;
  destinationStation: string;
};

export interface ShortestPath {
  path: string[];
  totalTime: number;
}

export type ResultPath = {
  summary: string;
  W: number;
  T: string;
  N1: string;
  P1: string[];
  N2: string;
  P2: string[];
}

export type SolutionResult = Record<string, {
  path: ResultPath[],
  totalTime: number
}>