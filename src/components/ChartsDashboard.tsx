import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TreePine, 
  Car, 
  Target, 
  TrendingDown, 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  Check, 
  Trophy, 
  Users 
} from 'lucide-react';
import { EmissionBreakdown, EmissionRank } from '../types';
import { GlobalLeaderboard } from './GlobalLeaderboard';
import { computeCommunityStats } from '../utils/communityRating';

interface ChartsDashboardProps {
  breakdown: EmissionBreakdown;
  rank: EmissionRank;
  onGoToTips: () => void;
}

export const ChartsDashboard: React.FC<ChartsDashboardProps> = ({
  breakdown,
  rank,
  onGoToTips,
}) => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  // Simulation interactive state: "What if" reductions
  const [simTransitShift, setSimTransitShift] = useState<number>(30); // reduce car km by %
  const [simPlantDays, setSimPlantDays] = useState<boolean>(true); // plant-based 2 days/wk: ~350kg
  const [simTempDown, setSimTempDown] = useState<boolean>(true); // -1C heat: ~200kg
  const [simLessFlights, setSimLessFlights] = useState<number>(1); // 1 less flight: ~230kg

  // Calculate simulated savings
  const carPortion = breakdown.transport * 0.65;
  const simCarSavings = Math.round((carPortion * simTransitShift) / 100);
  const simDietSavings = simPlantDays ? 350 : 0;
  const simHousingSavings = simTempDown ? 210 : 0;
  const simFlightSavings = simLessFlights * 230;

  const totalSimSavingsKg = simCarSavings + simDietSavings + simHousingSavings + simFlightSavings;
  const simulatedTotalKg = Math.max(800, breakdown.total - totalSimSavingsKg);
  const simulatedTons = Number((simulatedTotalKg / 1000).toFixed(2));
  const savingsPercent = Math.min(65, Math.round((totalSimSavingsKg / breakdown.total) * 100));

  // Category data for Donut
  const categories = [
    {
      id: 'transport',
      label: 'Транспорт',
      val: breakdown.transport,
      color: '#059669', // emerald-600
      hoverColor: '#10b981',
      bgClass: 'bg-emerald-500',
      textClass: 'text-emerald-700',
    },
    {
      id: 'housing',
      label: 'Жилье и энергия',
      val: breakdown.housing,
      color: '#d97706', // amber-600
      hoverColor: '#f59e0b',
      bgClass: 'bg-amber-500',
      textClass: 'text-amber-700',
    },
    {
      id: 'diet',
      label: 'Питание',
      val: breakdown.diet,
      color: '#0d9488', // teal-600
      hoverColor: '#14b8a6',
      bgClass: 'bg-teal-500',
      textClass: 'text-teal-700',
    },
    {
      id: 'consumption',
      label: 'Вещи и отходы',
      val: breakdown.consumption,
      color: '#0284c7', // sky-600
      hoverColor: '#38bdf8',
      bgClass: 'bg-sky-500',
      textClass: 'text-sky-700',
    },
  ];

  const totalVal = breakdown.total || 1;

  // Donut SVG computation
  let accumulatedAngle = 0;
  const radius = 80;
  const strokeWidth = 32;
  const center = 110;
  const circumference = 2 * Math.PI * radius;

  const slices = categories.map((cat) => {
    const fraction = Math.max(0.01, cat.val / totalVal);
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedAngle * circumference;
    accumulatedAngle += fraction;
    const percent = Math.round(fraction * 100);

    return {
      ...cat,
      fraction,
      percent,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // Community comparative stats
  const communityStats = computeCommunityStats(breakdown.totalTons);

  // Benchmarks for comparative bar chart
  const benchmarks = [
    { label: 'Парижская цель 2030', value: 2.0, color: 'bg-emerald-500', tag: 'Цель' },
    { label: 'Вы (текущий след)', value: breakdown.totalTons, color: 'bg-teal-600', tag: 'Вы', isUser: true },
    { label: 'Сообщество EcoTrack (среднее)', value: communityStats.communityAverageTons, color: 'bg-emerald-600', tag: 'Юзеры' },
    { label: 'Среднее по миру', value: 4.8, color: 'bg-stone-400', tag: 'Мир' },
    { label: 'Крупный мегаполис', value: 11.2, color: 'bg-rose-400', tag: 'Город' },
  ];
  const maxBenchmark = 13;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Top Banner with Rank */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className={`p-6 sm:p-8 rounded-3xl border transition shadow-lg ${rank.bgColorClass} ${rank.borderColorClass}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#131924]/90 text-stone-200 border border-stone-700/80">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Оценка профиля</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#131924]/90 border border-stone-700/80 text-emerald-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Топ {communityStats.percentile}% сообщества (#{communityStats.userRank})</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              {rank.title}
            </h2>
            <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
              {rank.description}
            </p>
          </div>

          <div className="flex items-baseline md:flex-col md:items-end gap-2 bg-[#131924]/90 p-4 rounded-2xl border border-stone-700/80 shadow-md shrink-0">
            <div className="text-xs text-stone-400 uppercase font-semibold">Годовая эмиссия</div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {breakdown.totalTons} <span className="text-base font-medium text-stone-400">т CO₂e</span>
            </div>
            <div className="text-xs text-stone-400">({breakdown.total.toLocaleString()} кг)</div>
          </div>
        </div>
      </motion.div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Donut Chart: Структура выбросов (5 cols) */}
        <motion.div 
          id="chart-breakdown-donut"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5 bg-[#121620] rounded-3xl p-6 border border-stone-800 shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center justify-center font-bold">
                  <PieIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk']">Структура выбросов</h3>
                  <p className="text-xs text-stone-400">Распределение по сферам жизни</p>
                </div>
              </div>
            </div>

            {/* Circular Donut Diagram */}
            <div className="flex flex-col items-center justify-center py-4 relative">
              <motion.svg 
                width="220" 
                height="220" 
                viewBox="0 0 220 220" 
                className="rotate-[-90deg]"
                initial={{ rotate: -180, opacity: 0, scale: 0.85 }}
                animate={{ rotate: -90, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {slices.map((slice, index) => (
                  <motion.circle
                    key={slice.id}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={activeSegment === slice.id ? slice.hoverColor : slice.color}
                    strokeWidth={activeSegment === slice.id ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-colors duration-200 cursor-pointer"
                    initial={{ opacity: 0, strokeDashoffset: circumference }}
                    animate={{ opacity: 1, strokeDashoffset: slice.strokeDashoffset }}
                    transition={{ duration: 0.9, delay: 0.15 + index * 0.1, ease: 'easeOut' }}
                    onMouseEnter={() => setActiveSegment(slice.id)}
                    onMouseLeave={() => setActiveSegment(null)}
                  />
                ))}
              </motion.svg>

              {/* Center text in Donut */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Всего</span>
                <span className="text-2xl font-black text-white tracking-tight">{breakdown.totalTons}</span>
                <span className="text-xs font-bold text-stone-400">тонн/год</span>
              </motion.div>
            </div>

            {/* Legend list */}
            <div className="space-y-2 mt-2">
              {slices.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
                  onMouseEnter={() => setActiveSegment(item.id)}
                  onMouseLeave={() => setActiveSegment(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                    activeSegment === item.id ? 'bg-[#1e2638]' : 'hover:bg-[#18202c]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-stone-200">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white">{item.percent}%</span>
                    <span className="text-xs text-stone-400 w-16 text-right">
                      {(item.val / 1000).toFixed(2)} т
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Benchmark & Equivalents (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Benchmark Comparison Bar Chart */}
          <motion.div 
            id="chart-benchmarks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-[#121620] rounded-3xl p-6 border border-stone-800 shadow-md"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-teal-950/80 text-teal-300 border border-teal-800/60 flex items-center justify-center font-bold">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Space_Grotesk']">Сравнение с климатическими ориентирами</h3>
                <p className="text-xs text-stone-400">Парижское соглашение vs средние показатели</p>
              </div>
            </div>

            <div className="space-y-4">
              {benchmarks.map((b, index) => {
                const percentWidth = Math.min(100, Math.round((b.value / maxBenchmark) * 100));
                return (
                  <div key={b.label} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-semibold ${b.isUser ? 'text-emerald-400 font-bold' : 'text-stone-300'}`}>
                        {b.label}
                      </span>
                      <span className="font-mono font-bold text-white">
                        {b.value} т CO₂e
                      </span>
                    </div>
                    <div className="w-full h-3.5 bg-[#18202c] rounded-full overflow-hidden p-0.5 border border-stone-700/60 relative">
                      <motion.div
                        className={`h-full rounded-full ${b.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentWidth}%` }}
                        transition={{ duration: 0.85, delay: 0.25 + index * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-[#18202c] border border-stone-700 text-xs text-stone-300 flex items-start gap-2">
              <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-emerald-300">Парижский порог:</strong> Для сдерживания глобального потепления на уровне +1.5 °C средний углеродный след жителя планеты не должен превышать <strong className="text-white">2.0 тонны в год</strong>.
              </span>
            </div>
          </motion.div>

          {/* Equivalents in Real-world Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="bg-[#0e1d18] border border-emerald-500/40 p-5 rounded-3xl flex items-center gap-4 shadow-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <TreePine className="w-6 h-6" />
              </div>
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-2xl font-black text-white font-['Space_Grotesk']"
                >
                  ~{breakdown.treesNeeded}
                </motion.div>
                <div className="text-xs font-semibold text-emerald-300">деревьев нужно вырастить</div>
                <div className="text-[11px] text-stone-400 mt-0.5">для поглощения ваших годовых выбросов</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="bg-[#18202c] border border-stone-700 p-5 rounded-3xl flex items-center gap-4 shadow-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-stone-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.45 }}
                  className="text-2xl font-black text-white font-['Space_Grotesk']"
                >
                  ~{breakdown.carEquivalentKm.toLocaleString()}
                </motion.div>
                <div className="text-xs font-semibold text-stone-200">км на легковом авто</div>
                <div className="text-[11px] text-stone-400 mt-0.5">эквивалентный суммарный пробег</div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Global Leaderboard & Community Scale Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <GlobalLeaderboard
          userTons={breakdown.totalTons}
          onGoToTips={onGoToTips}
        />
      </motion.div>

      {/* Interactive Reduction Simulator: "Что если..." */}
      <motion.div 
        id="simulator-widget" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Интерактивный симулятор</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk']">
              Симулятор снижения следа: «Что если...»
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
              Попробуйте смоделировать простые изменения в привычках и мгновенно оцените, сколько тонн CO₂ вы можете предотвратить уже в этом году.
            </p>
          </div>

          <div className="bg-stone-800/90 p-4 rounded-2xl border border-stone-700 text-right shrink-0">
            <div className="text-xs text-stone-400 uppercase font-medium">Потенциальная экономия</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-['Space_Grotesk']">
              -{(totalSimSavingsKg / 1000).toFixed(2)} т <span className="text-xs font-normal text-stone-400">CO₂/год</span>
            </div>
            <div className="text-xs text-emerald-300 font-semibold mt-0.5">
              Снижение на {savingsPercent}% от вашего следа!
            </div>
          </div>
        </div>

        {/* Simulator controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* Lever 1: Transit shift */}
          <div className="bg-stone-800/60 p-4 rounded-2xl border border-stone-700/60 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-stone-200">Сократить поездки на авто (переход на велосипед/метро):</span>
              <span className="text-emerald-400 font-bold">{simTransitShift}% (-{simCarSavings} кг)</span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="10"
              value={simTransitShift}
              onChange={(e) => setSimTransitShift(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>0%</span>
              <span>30%</span>
              <span>70%</span>
            </div>
          </div>

          {/* Lever 2: Plant-based 2 days/week */}
          <div 
            onClick={() => setSimPlantDays(!simPlantDays)}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
              simPlantDays
                ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                : 'bg-stone-800/40 border-stone-700 text-stone-400'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Растительный рацион 2 дня в неделю</span>
                {simPlantDays && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">«Понедельник без мяса» и легкий ужин</div>
            </div>
            <div className="text-xs font-bold text-emerald-400">
              -350 кг CO₂
            </div>
          </div>

          {/* Lever 3: Temp down by 1 degree */}
          <div 
            onClick={() => setSimTempDown(!simTempDown)}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
              simTempDown
                ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                : 'bg-stone-800/40 border-stone-700 text-stone-400'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Снижение комнатной температуры на 1 °C</span>
                {simTempDown && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">Оптимизация термостата отопления</div>
            </div>
            <div className="text-xs font-bold text-emerald-400">
              -210 кг CO₂
            </div>
          </div>

          {/* Lever 4: Flight reduction */}
          <div className="bg-stone-800/60 p-4 rounded-2xl border border-stone-700/60 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-stone-200">Заменить перелет поездом / видеосвязью:</span>
              <span className="text-emerald-400 font-bold">{simLessFlights} рейс (-{simFlightSavings} кг)</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={simLessFlights}
              onChange={(e) => setSimLessFlights(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>0 рейсов</span>
              <span>2 рейса</span>
              <span>4 рейса</span>
            </div>
          </div>

        </div>

        {/* Result summary banner */}
        <div className="mt-6 pt-6 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-stone-400">Результат после внедрения:</div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span>Новый след:</span>
              <span className="text-emerald-400 font-black">{simulatedTons} т CO₂e</span>
              <span className="text-xs text-stone-400 line-through">({breakdown.totalTons} т)</span>
            </div>
          </div>

          <button
            onClick={onGoToTips}
            id="btn-goto-tips-from-sim"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Посмотреть готовые эко-советы</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

