export type FuelType = 'none' | 'petrol' | 'diesel' | 'hybrid' | 'ev';
export type HomeType = 'apartment_small' | 'apartment_large' | 'house_medium' | 'house_large';
export type HeatingSource = 'gas' | 'electric' | 'district' | 'biomass_clean';
export type DietType = 'meat_heavy' | 'meat_medium' | 'pescatarian' | 'vegetarian' | 'vegan';
export type WasteLevel = 'low' | 'average' | 'high';
export type ShoppingHabits = 'minimal' | 'average' | 'heavy';
export type RecyclingRate = 'none' | 'basic' | 'thorough';
export type DeviceUpgradeFrequency = 'yearly' | 'two_three_years' | 'five_plus_years';

export interface FootprintInput {
  // Transport
  carFuel: FuelType;
  carKmPerWeek: number;
  publicTransitHoursPerWeek: number;
  flightsShortPerYear: number;
  flightsLongPerYear: number;

  // Housing & Energy
  householdMembers: number;
  homeType: HomeType;
  heatingSource: HeatingSource;
  greenElectricityPercent: number;
  monthlyKwh: number;

  // Diet & Food
  dietType: DietType;
  localFoodPercent: number;
  foodWasteLevel: WasteLevel;

  // Consumption & Goods
  shoppingHabits: ShoppingHabits;
  recyclingRate: RecyclingRate;
  deviceUpgradeFrequency: DeviceUpgradeFrequency;
}

export interface EmissionBreakdown {
  transport: number; // in kg CO2e / year
  housing: number;
  diet: number;
  consumption: number;
  total: number;
  totalTons: number;
  treesNeeded: number;
  carEquivalentKm: number;
}

export interface EmissionRank {
  title: string;
  badge: string;
  colorClass: string;
  bgColorClass: string;
  borderColorClass: string;
  description: string;
}

export type TipCategory = 'all' | 'transport' | 'housing' | 'diet' | 'consumption';
export type DifficultyLevel = 'easy' | 'medium' | 'advanced';

export interface EcoTip {
  id: string;
  category: 'transport' | 'housing' | 'diet' | 'consumption';
  title: string;
  description: string;
  co2SavingsKg: number;
  financialSavingsRub: string;
  difficulty: DifficultyLevel;
  iconName: string;
  actionTag: string;
}

export interface Habit {
  id: string;
  category: 'transport' | 'housing' | 'diet' | 'consumption';
  title: string;
  description: string;
  impactKgPerAction: number;
  iconName: string;
  completedDates: string[]; // YYYY-MM-DD
  createdDate: string;
}

export type ActiveTab = 'calculator' | 'dashboard' | 'tips' | 'habits';
