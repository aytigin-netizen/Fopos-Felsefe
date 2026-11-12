import React, { useState } from 'react';
import { TabType } from './types/philosophy';
import { Header } from './components/Header';
import { ThoughtExperimentsLab } from './components/ThoughtExperimentsLab';
import { SocraticArena } from './components/SocraticArena';
import { ArgumentMapper } from './components/ArgumentMapper';
import { CurriculumStudio } from './components/CurriculumStudio';
import { ConceptArena } from './components/ConceptArena';
import { TymmRubrics } from './components/TymmRubrics';
import { ClassroomPresentationModal } from './components/ClassroomPresentationModal';
import { SmartboardGuideModal } from './components/SmartboardGuideModal';
import { StudentJoinView } from './components/StudentJoinView';
import { Compass, Sparkles, BookOpen, MonitorPlay, MessageSquare, Layers, Award, QrCode } from 'lucide-react';

export default function App() {
  const joinMatch = typeof window !== 'undefined' ? window.location.pathname.match(/^\/join\/([A-Za-z0-9]+)$/) : null;
  const [activeTab, setActiveTab] = useState<TabType>('experiments');
  const [isClassroomModeOpen, setIsClassroomModeOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  if (joinMatch) return <StudentJoinView sessionCode={joinMatch[1]} />;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenClassroomMode={() => setIsClassroomModeOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Editorial Sub-Hero Banner (Visible on all tabs to establish FOPOS identity) */}
        <section className="relative overflow-hidden rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 shadow-sm">
          <div className="absolute inset-0">
            <img
              src="/assets/images/fopos_hero_agora_1794482207191.jpg"
              alt="Atina Agorası ve Felsefe Akademisi"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
          </div>

          <div className="relative p-6 sm:p-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span className="tracking-widest uppercase">FOPOS · TYMM 2026</span>
              <span aria-hidden="true">·</span>
              <span>Türkiye Yüzyılı Maarif Modeli Felsefe Platformu</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
              Felsefe Dersini Aktif Bir Soruşturma Alanına Dönüştürün
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              FOPOS; yeni uygulanan Türkiye Yüzyılı Maarif Modeli (TYMM) Felsefe Dersi Öğretim Programı ile tam uyumludur. 10. sınıf temel felsefe alanları ile 11. sınıf çağdaş tematik ünitelerini (Çevre, Teknoloji, Akıl-İnanç, Edebiyat, Hayatın Anlamı, Hukuk) canlı düşünce deneyleri, Sokratik elenkhos ve resmî ölçme rubrikleriyle destekler.
            </p>

            {/* Quick Feature Jump Pill-less Controls */}
            <div className="flex items-center gap-2 pt-2 flex-wrap text-xs">
              <button
                onClick={() => setActiveTab('experiments')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'experiments'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'bg-stone-800/80 hover:bg-stone-800 text-stone-200'
                }`}
              >
                Düşünce Deneyleri
              </button>
              <button
                onClick={() => setActiveTab('socratic')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'socratic'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'bg-stone-800/80 hover:bg-stone-800 text-stone-200'
                }`}
              >
                Sokratik Diyalog
              </button>
              <button
                onClick={() => setActiveTab('argument')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'argument'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'bg-stone-800/80 hover:bg-stone-800 text-stone-200'
                }`}
              >
                Argüman Haritası
              </button>
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'curriculum'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'bg-stone-800/80 hover:bg-stone-800 text-stone-200'
                }`}
              >
                TYMM Müfredat & Plan
              </button>
              <button
                onClick={() => setActiveTab('rubric')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'rubric'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'bg-stone-800/80 hover:bg-stone-800 text-stone-200'
                }`}
              >
                Ölçme Rubrikleri (Ek 1 & 2)
              </button>
              <button
                onClick={() => setActiveTab('arena')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'arena'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'bg-stone-800/80 hover:bg-stone-800 text-stone-200'
                }`}
              >
                Kavram Arenası
              </button>

              <button
                onClick={() => setIsGuideOpen(true)}
                className="px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 flex items-center gap-1.5"
                title="Akıllı Tahtada Açma ve Paylaşım Kılavuzu"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Okulda / Tahtada Aç (QR)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab Modules */}
        <section className="transition-opacity duration-300">
          {activeTab === 'experiments' && <ThoughtExperimentsLab />}
          {activeTab === 'socratic' && <SocraticArena />}
          {activeTab === 'argument' && <ArgumentMapper />}
          {activeTab === 'curriculum' && <CurriculumStudio />}
          {activeTab === 'rubric' && <TymmRubrics />}
          {activeTab === 'arena' && <ConceptArena />}
        </section>
      </main>

      {/* Classroom Smartboard Fullscreen Modal */}
      <ClassroomPresentationModal
        isOpen={isClassroomModeOpen}
        onClose={() => setIsClassroomModeOpen(false)}
      />

      {/* Smartboard & School Access Guide Modal with QR Code */}
      <SmartboardGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenClassroomMode={() => setIsClassroomModeOpen(true)}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-stone-200 bg-white mt-16 text-stone-500 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-stone-800 text-sm">FOPOS</span>
            <span aria-hidden="true">·</span>
            <span>T.C. MEB Türkiye Yüzyılı Maarif Modeli (TYMM) Felsefe Platformu</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-500">
            <span>SBAB13 / SBAB14 / SBAB15 Alan Becerileri</span>
            <span aria-hidden="true">·</span>
            <span>10. ve 11. Sınıf Öğretim Programı</span>
            <span aria-hidden="true">·</span>
            <span>P4C Soruşturma Çemberi</span>
            <span aria-hidden="true">·</span>
            <span>Resmî Dereceli Puanlama Anahtarları</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
