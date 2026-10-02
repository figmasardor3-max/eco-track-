import React from 'react';
import { Leaf, BarChart3, Calculator, Lightbulb, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { ActiveTab, EmissionBreakdown, EmissionRank } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  breakdown: EmissionBreakdown;
  rank: EmissionRank;
  onOpenPresets: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  breakdown,
  rank,
  onOpenPresets,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0c10]/95 backdrop-blur-md border-b border-stone-800/90 text-stone-100 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center text-stone-950 shadow-md font-bold">
              <Leaf className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Space_Grotesk']">
                  Eco<span className="text-emerald-400">Track</span>
                </span>
                <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/80">
                  CO₂ Монитор
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Углеродный след и осознанный образ жизни
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-4 bg-[#12161f] px-3.5 py-1.5 rounded-2xl border border-stone-700/80">
            <div className="text-right">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Годовой след</div>
              <div className="text-base font-bold text-white leading-tight">
                {breakdown.totalTons} <span className="text-xs font-normal text-stone-400">т CO₂e</span>
              </div>
            </div>
            <div className="h-7 w-px bg-stone-700"></div>
            <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${rank.bgColorClass} ${rank.colorClass} border ${rank.borderColorClass}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              {rank.badge}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-open-presets"
              onClick={onOpenPresets}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-sm"
              title="Выбрать готовый профиль (Горожанин, Эко-активист, Путешественник)"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Сценарии</span>
            </button>
            <button
              id="btn-reset-data"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-750 text-stone-300 hover:text-white border border-stone-700 text-xs transition cursor-pointer"
              title="Сбросить к значениям по умолчанию"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="sr-only sm:not-sr-only">Сброс</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-stone-800/90 scrollbar-none">
          <button
            id="tab-calculator"
            onClick={() => setActiveTab('calculator')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-emerald-400 text-stone-950 font-bold shadow-md shadow-emerald-500/25'
                : 'text-stone-300 hover:text-white hover:bg-stone-850'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>1. Калькулятор CO₂</span>
          </button>

          <button
            id="tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-emerald-400 text-stone-950 font-bold shadow-md shadow-emerald-500/25'
                : 'text-stone-300 hover:text-white hover:bg-stone-850'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>2. Аналитика и графики</span>
          </button>

          <button
            id="tab-tips"
            onClick={() => setActiveTab('tips')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'tips'
                ? 'bg-emerald-400 text-stone-950 font-bold shadow-md shadow-emerald-500/25'
                : 'text-stone-300 hover:text-white hover:bg-stone-850'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>3. Эко-советы</span>
          </button>

          <button
            id="tab-habits"
            onClick={() => setActiveTab('habits')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'habits'
                ? 'bg-emerald-400 text-stone-950 font-bold shadow-md shadow-emerald-500/25'
                : 'text-stone-300 hover:text-white hover:bg-stone-850'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>4. Трекер привычек</span>
          </button>
        </div>
      </div>
    </header>
  );
};
