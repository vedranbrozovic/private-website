import React from 'react';
import {
  CharacterCustomization,
  CHARACTER_PRESETS,
  HatStyle,
  AccessoryStyle,
} from '../game/types';

interface CharacterCustomizerModalProps {
  customization: CharacterCustomization;
  onChange: (updated: CharacterCustomization) => void;
  onClose: () => void;
}

const OUTFIT_COLORS = [
  { label: 'Adriatic Blue', value: '#2563eb' },
  { label: 'Licitar Red', value: '#dc2626' },
  { label: 'Velebit Pine', value: '#15803d' },
  { label: 'Slavonian Gold', value: '#b45309' },
  { label: 'Dalmatian Navy', value: '#1e3a8a' },
  { label: 'Hvar Lavender', value: '#7c3aed' },
  { label: 'Terracotta', value: '#ea580c' },
  { label: 'Karst Slate', value: '#334155' },
];

const CLOAK_COLORS = [
  { label: 'Cravat Red', value: '#dc2626' },
  { label: 'Ducat Gold', value: '#f59e0b' },
  { label: 'Brač White', value: '#f8fafc' },
  { label: 'Plitvice Teal', value: '#0d9488' },
  { label: 'Royal Cobalt', value: '#0284c7' },
  { label: 'Obsidian', value: '#1e293b' },
];

const SKIN_TONES = [
  { label: 'Porcelain', value: '#ffe4d0' },
  { label: 'Warm Peach', value: '#ffd8be' },
  { label: 'Sunlit Olive', value: '#ebba98' },
  { label: 'Adriatic Tan', value: '#d49b72' },
  { label: 'Deep Bronze', value: '#8d5524' },
];

const HAIR_COLORS = [
  { label: 'Chestnut', value: '#4a2e1b' },
  { label: 'Raven Black', value: '#18181b' },
  { label: 'Golden Wheat', value: '#d4a359' },
  { label: 'Auburn', value: '#7c2d12' },
  { label: 'Silver Karst', value: '#cbd5e1' },
];

const HAT_OPTIONS: Array<{ id: HatStyle; label: string; icon: string }> = [
  { id: 'sestine', label: 'Šestine Hat', icon: '🎩' },
  { id: 'fedora', label: 'Explorer Hat', icon: '🤠' },
  { id: 'sailor', label: 'Sailor Cap', icon: '⚓' },
  { id: 'beanie', label: 'Alpine Beanie', icon: '🧶' },
  { id: 'crown', label: 'King Crown', icon: '👑' },
  { id: 'none', label: 'No Hat', icon: '💇' },
];

const ACCESSORY_OPTIONS: Array<{ id: AccessoryStyle; label: string; icon: string }> = [
  { id: 'staff', label: 'Hiking Staff', icon: '🦯' },
  { id: 'tambura', label: 'Tambura Lute', icon: '🪕' },
  { id: 'lantern', label: 'Warm Lantern', icon: '🏮' },
  { id: 'shield', label: 'Šahovnica Shield', icon: '🛡️' },
];

