import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Trophy, 
  Plus, 
  Sparkles, 
  ShoppingBag, 
  Salad, 
  Bike, 
  Coffee, 
  Droplets, 
  Recycle,
  Calendar,
  Trash2,
  TrendingUp,
  Award
} from 'lucide-react';
import { Habit } from '../types';

interface HabitTrackerSectionProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, dateStr: string) => void;
  onAddCustomHabit: (newHabit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const HabitTrackerSection: React.FC<HabitTrackerSectionProps> = ({
  habits,
  onToggleHabit,
  onAddCustomHabit,
  onDeleteHabit,
}) => {
  // Today's date string YYYY-MM-DD
  const today = new Date();
  const getFormattedDate = (d: Date) => d.toISOString().split('T')[0];
  const todayStr = getFormattedDate(today);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state for adding custom habit
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImpact, setNewImpact] = useState<number>(1.0);
  const [newCategory, setNewCategory] = useState<'transport' | 'housing' | 'diet' | 'consumption'>('consumption');

  // Days strip: last 7 days
  const pastDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const dateStr = getFormattedDate(d);
    const dayName = d.toLocaleDateString('ru-RU', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dateStr, dayName, dayNum, isToday: dateStr === todayStr };
  });

  // Calculate total CO2 saved all-time from habits
  const totalCo2SavedKg = habits.reduce((acc, h) => {
    return acc + (h.completedDates.length * h.impactKgPerAction);
  }, 0);

  // Calculate completed today
  const completedTodayCount = habits.filter((h) => h.completedDates.includes(selectedDate)).length;
  const isAllDayCompleted = habits.length > 0 && completedTodayCount === habits.length;

  const triggerGrandCelebrationConfetti = () => {
    // Stage 1: Central explosive blast
    confetti({
      particleCount: 75,
      spread: 90,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#38bdf8', '#ffffff'],
      ticks: 220,
    });

    // Stage 2: Left cannon shot
    setTimeout(() => {
      confetti({
        particleCount: 65,
        angle: 60,
        spread: 75,
        origin: { x: 0.05, y: 0.75 },
        colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b'],
        ticks: 250,
      });
    }, 180);

    // Stage 3: Right cannon shot
    setTimeout(() => {
      confetti({
        particleCount: 65,
        angle: 120,
        spread: 75,
        origin: { x: 0.95, y: 0.75 },
        colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b'],
        ticks: 250,
      });
    }, 360);

    // Stage 4: High gentle star and flutter shower
    setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 130,
        origin: { x: 0.5, y: 0.4 },
        startVelocity: 35,
        colors: ['#fbbf24', '#34d399', '#a7f3d0', '#fef08a', '#ffffff'],
        scalar: 1.15,
        ticks: 300,
      });
    }, 540);
  };

  const handleToggle = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const isCurrentlyCompleted = habit.completedDates.includes(selectedDate);
    const willBeCompleted = !isCurrentlyCompleted;

    // Check if toggling this will make all habits for selectedDate completed
    const otherCompletedCount = habits.filter(
      (h) => h.id !== habitId && h.completedDates.includes(selectedDate)
    ).length;
    const nextCompletedTotal = otherCompletedCount + (willBeCompleted ? 1 : 0);

    const willCompleteAll = willBeCompleted && habits.length > 0 && nextCompletedTotal === habits.length;

    if (willCompleteAll) {
      // Trigger full grand celebration fireworks when ALL planned habits for the day are finished
      triggerGrandCelebrationConfetti();
    } else if (willBeCompleted) {
      // Gentle confirmation pop for single habit
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
    }

    onToggleHabit(habitId, selectedDate);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: Habit = {
      id: `custom-habit-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Пользовательская эко-привычка',
      impactKgPerAction: Number(newImpact) || 0.5,
      iconName: newCategory === 'diet' ? 'Salad' : newCategory === 'transport' ? 'Bike' : 'Recycle',
      completedDates: [],
      createdDate: todayStr,
    };

    onAddCustomHabit(newHabit);
    setNewTitle('');
    setNewDesc('');
    setNewImpact(1.0);
    setShowAddModal(false);
  };

  // Helper for icons
  const renderHabitIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5' };
    switch (iconName) {
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      case 'Salad': return <Salad {...props} />;
      case 'Bike': return <Bike {...props} />;
      case 'Coffee': return <Coffee {...props} />;
      case 'Droplets': return <Droplets {...props} />;
      case 'Recycle': return <Recycle {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Habit Tracker Banner with Gamification */}
      <div className="bg-gradient-to-br from-emerald-950 via-[#111620] to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Ежедневные эко-действия</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
              Трекер устойчивых привычек
            </h2>
            <p className="text-sm text-stone-300 max-w-xl leading-relaxed">
              Отмечайте выполненные действия каждый день. Каждая чашка кофе в свою термокружку или поездка на велосипеде суммируются в реальные килограммы спасенного климата.
            </p>
          </div>

          {/* Gamified stats badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-[#131924]/80 backdrop-blur-md p-3.5 rounded-2xl border border-stone-700/80 shadow-md">
              <div className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Предотвращено CO₂</span>
              </div>
              <div className="text-2xl font-black text-white mt-1 font-['Space_Grotesk']">
                {totalCo2SavedKg.toFixed(1)} <span className="text-xs font-normal text-stone-400">кг</span>
              </div>
            </div>

            <div className="bg-[#131924]/80 backdrop-blur-md p-3.5 rounded-2xl border border-stone-700/80 shadow-md">
              <div className="text-[11px] text-stone-300 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Выполнено за дату</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-1 font-['Space_Grotesk']">
                {completedTodayCount} <span className="text-xs font-normal text-stone-400">из {habits.length}</span>
              </div>
            </div>

            <div className="bg-[#131924]/80 backdrop-blur-md p-3.5 rounded-2xl border border-stone-700/80 col-span-2 sm:col-span-1 shadow-md">
              <div className="text-[11px] text-stone-300 font-medium flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Уровень</span>
              </div>
              <div className="text-base font-bold text-white mt-1">
                {totalCo2SavedKg > 30 ? 'Эко-мастер 🌱' : totalCo2SavedKg > 10 ? 'Зеленый росток 🌿' : 'Первый шаг 🍃'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date selector strip */}
      <div className="bg-[#121620] p-4 rounded-3xl border border-stone-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {pastDays.map((day) => {
            const isSelected = selectedDate === day.dateStr;
            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[58px] py-2 px-3 rounded-2xl transition cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-400 text-stone-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-[#18202c] text-stone-300 border-stone-700/80 hover:bg-[#222a3a] hover:text-white'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold opacity-80">
                  {day.dayName}
                </span>
                <span className="text-base font-bold">
                  {day.dayNum}
                </span>
                {day.isToday && (
                  <span className={`text-[9px] font-bold ${isSelected ? 'text-stone-900 font-extrabold' : 'text-emerald-400'}`}>
                    Сегодня
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          id="btn-add-habit-modal"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 shadow-md shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Своя эко-привычка</span>
        </button>
      </div>

      {/* All habits completed celebration banner */}
      {isAllDayCompleted && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-[#10241b] to-teal-950/90 border border-emerald-500/50 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center text-xl shrink-0">
              🎉
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h4 className="text-sm sm:text-base font-bold text-white font-['Space_Grotesk']">
                  Все эко-привычки на {pastDays.find(d => d.dateStr === selectedDate)?.isToday ? 'сегодня' : 'выбранный день'} выполнены!
                </h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-400 text-stone-950">
                  100%
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Великолепный результат! Вы предотвратили максимум выбросов CO₂ за день.
              </p>
            </div>
          </div>

          <button
            onClick={triggerGrandCelebrationConfetti}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs font-bold transition cursor-pointer shrink-0 shadow-md shadow-emerald-500/20"
            title="Запустить праздничный фейерверк еще раз"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Праздновать еще раз</span>
          </button>
        </div>
      )}

      {/* Habits Checklist */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="bg-[#121620] p-8 rounded-3xl text-center border border-stone-800">
            <p className="text-stone-400 text-sm">У вас пока нет активных привычек.</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompleted = habit.completedDates.includes(selectedDate);
            const totalCompletions = habit.completedDates.length;

            return (
              <div
                key={habit.id}
                onClick={() => handleToggle(habit.id)}
                className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-[#0e1d18] border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-md'
                    : 'bg-[#121620] border-stone-800 hover:border-stone-700 hover:bg-[#161c27]'
                }`}
              >
                {/* Left checkmark + icon + title */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="cursor-pointer text-emerald-400 focus:outline-none shrink-0"
                    aria-label={isCompleted ? 'Отменить выполнение' : 'Отметить как выполненное'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <Circle className="w-6 h-6 text-stone-500 hover:text-emerald-400" />
                    )}
                  </button>

                  <div className="w-10 h-10 rounded-2xl bg-[#18202c] text-emerald-300 border border-stone-700/80 flex items-center justify-center shrink-0">
                    {renderHabitIcon(habit.iconName)}
                  </div>

                  <div>
                    <h3 className={`text-sm sm:text-base font-bold transition font-['Space_Grotesk'] ${isCompleted ? 'text-emerald-300 line-through decoration-emerald-500/60' : 'text-white'}`}>
                      {habit.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">
                      {habit.description}
                    </p>
                  </div>
                </div>

                {/* Right impact & badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-950/90 px-2.5 py-1 rounded-full border border-emerald-700/80">
                      -{habit.impactKgPerAction} кг CO₂
                    </span>
                    <div className="text-[10px] text-stone-400 mt-1 hidden sm:block">
                      Всего выполнено: {totalCompletions} раз
                    </div>
                  </div>

                  {/* Delete button if custom */}
                  {habit.id.startsWith('custom-') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHabit(habit.id);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                      title="Удалить привычку"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] rounded-3xl p-6 max-w-md w-full border border-stone-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                Добавить свою эко-привычку
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#18202c] hover:bg-[#222a3a] text-stone-300 flex items-center justify-center font-bold text-sm cursor-pointer border border-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Название привычки:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Выключать воду во время чистки зубов"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-700 bg-[#18202c] text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-stone-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Описание:
                </label>
                <input
                  type="text"
                  placeholder="Кратко о пользе..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-700 bg-[#18202c] text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-stone-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Сфера жизни:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-700 bg-[#18202c] text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="transport">Транспорт</option>
                    <option value="housing">Жилье/Энергия</option>
                    <option value="diet">Питание</option>
                    <option value="consumption">Потребление</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Экономия CO₂ (кг / действие):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.05"
                    max="20"
                    value={newImpact}
                    onChange={(e) => setNewImpact(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-700 bg-[#18202c] text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:bg-[#18202c] hover:text-white cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-stone-950 cursor-pointer shadow-sm"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
