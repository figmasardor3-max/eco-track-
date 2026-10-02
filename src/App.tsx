import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CalculatorSection } from './components/CalculatorSection';
import { ChartsDashboard } from './components/ChartsDashboard';
import { EcoTipsSection } from './components/EcoTipsSection';
import { HabitTrackerSection } from './components/HabitTrackerSection';
import { PresetSelectorModal } from './components/PresetSelectorModal';

import { FootprintInput, ActiveTab, Habit, EcoTip } from './types';
import { DEFAULT_INPUT, INITIAL_ECO_TIPS, INITIAL_HABITS } from './data/initialData';
import { calculateEmissions, getEmissionRank } from './utils/calculator';
import { loadSavedInput, saveInput, loadSavedHabits, saveHabits } from './utils/storage';
import { Leaf, Globe, BookOpen } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState<FootprintInput>(loadSavedInput);
  const [habits, setHabits] = useState<Habit[]>(loadSavedHabits);
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    saveInput(input);
  }, [input]);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  // Recalculate whenever input changes
  const breakdown = calculateEmissions(input);
  const rank = getEmissionRank(breakdown.totalTons);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  const handleReset = () => {
    if (window.confirm('Сбросить все параметры калькулятора к значениям по умолчанию?')) {
      setInput(DEFAULT_INPUT);
      showToast('Параметры сброшены к стандартным');
    }
  };

  const handleSelectPreset = (newInput: FootprintInput) => {
    setInput(newInput);
    showToast('Сценарий успешно загружен!');
  };

  // Habits management
  const handleToggleHabit = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completedDates.includes(dateStr);
        const newDates = exists
          ? h.completedDates.filter((d) => d !== dateStr)
          : [...h.completedDates, dateStr];
        return { ...h, completedDates: newDates };
      })
    );
  };

  const handleAddCustomHabit = (newHabit: Habit) => {
    setHabits((prev) => [newHabit, ...prev]);
    showToast('Эко-привычка добавлена в трекер!');
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    showToast('Привычка удалена');
  };

  const handleAddHabitFromTip = (tip: EcoTip) => {
    // Check if habit already exists with this title
    const existing = habits.find((h) => h.title.toLowerCase() === tip.title.toLowerCase());
    if (existing) {
      showToast('Эта привычка уже есть в вашем трекере');
      return;
    }

    const approxKgPerDay = Number((tip.co2SavingsKg / 150).toFixed(2));
    const newHabit: Habit = {
      id: `tip-habit-${Date.now()}`,
      category: tip.category,
      title: tip.title,
      description: tip.description.slice(0, 110) + '...',
      impactKgPerAction: Math.max(0.2, approxKgPerDay),
      iconName: tip.iconName,
      completedDates: [],
      createdDate: new Date().toISOString().split('T')[0],
    };

    setHabits((prev) => [newHabit, ...prev]);
    showToast(`«${tip.title.slice(0, 30)}...» добавлено в трекер!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0c10] text-stone-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        breakdown={breakdown}
        rank={rank}
        onOpenPresets={() => setIsPresetModalOpen(true)}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calculator' && (
          <CalculatorSection
            input={input}
            onChange={setInput}
            breakdown={breakdown}
            onGoToAnalytics={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <ChartsDashboard
            breakdown={breakdown}
            rank={rank}
            onGoToTips={() => setActiveTab('tips')}
          />
        )}

        {activeTab === 'tips' && (
          <EcoTipsSection
            tips={INITIAL_ECO_TIPS}
            breakdown={breakdown}
            habits={habits}
            onAddHabitFromTip={handleAddHabitFromTip}
            onGoToHabits={() => setActiveTab('habits')}
          />
        )}

        {activeTab === 'habits' && (
          <HabitTrackerSection
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onAddCustomHabit={handleAddCustomHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131922] text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700/80 flex items-center gap-3 transition-all">
          <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Preset Selector Modal */}
      <PresetSelectorModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      {/* Footer */}
      <footer className="bg-[#0d1016] border-t border-stone-800/90 mt-16 py-8 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-[10px]">
              E
            </div>
            <span className="font-semibold text-stone-200">EcoTrack</span>
            <span className="text-stone-400">— Персональный расчет углеродного следа и гид по устойчивости</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Коэффициенты: IPCC, DEFRA &amp; Our World in Data
            </span>
            <span className="hidden md:inline text-stone-700">•</span>
            <span className="text-stone-300">Парижский ориентир: 2.0 т CO₂e/чел</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
