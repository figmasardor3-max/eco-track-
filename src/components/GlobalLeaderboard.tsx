import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Medal, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  ArrowUpRight,
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { computeCommunityStats, SAMPLE_COMMUNITY_MEMBERS, CommunityMember } from '../utils/communityRating';

interface GlobalLeaderboardProps {
  userTons: number;
  onGoToTips?: () => void;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  userTons,
  onGoToTips,
}) => {
  const stats = computeCommunityStats(userTons);
  const [activeFilter, setActiveFilter] = useState<'all' | 'leaders' | 'near_me'>('all');
  const [showFullTable, setShowFullTable] = useState<boolean>(false);

  // Construct community list including the user
  const userMember: CommunityMember = {
    id: 'user-current',
    name: 'Вы (Текущий след)',
    city: 'Ваш регион',
    avatarBg: 'bg-emerald-800 ring-2 ring-emerald-400',
    avatarText: 'ВЫ',
    footprintTons: userTons,
    rankPosition: stats.userRank,
    league: stats.leagueName.split(' ')[0] + ' ' + stats.leagueName.split(' ')[1],
    streakDays: 7,
    isUser: true,
  };

  const combinedList: CommunityMember[] = [
    ...SAMPLE_COMMUNITY_MEMBERS,
    userMember,
  ].sort((a, b) => a.footprintTons - b.footprintTons);

  // Recalculate relative order index
  const displayList = combinedList.filter((item) => {
    if (activeFilter === 'leaders') return item.footprintTons <= 2.2 || item.isUser;
    if (activeFilter === 'near_me') {
      return Math.abs(item.footprintTons - userTons) < 2.0 || item.isUser;
    }
    return true;
  });

  const visibleList = showFullTable ? displayList : displayList.slice(0, 6);

  // Scale tiers for visualization
  const tiers = [
    { name: 'Изумруд', range: '<1.8 т', pct: 'Топ 5%', bg: 'bg-emerald-500' },
    { name: 'Платина', range: '1.8–2.6 т', pct: 'Топ 15%', bg: 'bg-teal-500' },
    { name: 'Золото', range: '2.6–3.8 т', pct: 'Топ 35%', bg: 'bg-amber-500' },
    { name: 'Серебро', range: '3.8–5.2 т', pct: 'Топ 60%', bg: 'bg-stone-400' },
    { name: 'Бронза', range: '>5.2 т', pct: 'Топ 85%+', bg: 'bg-orange-500' },
  ];

  // Visual marker position: userTons mapped onto 0 - 8 scale
  const markerPercent = Math.min(96, Math.max(4, Math.round(((userTons - 1.0) / (8.0 - 1.0)) * 100)));

  return (
    <div className="bg-[#121620] rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Глобальный рейтинг сообщества</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk']">
            Ваша позиция среди других пользователей
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
            Сравнение вашего текущего углеродного следа с более чем <strong>{stats.totalParticipants.toLocaleString()}</strong> участниками приложения.
          </p>
        </div>

        {/* User Rank Card */}
        <div className="flex items-center gap-3 bg-[#18202c] p-4 rounded-2xl border border-stone-700 shrink-0 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-stone-950 flex items-center justify-center font-black text-lg shadow-sm">
            #{stats.userRank}
          </div>
          <div>
            <div className="text-[11px] text-stone-400 uppercase font-semibold">Ваш глобальный ранг</div>
            <div className="text-sm font-bold text-white">
              Топ <span className="text-emerald-400 font-extrabold">{stats.percentile}%</span> сообщества
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              Чище, чем {stats.betterThanPercent}% участников
            </div>
          </div>
        </div>
      </div>

      {/* Visual Competitive Scale Gauge */}
      <div className="bg-[#18202c] p-5 rounded-3xl border border-stone-700/80 space-y-3 shadow-inner">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-200 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-400" />
            Шкала распределения пользователей по лигам:
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${stats.leagueBadgeColor}`}>
            {stats.leagueName}
          </span>
        </div>

        {/* Progress track */}
        <div className="relative pt-6 pb-2">
          {/* Floating Marker for User */}
          <motion.div 
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none"
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: `${markerPercent}%`, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="text-[10px] font-extrabold bg-stone-950 text-emerald-300 px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-emerald-500/60">
              Вы: {userTons} т (#{stats.userRank})
            </span>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-stone-950"></div>
          </motion.div>

          {/* Color segment bar */}
          <div className="h-4 w-full rounded-full flex overflow-hidden p-0.5 bg-[#0e121a] border border-stone-700 shadow-inner">
            <div className="h-full bg-emerald-500 w-[15%]" title="Изумрудная лига (до 1.8 т)"></div>
            <div className="h-full bg-teal-500 w-[20%]" title="Платиновая лига (1.8-2.6 т)"></div>
            <div className="h-full bg-amber-500 w-[25%]" title="Золотая лига (2.6-3.8 т)"></div>
            <div className="h-full bg-stone-500 w-[20%]" title="Серебряная лига (3.8-5.2 т)"></div>
            <div className="h-full bg-orange-500 w-[20%]" title="Бронзовая лига (>5.2 т)"></div>
          </div>

          {/* Labels under track */}
          <div className="grid grid-cols-5 text-[10px] sm:text-xs text-stone-400 pt-2 font-medium">
            <div className="text-left text-emerald-400 font-bold">&lt; 1.8 т (Лидеры)</div>
            <div className="text-center text-teal-400 font-semibold">2.2 т</div>
            <div className="text-center text-amber-400 font-semibold">3.8 т</div>
            <div className="text-center text-stone-400">5.2 т</div>
            <div className="text-right text-orange-400 font-semibold">&gt; 7.0 т</div>
          </div>
        </div>

        {/* Motivational comparison note */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-stone-700/60">
          <div className="text-stone-300">
            Средний показатель пользователя EcoTrack: <strong className="text-white">{stats.communityAverageTons} т CO₂e</strong>
            {stats.percentDiffFromAverage <= 0 ? (
              <span className="text-emerald-400 font-bold ml-1.5">
                (Ваш результат на {Math.abs(stats.percentDiffFromAverage)}% экологичнее среднего!)
              </span>
            ) : (
              <span className="text-amber-400 font-semibold ml-1.5">
                (На {stats.percentDiffFromAverage}% выше среднего по приложению)
              </span>
            )}
          </div>

          {stats.nextLeagueName && stats.tonsToNextLeague && (
            <div className="text-emerald-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                До перехода в {stats.nextLeagueName}: <strong className="text-white">-{stats.tonsToNextLeague} т CO₂</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs for Leaderboard Table */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1 bg-[#18202c] p-1 rounded-xl border border-stone-700/80">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-emerald-400 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Все участники
          </button>
          <button
            onClick={() => setActiveFilter('leaders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeFilter === 'leaders'
                ? 'bg-emerald-400 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Топ лидеры
          </button>
          <button
            onClick={() => setActiveFilter('near_me')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeFilter === 'near_me'
                ? 'bg-emerald-400 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Рядом со мной
          </button>
        </div>

        {onGoToTips && (
          <button
            onClick={onGoToTips}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Как подняться выше?</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-2">
        {visibleList.map((member, idx) => {
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(0.4, idx * 0.05) }}
              className={`p-3 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                member.isUser
                  ? 'bg-[#0e1d18] border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-md'
                  : 'bg-[#18202c] border-stone-700/70 hover:bg-[#202938]'
              }`}
            >
              {/* Left rank & name */}
              <div className="flex items-center gap-3">
                <div className="w-7 text-center font-mono font-bold text-xs sm:text-sm text-stone-400">
                  {member.isUser ? (
                    <span className="text-emerald-400 font-extrabold">#{member.rankPosition}</span>
                  ) : (
                    `#${member.rankPosition}`
                  )}
                </div>

                <div className={`w-9 h-9 rounded-xl ${member.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                  {member.avatarText}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs sm:text-sm font-bold ${member.isUser ? 'text-emerald-300 font-black' : 'text-white'}`}>
                      {member.name}
                    </span>
                    {member.isUser && (
                      <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-emerald-500 text-stone-950">
                        ЭТО ВЫ
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center gap-2">
                    <span>{member.city}</span>
                    <span>•</span>
                    <span className="text-stone-500">{member.league}</span>
                  </div>
                </div>
              </div>

              {/* Right footprint */}
              <div className="text-right shrink-0">
                <div className={`text-sm sm:text-base font-extrabold font-['Space_Grotesk'] ${member.isUser ? 'text-emerald-400' : 'text-white'}`}>
                  {member.footprintTons.toFixed(2)} <span className="text-xs font-normal text-stone-400">т CO₂</span>
                </div>
                <div className="text-[10px] text-stone-400 flex items-center justify-end gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>{member.streakDays} дн. серии</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show more toggle */}
      {displayList.length > 6 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowFullTable(!showFullTable)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white px-4 py-2 rounded-xl bg-[#18202c] hover:bg-[#202938] border border-stone-700 transition cursor-pointer"
          >
            {showFullTable ? (
              <>
                <span>Свернуть список</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Показать еще участников ({displayList.length})</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
