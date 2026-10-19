'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { X, Sparkles, Plus, Globe } from 'lucide-react';

interface NewChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewChannelModal: React.FC<NewChannelModalProps> = ({ isOpen, onClose }) => {
  const { addChannel } = useHolding();
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [accentColor, setAccentColor] = useState('#38BDF8');
  const [shortsPerDay, setShortsPerDay] = useState(2);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !niche) return;

    addChannel({
      name,
      niche,
      audience: audience || 'Audiencia Digital Global',
      accentColor,
      shortsPerDay,
      timeSlots: ['14:00 ART', '20:00 ART'],
    });

    setName('');
    setNiche('');
    setAudience('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Globe className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Dar de Alta Nuevo Canal</h3>
              <p className="text-xs text-zinc-400">Incorporación Plug & Play al Holding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-bold mb-1">Nombre Oficial del Canal</label>
            <input
              type="text"
              required
              placeholder="ej. Sovereign Code / True Crime / AI Builders"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1">Nicho / Vertical de Negocio</label>
            <input
              type="text"
              required
              placeholder="ej. Desarrollo de Software & AI Agents B2B"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1">Audiencia Objetivo / Demografía</label>
            <input
              type="text"
              placeholder="ej. Ingenieros, Founders & Tech Leaders (Tier 1 US/UK)"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Color de Marca (Acento)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-8 w-10 rounded border border-zinc-800 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Cadencia de Shorts Diaria</label>
              <select
                value={shortsPerDay}
                onChange={(e) => setShortsPerDay(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-white"
              >
                <option value={1}>1 clip por día</option>
                <option value={2}>2 clips por día (Recomendado)</option>
                <option value={3}>3 clips por día</option>
                <option value={4}>4 clips por día</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-zinc-950 hover:from-amber-400 hover:to-amber-500 transition shadow-md shadow-amber-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Canal en Holding</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
