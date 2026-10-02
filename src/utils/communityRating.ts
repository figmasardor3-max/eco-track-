export interface CommunityMember {
  id: string;
  name: string;
  city: string;
  avatarBg: string;
  avatarText: string;
  footprintTons: number;
  rankPosition: number;
  league: string;
  streakDays: number;
  isUser?: boolean;
}

export interface UserCommunityStats {
  userTons: number;
  communityAverageTons: number;
  communityMedianTons: number;
  totalParticipants: number;
  userRank: number;
  percentile: number; // e.g. 15 means top 15% (lower footprint is better)
  leagueName: string;
  leagueBadgeColor: string;
  leagueBorderColor: string;
  nextLeagueName: string | null;
  tonsToNextLeague: number | null;
  percentDiffFromAverage: number; // negative means better than average
  betterThanPercent: number; // e.g. 85% means cleaner than 85% of users
}

export function computeCommunityStats(userTons: number): UserCommunityStats {
  const totalParticipants = 14850;
  const communityAverageTons = 4.35;
  const communityMedianTons = 3.90;

  // Realistic distribution modeling: log-normal skew around median ~3.9, min ~1.0, max ~18.0
  let percentile: number;
  let userRank: number;
  let leagueName: string;
  let leagueBadgeColor: string;
  let leagueBorderColor: string;
  let nextLeagueName: string | null = null;
  let tonsToNextLeague: number | null = null;

  if (userTons <= 1.8) {
    percentile = Math.max(1, Math.round((userTons / 1.8) * 5));
    leagueName = 'Изумрудная лига (Эко-лидеры)';
    leagueBadgeColor = 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60';
    leagueBorderColor = 'border-emerald-500';
    nextLeagueName = null;
    tonsToNextLeague = null;
  } else if (userTons <= 2.6) {
    percentile = 6 + Math.round(((userTons - 1.8) / 0.8) * 9); // 6% - 15%
    leagueName = 'Платиновая лига';
    leagueBadgeColor = 'bg-teal-950/90 text-teal-300 border-teal-500/60';
    leagueBorderColor = 'border-teal-500';
    nextLeagueName = 'Изумрудную лигу (Топ 5%)';
    tonsToNextLeague = Number((userTons - 1.8).toFixed(2));
  } else if (userTons <= 3.8) {
    percentile = 16 + Math.round(((userTons - 2.6) / 1.2) * 19); // 16% - 35%
    leagueName = 'Золотая лига (Осознанные)';
    leagueBadgeColor = 'bg-amber-950/90 text-amber-300 border-amber-500/60';
    leagueBorderColor = 'border-amber-500';
    nextLeagueName = 'Платиновую лигу (Топ 15%)';
    tonsToNextLeague = Number((userTons - 2.6).toFixed(2));
  } else if (userTons <= 5.2) {
    percentile = 36 + Math.round(((userTons - 3.8) / 1.4) * 24); // 36% - 60%
    leagueName = 'Серебряная лига (Средний темп)';
    leagueBadgeColor = 'bg-stone-800 text-stone-200 border-stone-600';
    leagueBorderColor = 'border-stone-500';
    nextLeagueName = 'Золотую лигу (Топ 35%)';
    tonsToNextLeague = Number((userTons - 3.8).toFixed(2));
  } else if (userTons <= 7.5) {
    percentile = 61 + Math.round(((userTons - 5.2) / 2.3) * 24); // 61% - 85%
    leagueName = 'Бронзовая лига (Активный старт)';
    leagueBadgeColor = 'bg-orange-950/90 text-orange-300 border-orange-500/60';
    leagueBorderColor = 'border-orange-500';
    nextLeagueName = 'Серебряную лигу (Топ 60%)';
    tonsToNextLeague = Number((userTons - 5.2).toFixed(2));
  } else {
    percentile = Math.min(99, 86 + Math.round(((userTons - 7.5) / 5) * 13));
    leagueName = 'Зона ускорения (Стартовый уровень)';
    leagueBadgeColor = 'bg-rose-950/90 text-rose-300 border-rose-500/60';
    leagueBorderColor = 'border-rose-500';
    nextLeagueName = 'Бронзовую лигу (Топ 85%)';
    tonsToNextLeague = Number((userTons - 7.5).toFixed(2));
  }

  userRank = Math.max(1, Math.round((percentile / 100) * totalParticipants));
  const betterThanPercent = Math.max(1, 100 - percentile);

  // Percentage difference from community average
  // negative means cleaner/better
  const percentDiffFromAverage = Math.round(((userTons - communityAverageTons) / communityAverageTons) * 100);

  return {
    userTons,
    communityAverageTons,
    communityMedianTons,
    totalParticipants,
    userRank,
    percentile,
    leagueName,
    leagueBadgeColor,
    leagueBorderColor,
    nextLeagueName,
    tonsToNextLeague,
    percentDiffFromAverage,
    betterThanPercent,
  };
}

export const SAMPLE_COMMUNITY_MEMBERS: Omit<CommunityMember, 'isUser'>[] = [
  {
    id: 'm-1',
    name: 'Анна Мельникова',
    city: 'Санкт-Петербург',
    avatarBg: 'bg-emerald-600',
    avatarText: 'АМ',
    footprintTons: 1.15,
    rankPosition: 1,
    league: 'Изумрудная лига',
    streakDays: 48,
  },
  {
    id: 'm-2',
    name: 'Илья Григорьев',
    city: 'Казань',
    avatarBg: 'bg-teal-600',
    avatarText: 'ИГ',
    footprintTons: 1.34,
    rankPosition: 2,
    league: 'Изумрудная лига',
    streakDays: 35,
  },
  {
    id: 'm-3',
    name: 'София Лебедева',
    city: 'Москва',
    avatarBg: 'bg-emerald-700',
    avatarText: 'СЛ',
    footprintTons: 1.58,
    rankPosition: 3,
    league: 'Изумрудная лига',
    streakDays: 62,
  },
  {
    id: 'm-4',
    name: 'Артем Васильев',
    city: 'Екатеринбург',
    avatarBg: 'bg-teal-700',
    avatarText: 'АВ',
    footprintTons: 2.10,
    rankPosition: 142,
    league: 'Платиновая лига',
    streakDays: 21,
  },
  {
    id: 'm-5',
    name: 'Мария Павлова',
    city: 'Новосибирск',
    avatarBg: 'bg-amber-600',
    avatarText: 'МП',
    footprintTons: 2.95,
    rankPosition: 1250,
    league: 'Золотая лига',
    streakDays: 14,
  },
  {
    id: 'm-6',
    name: 'Денис Ковалев',
    city: 'Нижний Новгород',
    avatarBg: 'bg-stone-600',
    avatarText: 'ДК',
    footprintTons: 4.10,
    rankPosition: 5420,
    league: 'Серебряная лига',
    streakDays: 8,
  },
  {
    id: 'm-7',
    name: 'Виктория Орлова',
    city: 'Самара',
    avatarBg: 'bg-orange-600',
    avatarText: 'ВО',
    footprintTons: 6.20,
    rankPosition: 9800,
    league: 'Бронзовая лига',
    streakDays: 5,
  },
];
