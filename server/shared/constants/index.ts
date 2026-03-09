export const APP_NAME = "futsal-game-gb";

export const TOURNAMENT_FORMATS = [
  { value: "single_elimination", label: "Single elimination" },
  { value: "round_robin", label: "Round robin" },
  { value: "double_elimination", label: "Double elimination" },
  { value: "swiss", label: "Swiss" },
  { value: "multistage", label: "Multistage" },
] as const;

export const STAGE_FORMATS = [
  { value: "knockout", label: "Knockout Bracket" },
  { value: "round_robin_groups", label: "Round-Robin Groups" },
] as const;
