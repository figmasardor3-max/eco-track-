import { FootprintInput, EmissionBreakdown, EmissionRank } from '../types';

export const EMISSION_FACTORS = {
  carFuelPerKm: {
    none: 0,
    petrol: 0.192, // kg CO2e per km
    diesel: 0.171,
    hybrid: 0.108,
    ev: 0.042, // average grid-mix lifecycle
  },
  publicTransitPerHour: 0.85, // ~15-20km mixed bus/metro @ ~0.05kg/pass-km
  flightShort: 230, // ~1000-1500km flight including radiative forcing index
  flightLong: 1150, // ~6000-8000km flight

  // Electricity
  gridKwhCo2: 0.385, // kg CO2 per kWh average grid
  heatingCo2Annual: {
    apartment_small: { gas: 700, electric: 900, district: 600, biomass_clean: 150 },
    apartment_large: { gas: 1200, electric: 1600, district: 1000, biomass_clean: 250 },
    house_medium: { gas: 2200, electric: 2800, district: 1900, biomass_clean: 450 },
    house_large: { gas: 3600, electric: 4400, district: 3100, biomass_clean: 750 },
  },

  // Diet annual kg CO2e
  dietBase: {
    meat_heavy: 3200,
    meat_medium: 2150,
    pescatarian: 1620,
    vegetarian: 1350,
    vegan: 920,
  },
  foodWasteMultiplier: {
    low: 0.88,
    average: 1.0,
    high: 1.25,
  },

  // Consumption
  shoppingBase: {
    minimal: 600,
    average: 1350,
    heavy: 2600,
  },
  recyclingDiscount: {
    none: 1.0,
    basic: 0.88,
    thorough: 0.76,
  },
  deviceUpgradeCo2Annual: {
    yearly: 350,
    two_three_years: 120,
    five_plus_years: 50,
  },
};

export function calculateEmissions(input: FootprintInput): EmissionBreakdown {
  // 1. Transport
  const carKmAnnual = input.carKmPerWeek * 52;
  const carEmissions = carKmAnnual * EMISSION_FACTORS.carFuelPerKm[input.carFuel];
  const transitEmissions = input.publicTransitHoursPerWeek * 52 * EMISSION_FACTORS.publicTransitPerHour;
  const flightEmissions = (input.flightsShortPerYear * EMISSION_FACTORS.flightShort) + 
                          (input.flightsLongPerYear * EMISSION_FACTORS.flightLong);
  const totalTransport = carEmissions + transitEmissions + flightEmissions;

  // 2. Housing
  const members = Math.max(1, input.householdMembers);
  const effectiveKwh = input.monthlyKwh * 12;
  // Green electricity factor
  const greenFactor = 1 - (input.greenElectricityPercent / 100) * 0.85; // 85% reduction for green electricity
  const electricityEmissions = (effectiveKwh * EMISSION_FACTORS.gridKwhCo2 * greenFactor) / members;
  const heatingBase = EMISSION_FACTORS.heatingCo2Annual[input.homeType][input.heatingSource];
  const heatingEmissions = heatingBase / members;
  const totalHousing = electricityEmissions + heatingEmissions;

  // 3. Diet
  const dietBase = EMISSION_FACTORS.dietBase[input.dietType];
  const wasteMultiplier = EMISSION_FACTORS.foodWasteMultiplier[input.foodWasteLevel];
  // Local food reduction: up to 10% reduction if 100% local
  const localFoodFactor = 1 - (input.localFoodPercent / 100) * 0.10;
  const totalDiet = dietBase * wasteMultiplier * localFoodFactor;

  // 4. Consumption
  const shoppingBase = EMISSION_FACTORS.shoppingBase[input.shoppingHabits];
  const recyclingMultiplier = EMISSION_FACTORS.recyclingDiscount[input.recyclingRate];
  const deviceEmissions = EMISSION_FACTORS.deviceUpgradeCo2Annual[input.deviceUpgradeFrequency];
  const totalConsumption = (shoppingBase * recyclingMultiplier) + deviceEmissions;

  const total = Math.round(totalTransport + totalHousing + totalDiet + totalConsumption);
  const totalTons = Number((total / 1000).toFixed(2));
  // 1 mature tree absorbs ~22 kg CO2 per year
  const treesNeeded = Math.ceil(total / 22);
  // 1 km by typical car produces ~0.18 kg CO2
  const carEquivalentKm = Math.round(total / 0.18);

  return {
    transport: Math.round(totalTransport),
    housing: Math.round(totalHousing),
    diet: Math.round(totalDiet),
    consumption: Math.round(totalConsumption),
    total,
    totalTons,
    treesNeeded,
    carEquivalentKm,
  };
}

export function getEmissionRank(totalTons: number): EmissionRank {
  if (totalTons <= 2.2) {
    return {
      title: 'Климатический хранитель',
      badge: 'Парижский стандарт',
      colorClass: 'text-emerald-300',
      bgColorClass: 'bg-emerald-950/80',
      borderColorClass: 'border-emerald-500/60',
      description: 'Ваш след находится в рамках целевых показателей Парижского соглашения (≤ 2.0 т)! Вы ведете исключительно осознанный образ жизни.',
    };
  }
  if (totalTons <= 4.8) {
    return {
      title: 'Устойчивый горожанин',
      badge: 'Ниже среднего в мире',
      colorClass: 'text-teal-300',
      bgColorClass: 'bg-teal-950/80',
      borderColorClass: 'border-teal-500/60',
      description: 'Ваш след ниже среднемирового уровня (~4.8 т). Несколько точечных эко-привычек помогут приблизиться к углеродной нейтральности.',
    };
  }
  if (totalTons <= 8.5) {
    return {
      title: 'Умеренный потребитель',
      badge: 'Средний европеец',
      colorClass: 'text-amber-300',
      bgColorClass: 'bg-amber-950/80',
      borderColorClass: 'border-amber-500/60',
      description: 'Ваш показатель типичен для развитых городских зон. Основные резервы сокращения кроются в транспорте, перелетах и отоплении.',
    };
  }
  return {
    title: 'Высокий углеродный профиль',
    badge: 'Требует внимания',
    colorClass: 'text-rose-300',
    bgColorClass: 'bg-rose-950/80',
    borderColorClass: 'border-rose-500/60',
    description: 'Ваш углеродный след существенно превышает целевые ориентиры. Внедрение даже базовых рекомендаций сэкономит тонны CO₂ в год!',
  };
}
