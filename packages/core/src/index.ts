export const GET_SUN_INFO = () => "Solar data from Core";
export const version = "1.0.0";

// Export shared schemas and types
export * from "./schemas/sun.schema";

// Export physics constants and logic
export * from "./physics/solar-angles";
export * from "./physics/sun";

// Export utility functions
export * from "./utils/math";
