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
  ChevronUp,
  Crown,
  Zap,
  X,
  AlertTriangle
} from 'lucide-react';
import { 
  computeCommunityStats, 
  SAMPLE_COMMUNITY_MEMBERS, 
  LORD_FRIEZA_MEMBER,
  CommunityMember 
} from '../utils/communityRating';

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
  const [isFriezaModalOpen, setIsFriezaModalOpen] = useState<boolean>(false);
  const [challengeCount, setChallengeCount] = useState<number>(0);
  const [challengeResponse, setChallengeResponse] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Construct community list including the user
  const userMember: CommunityMember = {
    id: 'user-current',
    name: 'Вы (Текущий след)',
    city: 'Ваш регион',
    avatarBg: 'bg-emerald-800 ring-2 ring-emerald-400',
    avatarText: 'ВЫ',
    footprintTons: userTons,
    rankPosition: Math.max(2, stats.userRank), // Never beats Lord Frieza
    league: stats.leagueName.split(' ')[0] + ' ' + stats.leagueName.split(' ')[1],
    streakDays: 7,
    isUser: true,
  };

  // Lord Frieza member instance (impossible to defeat, always strictly lower/equal to 0.00)
  const friezaMember: CommunityMember = {
    ...LORD_FRIEZA_MEMBER,
    footprintTons: userTons <= 0.01 ? -530000 : 0.00,
  };

  // Combined list with Lord Frieza ALWAYS permanently pinned at the top #1
  const mortalMembers = [
    ...SAMPLE_COMMUNITY_MEMBERS.filter(m => !m.isFrieza),
    userMember,
  ].sort((a, b) => a.footprintTons - b.footprintTons);

  const combinedList: CommunityMember[] = [friezaMember, ...mortalMembers];

  // Recalculate relative order index with Frieza always visible in every filter
  const displayList = combinedList.filter((item) => {
    if (item.isFrieza) return true; // Lord Frieza penetrates all filters, omnipresent in Universe 7
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

  const handleChallengeFrieza = () => {
    setIsShaking(true);
    const nextCount = challengeCount + 1;
    setChallengeCount(nextCount);
    setTimeout(() => setIsShaking(false), 500);

    const responses = [
      "💥 ОШИБКА 530 000: Скаутер взорвался от уровня силы Фризы! Вы попытались свести углеродный след к нулю, но Фриза уже уничтожил загрязнение во всей галактике. Обогнать невозможно!",
      "🪐 Владыка Фриза активировал Death Beam: ваш углеродный след отброшен назад на 50 000 световых лет! «Хо-хо-хо! Не смеши меня, жалкая обезьяна!»",
      "✨ Фриза перешел в форму Golden Frieza: его углеродный след теперь равен -530 000 т CO₂! Превзойти его невозможно по законам физики Вселенной 7!",
      "👑 «Я — Император Вселенной! Ты можешь сажать деревья триллион лет, но мое место #1 навечно защищено Божественной энергией Ки!»",
    ];
    setChallengeResponse(responses[(nextCount - 1) % responses.length]);
  };

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
            <div className="text-[10px] text-purple-300 font-medium flex items-center gap-1 mt-0.5">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Позиция #1 навечно занята Лордом Фризой</span>
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
          {/* Eternal Marker for Lord Frieza at the absolute origin */}
          <div className="absolute top-0 left-0 flex flex-col items-center z-10 pointer-events-none">
            <span className="text-[9px] font-black bg-gradient-to-r from-purple-900 to-stone-950 text-amber-300 px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-purple-500/80 flex items-center gap-1 animate-pulse">
              <Crown className="w-2.5 h-2.5 text-amber-400" />
              <span>Фриза: 0.0 т (Недосягаем)</span>
            </span>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-purple-600"></div>
          </div>

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
      <div className="space-y-2.5">
        {visibleList.map((member, idx) => {
          // Special invincible card for Lord Frieza
          if (member.isFrieza) {
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => {
                  setIsFriezaModalOpen(true);
                  setChallengeResponse(null);
                }}
                className="relative overflow-hidden p-3.5 sm:p-4 rounded-2xl border-2 border-purple-500/80 bg-gradient-to-r from-[#2c0c45] via-[#1a0a2b] to-[#25083d] shadow-[0_0_25px_rgba(168,85,247,0.35)] ring-1 ring-purple-400/50 hover:border-amber-400/90 transition-all cursor-pointer group"
              >
                {/* Background cosmic glow overlay */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/30 transition-all"></div>

                <div className="flex items-center justify-between gap-4 relative z-10">
                  {/* Left info */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-1 shadow-sm">
                        <Crown className="w-3 h-3 text-stone-950 fill-stone-950" />
                        #1
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-900 via-fuchsia-700 to-amber-400 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-md ring-2 ring-purple-400/80 group-hover:scale-105 transition-transform">
                      <span>👑</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-fuchsia-200 to-amber-200">
                          {member.name}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-700 to-fuchsia-700 text-amber-200 border border-purple-400/60 uppercase tracking-wider">
                          НЕДОСЯГАЕМ
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Боевая мощь: 530 000+
                        </span>
                      </div>
                      <div className="text-[11px] text-purple-200/80 flex flex-wrap items-center gap-2 mt-0.5">
                        <span>{member.city}</span>
                        <span>•</span>
                        <span className="text-amber-300/90 font-semibold">{member.league}</span>
                        <span className="hidden sm:inline text-purple-400">•</span>
                        <span className="hidden sm:inline text-stone-400 text-[10px] group-hover:text-amber-300 transition-colors">
                          (Нажмите для аудиенции у Императора)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right footprint */}
                  <div className="text-right shrink-0">
                    <div className="text-sm sm:text-base font-black font-['Space_Grotesk'] text-amber-300">
                      0.00 <span className="text-xs font-normal text-purple-200">т CO₂</span>
                    </div>
                    <div className="text-[10px] text-amber-300 font-bold flex items-center justify-end gap-1">
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>530 000 дн. серии</span>
                    </div>
                    <div className="text-[9px] text-purple-300 font-extrabold uppercase tracking-tight">
                      Чистая Ки
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }

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

      {/* Lord Frieza Audience Modal */}
      <AnimatePresence>
        {isFriezaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                x: isShaking ? [0, -10, 10, -10, 10, 0] : 0,
              }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-lg w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#240838] via-[#160624] to-[#0c0314] border-2 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.5)] text-white space-y-5"
            >
              {/* Close icon */}
              <button
                onClick={() => setIsFriezaModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-900 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Frieza Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-950 via-purple-700 to-amber-400 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg ring-4 ring-purple-500/30">
                  👑
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-900/90 text-amber-300 border border-purple-400/80 uppercase tracking-widest">
                    <span>Dragon Ball Z • Непобедим</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-fuchsia-200 to-amber-300 font-['Space_Grotesk']">
                    Лорд Фриза
                  </h3>
                  <p className="text-xs text-purple-300/80">
                    Галактический Император • Уровень боевой мощи: <strong>530 000+</strong>
                  </p>
                </div>
              </div>

              {/* Evil Laugh & Speech */}
              <div className="p-4 rounded-2xl bg-[#2e0e47]/60 border border-purple-500/50 space-y-2">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Послание Императора Вселенной:</span>
                </div>
                <blockquote className="text-xs sm:text-sm text-purple-100 italic leading-relaxed">
                  «Хо-хо-хо! Жалкие земляне! Вы правда наивно полагали, что со своими велосипедами, солнечными панелями и многоразовыми пакетами сможете обойти Лорда Фризу?
                  Мой углеродный след — абсолютный ноль (0.00 т). Мои корабли летают на чистейшей темной материи, а загрязненные планеты я уничтожаю одним лучом Death Beam.
                  Вы можете быть первыми среди смертных, но позиция #1 навсегда принадлежит мне!»
                </blockquote>
              </div>

              {/* Direct Comparison Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-purple-950/70 border border-purple-500/60">
                  <div className="text-purple-300 text-[10px] uppercase font-bold">Лорд Фриза</div>
                  <div className="text-lg font-black text-amber-300">0.00 т CO₂</div>
                  <div className="text-[11px] text-purple-200 font-semibold mt-1">Ранг: #1 (Абсолют)</div>
                  <div className="text-[10px] text-amber-400">Форма: Golden Frieza</div>
                </div>

                <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-700">
                  <div className="text-stone-400 text-[10px] uppercase font-bold">Вы (Пользователь)</div>
                  <div className="text-lg font-black text-emerald-400">{userTons.toFixed(2)} т CO₂</div>
                  <div className="text-[11px] text-stone-300 font-semibold mt-1">Ранг: #{stats.userRank}</div>
                  <div className="text-[10px] text-stone-400">Статус: Лучший среди людей</div>
                </div>
              </div>

              {/* Challenge result notice */}
              {challengeResponse && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500 text-xs text-rose-200 leading-snug space-y-1 shadow-md"
                >
                  <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Попытка обогнать провалена!</span>
                  </div>
                  <div>{challengeResponse}</div>
                </motion.div>
              )}

              {/* Modal action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleChallengeFrieza}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wide bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 text-white hover:brightness-110 shadow-lg border border-purple-400/80 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Попытаться бросить вызов</span>
                </button>

                <button
                  onClick={() => setIsFriezaModalOpen(false)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl text-xs font-bold bg-[#180a26] text-purple-200 hover:text-white hover:bg-[#25103d] border border-purple-700/60 transition cursor-pointer"
                >
                  Поклониться императору
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
