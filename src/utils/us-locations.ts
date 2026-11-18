import locations from "@/data/us-locations.json";

/** Companies are US-only, so the country is fixed. */
export const COUNTRY = "United States";

const BY_STATE: Record<string, string[]> = locations;

/** All US states (plus DC), A to Z. */
export const US_STATES: string[] = Object.keys(BY_STATE);

/** Cities of one state, A to Z. Empty until a state is chosen. */
export const citiesOf = (state: string): string[] => BY_STATE[state] ?? [];
