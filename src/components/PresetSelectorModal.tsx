import React from 'react';
import { PRESETS } from '../data/initialData';
import { FootprintInput } from '../types';
import { Sparkles, User, Leaf, PlaneTakeoff } from 'lucide-react';

interface PresetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (input: FootprintInput) => void;
}

export const PresetSelectorModal: React.FC<PresetSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const presetIcons: Record<string, any> = {
    average_urban: User,
    eco_conscious: Leaf,
    commuter_heavy: PlaneTakeoff,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-['Space_Grotesk']">
                Выберите профиль для сравнения
              </h3>
              <p className="text-xs text-stone-500">Быстрая загрузка готовых сценариев жизни</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {Object.entries(PRESETS).map(([key, item]) => {
            const Icon = presetIcons[key] || User;
            return (
              <button
                key={key}
                onClick={() => {
                  onSelectPreset(item.input);
                  onClose();
                }}
                className="w-full text-left p-4 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition cursor-pointer flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-100 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center shrink-0 transition">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-950">
                    {item.label}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