export const CharacterCustomizerModal: React.FC<CharacterCustomizerModalProps> = ({
  customization,
  onChange,
  onClose,
}) => {
  const updateField = <K extends keyof CharacterCustomization>(
    key: K,
    value: CharacterCustomization[K]
  ) => {
    onChange({
      ...customization,
      presetId: 'custom',
      [key]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 select-none">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100 flex flex-col max-h-[90vh] relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* Mini Live Avatar Badge */}
            <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center relative overflow-hidden shrink-0">
              <div
                className="w-6 h-5 rounded-t-md absolute bottom-0"
                style={{ backgroundColor: customization.outfitColor }}
              />
              <div
                className="w-7 h-1.5 rounded-full absolute bottom-4"
                style={{ backgroundColor: customization.cloakColor }}
              />
              <div
                className="w-4 h-4 rounded-full absolute top-2.5"
                style={{ backgroundColor: customization.skinTone }}
              />
              <span className="relative z-10 text-xs -mt-5">
                {HAT_OPTIONS.find(h => h.id === customization.hatStyle)?.icon}
              </span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Customize Explorer
              </h2>
              <p className="text-xs text-slate-400">
                Personalize your Croatian Odyssey traveler
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Customizer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Customizer Body */}
        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
          {/* Quick Croatian Archetype Presets */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-2">
              Regional Heritage Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CHARACTER_PRESETS.map(preset => {
                const isActive = customization.presetId === preset.presetId;
                return (
                  <button
                    key={preset.presetId}
                    onClick={() => onChange({ ...preset })}
                    className={`min-h-[44px] px-3 py-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-slate-800 border-amber-400 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border border-white/30"
                      style={{ backgroundColor: preset.outfitColor }}
                    />
                    <span className="text-xs font-bold truncate">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explorer Name Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Explorer Name
            </label>
            <input
              type="text"
              maxLength={20}
              value={customization.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder="Enter traveler name..."
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Hat / Headgear Style */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Headgear & Crown
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {HAT_OPTIONS.map(hat => {
                const isSelected = customization.hatStyle === hat.id;
                return (
                  <button
                    key={hat.id}
                    onClick={() => updateField('hatStyle', hat.id)}
                    className={`min-h-[54px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-lg">{hat.icon}</span>
                    <span className="text-[10px] font-bold text-center leading-tight">{hat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Handheld Accessory */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Traveler Gear
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ACCESSORY_OPTIONS.map(acc => {
                const isSelected = customization.accessory === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => updateField('accessory', acc.id)}
                    className={`min-h-[48px] px-3 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base">{acc.icon}</span>
                    <span className="text-xs font-bold">{acc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Outfit Tunic Color */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Tunic & Coat Color
            </label>
            <div className="flex flex-wrap gap-2.5">
              {OUTFIT_COLORS.map(c => {
                const isSelected = customization.outfitColor === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => updateField('outfitColor', c.value)}
                    title={c.label}
                    aria-label={c.label}
                    className={`w-10 h-10 rounded-xl border-2 transition-transform cursor-pointer flex items-center justify-center ${
                      isSelected ? 'border-white scale-110 shadow-lg' : 'border-slate-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                  >
                    {isSelected && <span className="text-white text-xs font-bold drop-shadow">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cravat & Scarf Color */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Croatian Cravat (Kravata) & Scarf
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CLOAK_COLORS.map(c => {
                const isSelected = customization.cloakColor === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => updateField('cloakColor', c.value)}
                    title={c.label}
                    aria-label={c.label}
                    className={`w-10 h-10 rounded-xl border-2 transition-transform cursor-pointer flex items-center justify-center ${
                      isSelected ? 'border-amber-400 scale-110 shadow-lg' : 'border-slate-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                  >
                    {isSelected && (
                      <span
                        className={`text-xs font-bold ${
                          c.value === '#f8fafc' ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skin Tone & Hair Color Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Skin Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {SKIN_TONES.map(s => {
                  const isSelected = customization.skinTone === s.value;
                  return (
                    <button
                      key={s.value}
                      onClick={() => updateField('skinTone', s.value)}
                      title={s.label}
                      aria-label={s.label}
                      className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                        isSelected ? 'border-amber-400 scale-110' : 'border-slate-700'
                      }`}
                      style={{ backgroundColor: s.value }}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Hair Color
              </label>
              <div className="flex flex-wrap gap-2">
                {HAIR_COLORS.map(h => {
                  const isSelected = customization.hairColor === h.value;
                  return (
                    <button
                      key={h.value}
                      onClick={() => updateField('hairColor', h.value)}
                      title={h.label}
                      aria-label={h.label}
                      className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                        isSelected ? 'border-amber-400 scale-110' : 'border-slate-700'
                      }`}
                      style={{ backgroundColor: h.value }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Confirm */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            Save & Apply Look
          </button>
        </div>
      </div>
    </div>
  );
};
