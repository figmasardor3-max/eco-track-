import React, { useState } from 'react';
import { 
  Lightbulb, 
  Filter, 
  TrendingDown, 
  Coins, 
  Plus, 
  Check, 
  Sparkles,
  Salad,
  ThermometerSnowflake,
  Bike,
  Zap,
  Train,
  ShoppingBag,
  UtensilsCrossed,
  Smartphone,
  HelpCircle
} from 'lucide-react';
import { EcoTip, TipCategory, DifficultyLevel, EmissionBreakdown, Habit } from '../types';

interface EcoTipsSectionProps {
  tips: EcoTip[];
  breakdown: EmissionBreakdown;
  habits: Habit[];
  onAddHabitFromTip: (tip: EcoTip) => void;
  onGoToHabits: () => void;
}

export const EcoTipsSection: React.FC<EcoTipsSectionProps> = ({
  tips,
  breakdown,
  habits,
  onAddHabitFromTip,
  onGoToHabits,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TipCategory>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [addedTipIds, setAddedTipIds] = useState<Set<string>>(new Set());

  // Determine user's top emission category
  const categoryScores = [
    { cat: 'transport', val: breakdown.transport, name: 'Транспорт' },
    { cat: 'housing', val: breakdown.housing, name: 'Жилье и энергетика' },
    { cat: 'diet', val: breakdown.diet, name: 'Питание' },
    { cat: 'consumption', val: breakdown.consumption, name: 'Потребление' },
  ];
  categoryScores.sort((a, b) => b.val - a.val);
  const topCategory = categoryScores[0];

  const handleAddHabit = (tip: EcoTip) => {
    onAddHabitFromTip(tip);
    setAddedTipIds((prev) => new Set(prev).add(tip.id));
    setTimeout(() => {
      // clear checkmark state after 3 sec if desired, or keep it
    }, 2500);
  };

  // Filter tips
  const filteredTips = tips.filter((tip) => {
    if (selectedCategory !== 'all' && tip.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && tip.difficulty !== selectedDifficulty) return false;
    return true;
  });

  // Prioritize tips from the top category to the top of the list
  const sortedTips = [...filteredTips].sort((a, b) => {
    const aIsTop = a.category === topCategory.cat ? 1 : 0;
    const bIsTop = b.category === topCategory.cat ? 1 : 0;
    if (aIsTop !== bIsTop) return bIsTop - aIsTop;
    return b.co2SavingsKg - a.co2SavingsKg;
  });

  // Helper for rendering icons dynamically
  const renderTipIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5' };
    switch (iconName) {
      case 'Salad': return <Salad {...props} />;
      case 'ThermometerSnowflake': return <ThermometerSnowflake {...props} />;
      case 'Bike': return <Bike {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Train': return <Train {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...props} />;
      case 'Smartphone': return <Smartphone {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const difficultyLabels: Record<DifficultyLevel, { label: string; color: string }> = {
    easy: { label: 'Легко внедрить', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80' },
    medium: { label: 'Средняя сложность', color: 'bg-amber-950/80 text-amber-300 border-amber-800/80' },
    advanced: { label: 'Продвинутый уровень', color: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80' },
  };

  return (
    <div className="space-y-8">
      {/* Personalized Header Box */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#111620] to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Персонализированная рекомендательная система</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
              Советы по устойчивому образу жизни
            </h2>
            <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
              Главный источник вашего углеродного следа — <strong className="text-emerald-400">{topCategory.name}</strong> ({(topCategory.val / 1000).toFixed(2)} т CO₂). Мы подобрали шаги с наибольшей отдачей именно для вашего профиля.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#131924]/80 backdrop-blur-md p-4 rounded-2xl border border-stone-700/80 shrink-0 shadow-md">
            <Lightbulb className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs text-stone-400">Советов доступно</div>
              <div className="text-xl font-bold text-white">{tips.length} практических шагов</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#121620] p-4 rounded-3xl border border-stone-800 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'all', label: 'Все сферы' },
              { key: 'transport', label: '🚗 Транспорт' },
              { key: 'housing', label: '⚡ Жилье и энергия' },
              { key: 'diet', label: '🥗 Питание' },
              { key: 'consumption', label: '🛍️ Потребление' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key as TipCategory)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  selectedCategory === cat.key
                    ? 'bg-emerald-400 text-stone-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-[#18202c] text-stone-300 border-stone-700/70 hover:bg-[#222a3a] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-300">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span>Сложность:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | 'all')}
              className="bg-[#18202c] border border-stone-700 text-stone-200 rounded-lg px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
            >
              <option value="all">Любая</option>
              <option value="easy">Легко</option>
              <option value="medium">Средне</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tips Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedTips.map((tip) => {
          const isTopCategory = tip.category === topCategory.cat;
          const alreadyAdded = addedTipIds.has(tip.id);

          return (
            <div
              key={tip.id}
              className={`bg-[#121620] rounded-3xl p-6 border transition shadow-md hover:shadow-lg flex flex-col justify-between ${
                isTopCategory ? 'border-emerald-500/50 ring-1 ring-emerald-500/30' : 'border-stone-800 hover:border-stone-700'
              }`}
            >
              <div>
                {/* Header of card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center justify-center shrink-0">
                      {renderTipIcon(tip.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">
                          {tip.actionTag}
                        </span>
                        {isTopCategory && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/70">
                            Макс. отдача
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug mt-0.5 font-['Space_Grotesk']">
                        {tip.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mt-2 mb-4">
                  {tip.description}
                </p>
              </div>

              {/* Metrics row and Action */}
              <div className="pt-4 border-t border-stone-800/80 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#0e1d18] p-2.5 rounded-2xl border border-emerald-800/60">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Сокращение CO₂</span>
                    </div>
                    <div className="text-sm font-black text-white mt-0.5">
                      -{tip.co2SavingsKg} кг / год
                    </div>
                  </div>

                  <div className="bg-[#1c170f] p-2.5 rounded-2xl border border-amber-800/60">
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Выгода в кошельке</span>
                    </div>
                    <div className="text-sm font-black text-white mt-0.5">
                      ~{tip.financialSavingsRub}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${difficultyLabels[tip.difficulty].color}`}>
                    {difficultyLabels[tip.difficulty].label}
                  </span>

                  <button
                    onClick={() => handleAddHabit(tip)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      alreadyAdded
                        ? 'bg-emerald-600/90 text-white shadow-sm'
                        : 'bg-emerald-400 hover:bg-emerald-300 text-stone-950 shadow-md shadow-emerald-500/10'
                    }`}
                  >
                    {alreadyAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Добавлено в трекер</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>В трекер привычек</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Banner to Habit Tracker */}
      <div className="bg-[#121620] p-6 rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-700/50 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Готовы превратить советы в ежедневную практику?</div>
            <div className="text-xs text-stone-400">Отмечайте выполненные эко-действия в интерактивном трекере привычек и копите сэкономленные кг CO₂.</div>
          </div>
        </div>

        <button
          onClick={onGoToHabits}
          id="btn-goto-habits-from-tips"
          className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs sm:text-sm font-bold transition cursor-pointer shrink-0"
        >
          Открыть трекер привычек
        </button>
      </div>
    </div>
  );
};
