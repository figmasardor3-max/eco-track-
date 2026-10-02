import React from 'react';
import { 
  Car, 
  Home, 
  Utensils, 
  ShoppingBag, 
  Plane, 
  Zap, 
  Flame, 
  Users, 
  Trash2, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  FootprintInput, 
  FuelType, 
  HomeType, 
  HeatingSource, 
  DietType, 
  WasteLevel, 
  ShoppingHabits, 
  RecyclingRate, 
  DeviceUpgradeFrequency,
  EmissionBreakdown
} from '../types';

interface CalculatorSectionProps {
  input: FootprintInput;
  onChange: (updated: FootprintInput) => void;
  breakdown: EmissionBreakdown;
  onGoToAnalytics: () => void;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  input,
  onChange,
  breakdown,
  onGoToAnalytics,
}) => {
  const updateField = <K extends keyof FootprintInput>(key: K, value: FootprintInput[K]) => {
    onChange({
      ...input,
      [key]: value,
    });
  };

  return (
    <div className="space-y-8">
      {/* Intro header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-emerald-950/40 via-[#12161f] to-[#0c0f15] p-6 rounded-3xl border border-emerald-500/20 shadow-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Space_Grotesk'] flex items-center gap-2.5">
            <span>Экспресс-калькулятор углеродного следа</span>
          </h1>
          <p className="text-stone-300 text-sm mt-1 max-w-2xl">
            Настройте параметры вашей повседневной жизни. Данные пересчитываются мгновенно с использованием коэффициентов выбросов IPCC и DEFRA.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#131922] p-3.5 rounded-2xl border border-stone-700/80 shadow-md shrink-0">
          <div className="text-right">
            <div className="text-xs text-stone-400 uppercase tracking-wide font-semibold">Текущий итог</div>
            <div className="text-2xl font-black text-emerald-400">
              {breakdown.totalTons} <span className="text-sm font-semibold text-stone-400">тонн/год</span>
            </div>
          </div>
          <button
            onClick={onGoToAnalytics}
            id="btn-goto-analytics-top"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-bold transition shadow-sm cursor-pointer"
            title="Перейти к графической аналитике"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 4 Interactive Blocks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. ТРАНСПОРТ */}
        <div id="card-calc-transport" className="bg-[#121620] rounded-3xl p-6 border border-stone-800 hover:border-emerald-500/40 shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center justify-center font-bold">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">1. Транспорт и мобильность</h2>
                  <p className="text-xs text-stone-400">Автомобиль, общественный транспорт и авиаперелеты</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#18202d] text-emerald-300 border border-stone-700">
                {(breakdown.transport / 1000).toFixed(2)} т CO₂
              </span>
            </div>

            <div className="space-y-5">
              {/* Тип авто */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Тип личного транспорта
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {[
                    { key: 'none', label: 'Нет авто' },
                    { key: 'petrol', label: 'Бензин' },
                    { key: 'diesel', label: 'Дизель' },
                    { key: 'hybrid', label: 'Гибрид' },
                    { key: 'ev', label: 'Электро (EV)' },
                  ].map((fuel) => (
                    <button
                      key={fuel.key}
                      type="button"
                      onClick={() => updateField('carFuel', fuel.key as FuelType)}
                      className={`px-2 py-2 rounded-xl text-xs font-semibold border text-center transition cursor-pointer ${
                        input.carFuel === fuel.key
                          ? 'bg-emerald-400 text-stone-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-[#18202c] text-stone-300 border-stone-700/80 hover:bg-[#222a3a] hover:text-white'
                      }`}
                    >
                      {fuel.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Пробег на авто в неделю */}
              {input.carFuel !== 'none' && (
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-stone-300 mb-1.5">
                    <span>Пробег на авто в неделю:</span>
                    <span className="font-bold text-emerald-400">{input.carKmPerWeek} км/нед ({(input.carKmPerWeek * 52).toLocaleString()} км/год)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="800"
                    step="10"
                    value={input.carKmPerWeek}
                    onChange={(e) => updateField('carKmPerWeek', Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>0 км</span>
                    <span>250 км (среднее)</span>
                    <span>800 км</span>
                  </div>
                </div>
              )}

              {/* Общественный транспорт */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-stone-300 mb-1.5">
                  <span>Общественный транспорт (метро, автобус, трамвай):</span>
                  <span className="font-bold text-emerald-400">{input.publicTransitHoursPerWeek} ч / неделю</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={input.publicTransitHoursPerWeek}
                  onChange={(e) => updateField('publicTransitHoursPerWeek', Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Авиаперелеты */}
              <div className="pt-2 border-t border-stone-800/80 space-y-3">
                <div className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-stone-400" />
                  <span>Авиаперелеты (в одну сторону за год):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#18202c] p-3 rounded-2xl border border-stone-700/80">
                    <div className="flex justify-between text-xs text-stone-300 mb-1">
                      <span>Ближние (&lt;3 ч):</span>
                      <span className="font-bold text-emerald-400">{input.flightsShortPerYear} рейсов</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateField('flightsShortPerYear', Math.max(0, input.flightsShortPerYear - 1))}
                        className="w-7 h-7 rounded-lg bg-[#222b3b] border border-stone-600 font-bold text-white hover:bg-stone-700 cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={input.flightsShortPerYear}
                        onChange={(e) => updateField('flightsShortPerYear', Math.max(0, Number(e.target.value)))}
                        className="w-full text-center text-xs font-bold bg-[#121620] text-white py-1 rounded-lg border border-stone-600"
                      />
                      <button
                        type="button"
                        onClick={() => updateField('flightsShortPerYear', input.flightsShortPerYear + 1)}
                        className="w-7 h-7 rounded-lg bg-[#222b3b] border border-stone-600 font-bold text-white hover:bg-stone-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#18202c] p-3 rounded-2xl border border-stone-700/80">
                    <div className="flex justify-between text-xs text-stone-300 mb-1">
                      <span>Дальние (&gt;3 ч):</span>
                      <span className="font-bold text-emerald-400">{input.flightsLongPerYear} рейсов</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateField('flightsLongPerYear', Math.max(0, input.flightsLongPerYear - 1))}
                        className="w-7 h-7 rounded-lg bg-[#222b3b] border border-stone-600 font-bold text-white hover:bg-stone-700 cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={input.flightsLongPerYear}
                        onChange={(e) => updateField('flightsLongPerYear', Math.max(0, Number(e.target.value)))}
                        className="w-full text-center text-xs font-bold bg-[#121620] text-white py-1 rounded-lg border border-stone-600"
                      />
                      <button
                        type="button"
                        onClick={() => updateField('flightsLongPerYear', input.flightsLongPerYear + 1)}
                        className="w-7 h-7 rounded-lg bg-[#222b3b] border border-stone-600 font-bold text-white hover:bg-stone-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ЖИЛЬЕ И ЭНЕРГИЯ */}
        <div id="card-calc-housing" className="bg-[#121620] rounded-3xl p-6 border border-stone-800 hover:border-emerald-500/40 shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-950/80 text-amber-300 border border-amber-700/50 flex items-center justify-center font-bold">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">2. Жилье и энергетика</h2>
                  <p className="text-xs text-stone-400">Отопление, электроэнергия и площадь жилья</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#18202d] text-emerald-300 border border-stone-700">
                {(breakdown.housing / 1000).toFixed(2)} т CO₂
              </span>
            </div>

            <div className="space-y-5">
              {/* Число жильцов */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-stone-300 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    Количество проживающих в доме/квартире:
                  </span>
                  <span className="font-bold text-emerald-400">{input.householdMembers} чел.</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={input.householdMembers}
                  onChange={(e) => updateField('householdMembers', Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Тип жилья */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Формат жилья
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { key: 'apartment_small', label: '1-комн. кв.' },
                    { key: 'apartment_large', label: '2-3 комн. кв.' },
                    { key: 'house_medium', label: 'Дом до 150м²' },
                    { key: 'house_large', label: 'Дом 150м²+' },
                  ].map((h) => (
                    <button
                      key={h.key}
                      type="button"
                      onClick={() => updateField('homeType', h.key as HomeType)}
                      className={`px-2 py-2 rounded-xl text-xs font-semibold border text-center transition cursor-pointer ${
                        input.homeType === h.key
                          ? 'bg-emerald-400 text-stone-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-[#18202c] text-stone-300 border-stone-700/80 hover:bg-[#222a3a] hover:text-white'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Источник тепла */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Основной источник отопления</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { key: 'district', label: 'Центральное' },
                    { key: 'gas', label: 'Газовый котел' },
                    { key: 'electric', label: 'Электрическое' },
                    { key: 'biomass_clean', label: 'Пеллеты / ТН' },
                  ].map((heat) => (
                    <button
                      key={heat.key}
                      type="button"
                      onClick={() => updateField('heatingSource', heat.key as HeatingSource)}
                      className={`px-2 py-2 rounded-xl text-xs font-semibold border text-center transition cursor-pointer ${
                        input.heatingSource === heat.key
                          ? 'bg-emerald-400 text-stone-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-[#18202c] text-stone-300 border-stone-700/80 hover:bg-[#222a3a] hover:text-white'
                      }`}
                    >
                      {heat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Расход электричества */}
              <div className="pt-2 border-t border-stone-800/80">
                <div className="flex items-center justify-between text-xs font-medium text-stone-300 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Расход электроэнергии на всю семью:
                  </span>
                  <span className="font-bold text-emerald-400">{input.monthlyKwh} кВт⋅ч / мес</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="700"
                  step="10"
                  value={input.monthlyKwh}
                  onChange={(e) => updateField('monthlyKwh', Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Доля «зеленой» или солнечной энергии */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-stone-300 mb-1.5">
                  <span>Доля чистой / зеленой энергии (ВИЭ):</span>
                  <span className="font-bold text-emerald-400">{input.greenElectricityPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={input.greenElectricityPercent}
                  onChange={(e) => updateField('greenElectricityPercent', Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. ПИТАНИЕ */}
        <div id="card-calc-diet" className="bg-[#121620] rounded-3xl p-6 border border-stone-800 hover:border-emerald-500/40 shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-950/80 text-teal-300 border border-teal-700/50 flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">3. Рацион и питание</h2>
                  <p className="text-xs text-stone-400">Сельскохозяйственный след еды и пищевые отходы</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#18202d] text-emerald-300 border border-stone-700">
                {(breakdown.diet / 1000).toFixed(2)} т CO₂
              </span>
            </div>

            <div className="space-y-5">
              {/* Тип рациона */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Структура рациона питания
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: 'meat_heavy', label: 'Мясной рацион', sub: 'Мясо/птица почти каждый день' },
                    { key: 'meat_medium', label: 'Сбалансированный', sub: 'Мясо 3–4 раза в неделю' },
                    { key: 'pescatarian', label: 'Пескетарианский', sub: 'Рыба и морепродукты, без мяса' },
                    { key: 'vegetarian', label: 'Вегетарианский', sub: 'Молочные продукты и яйца, без мяса' },
                    { key: 'vegan', label: 'Растительный (веган)', sub: 'Исключительно растительная пища' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => updateField('dietType', item.key as DietType)}
                      className={`p-2.5 rounded-2xl text-left border transition cursor-pointer ${
                        input.dietType === item.key
                          ? 'bg-emerald-400 text-stone-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-[#18202c] text-stone-200 border-stone-700/80 hover:bg-[#222a3a]'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className={`text-[11px] ${input.dietType === item.key ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                        {item.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Локальные продукты */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-stone-300 mb-1.5">
                  <span>Доля местных сезонных продуктов:</span>
                  <span className="font-bold text-emerald-400">{input.localFoodPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={input.localFoodPercent}
                  onChange={(e) => updateField('localFoodPercent', Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Пищевые отходы */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Уровень выбрасывания несъеденной еды
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'low', label: 'Низкий (<5%)', desc: 'Четкое меню, всё съедается' },
                    { key: 'average', label: 'Средний (~15%)', desc: 'Иногда портится' },
                    { key: 'high', label: 'Высокий (>25%)', desc: 'Много остатков на выброс' },
                  ].map((waste) => (
                    <button
                      key={waste.key}
                      type="button"
                      onClick={() => updateField('foodWasteLevel', waste.key as WasteLevel)}
                      className={`p-2 rounded-xl text-center border transition cursor-pointer ${
                        input.foodWasteLevel === waste.key
                          ? 'bg-emerald-400 text-stone-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-[#18202c] text-stone-300 border-stone-700/80 hover:bg-[#222a3a] hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{waste.label}</div>
                      <div className={`text-[10px] truncate ${input.foodWasteLevel === waste.key ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                        {waste.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. ПОТРЕБЛЕНИЕ И ВЕЩИ */}
        <div id="card-calc-consumption" className="bg-[#121620] rounded-3xl p-6 border border-stone-800 hover:border-emerald-500/40 shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-950/80 text-sky-300 border border-sky-700/50 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">4. Потребление и отходы</h2>
                  <p className="text-xs text-stone-400">Одежда, гаджеты, сортировка и переработка</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#18202d] text-emerald-300 border border-stone-700">
                {(breakdown.consumption / 1000).toFixed(2)} т CO₂
              </span>
            </div>

            <div className="space-y-5">
              {/* Шопинг и одежда */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Интенсивность покупок новых вещей и одежды
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'minimal', label: 'Минимализм', desc: 'Только самое необходимое' },
                    { key: 'average', label: 'Умеренный', desc: 'Регулярный сезонный гардероб' },
                    { key: 'heavy', label: 'Активный', desc: 'Частые спонтанные покупки' },
                  ].map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => updateField('shoppingHabits', s.key as ShoppingHabits)}
                      className={`p-2.5 rounded-2xl text-center border transition cursor-pointer ${
                        input.shoppingHabits === s.key
                          ? 'bg-emerald-400 text-stone-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-[#18202c] text-stone-300 border-stone-700/80 hover:bg-[#222a3a] hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className={`text-[10px] mt-0.5 ${input.shoppingHabits === s.key ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                        {s.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Раздельный сбор */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>Раздельный сбор и сортировка отходов</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'none', label: 'Не сортирую', desc: 'Все в один общий бак' },
                    { key: 'basic', label: 'Базовый', desc: 'Пластик и макулатура' },
                    { key: 'thorough', label: 'Глубокий', desc: 'Стекло, батарейки, органика' },
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => updateField('recyclingRate', r.key as RecyclingRate)}
                      className={`p-2.5 rounded-2xl text-center border transition cursor-pointer ${
                        input.recyclingRate === r.key
                          ? 'bg-emerald-400 text-stone-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-[#18202c] text-stone-300 border-stone-700/80 hover:bg-[#222a3a] hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{r.label}</div>
                      <div className={`text-[10px] mt-0.5 ${input.recyclingRate === r.key ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                        {r.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Смена гаджетов */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Частота обновления смартфонов и ноутбуков
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'yearly', label: 'Каждый год-два' },
                    { key: 'two_three_years', label: 'Раз в 3–4 года' },
                    { key: 'five_plus_years', label: '5+ лет / ремонт' },
                  ].map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => updateField('deviceUpgradeFrequency', d.key as DeviceUpgradeFrequency)}
                      className={`py-2 px-1 rounded-xl text-center border text-xs font-semibold transition cursor-pointer ${
                        input.deviceUpgradeFrequency === d.key
                          ? 'bg-emerald-400 text-stone-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-[#18202c] text-stone-300 border-stone-700/80 hover:bg-[#222a3a] hover:text-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Bar to encourage looking at Dashboard */}
      <div className="bg-[#121620] text-stone-100 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-stone-800">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-base sm:text-lg text-white">
              Итоговый годовой углеродный след: <span className="text-emerald-400">{breakdown.totalTons} тонн CO₂e</span>
            </div>
            <div className="text-xs text-stone-300 mt-0.5">
              Для нейтрализации такого объема выбросов требуется вырастить около <span className="text-emerald-300 font-semibold">{breakdown.treesNeeded} взрослых деревьев</span>.
            </div>
          </div>
        </div>
        <button
          onClick={onGoToAnalytics}
          id="btn-goto-analytics-bottom"
          className="px-6 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-bold text-sm transition shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Смотреть графики и разбор</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
