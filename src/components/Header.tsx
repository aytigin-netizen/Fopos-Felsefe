import React from 'react';
import { TabType } from '../types/philosophy';
import { Sparkles, MonitorPlay, QrCode } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenClassroomMode: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenClassroomMode,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold text-lg">
            Φ
          </div>
          <button
            onClick={() => setActiveTab('experiments')}
            className="text-left group cursor-pointer"
          >
            <span className="text-xl font-bold font-display tracking-tight text-amber-100 group-hover:text-amber-300 transition-colors whitespace-nowrap">
              FOPOS
            </span>
          </button>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('experiments')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'experiments'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Düşünce Deneyleri
          </button>

          <button
            onClick={() => setActiveTab('socratic')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'socratic'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Sokratik Diyalog
          </button>

          <button
            onClick={() => setActiveTab('argument')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'argument'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Argüman Haritası
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'curriculum'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            TYMM Müfredat
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'rubric'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Ölçme Rubrikleri
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer border border-stone-700/60"
            title="Okulda Akıllı Tahtada Aç ve Paylaşım Rehberi (QR Kod)"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Okulda Aç & QR</span>
            <span className="sm:hidden">QR</span>
          </button>

          <button
            onClick={onOpenClassroomMode}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Akıllı Tahta & Sınıf Tartışma Modu"
          >
            <MonitorPlay className="w-4 h-4 text-stone-900" />
            <span className="hidden sm:inline">Akıllı Tahta Modu</span>
            <span className="sm:hidden">Tahta</span>
          </button>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-stone-800 bg-stone-950/80 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('experiments')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeTab === 'experiments' ? 'text-amber-400 font-bold' : 'text-stone-400'
          }`}
        >
          Deneyler
        </button>
        <button
          onClick={() => setActiveTab('socratic')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeTab === 'socratic' ? 'text-amber-400 font-bold' : 'text-stone-400'
          }`}
        >
          Sokratik
        </button>
        <button
          onClick={() => setActiveTab('argument')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeTab === 'argument' ? 'text-amber-400 font-bold' : 'text-stone-400'
          }`}
        >
          Harita
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeTab === 'curriculum' ? 'text-amber-400 font-bold' : 'text-stone-400'
          }`}
        >
          TYMM
        </button>
        <button
          onClick={() => setActiveTab('rubric')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeTab === 'rubric' ? 'text-amber-400 font-bold' : 'text-stone-400'
          }`}
        >
          Rubrikler
        </button>
        <button
          onClick={() => setActiveTab('arena')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeTab === 'arena' ? 'text-amber-400 font-bold' : 'text-stone-400'
          }`}
        >
          Arena
        </button>
      </div>
    </header>
  );
};
