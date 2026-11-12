import React, { useState } from 'react';
import { Award, Printer, CheckCircle2, FileText, UserCheck, Calculator, RefreshCw } from 'lucide-react';

export const TymmRubrics: React.FC = () => {
  const [activeRubric, setActiveRubric] = useState<'review' | 'writing'>('review');
  const [studentName, setStudentName] = useState<string>('');
  const [studentNo, setStudentNo] = useState<string>('');
  const [teacherComment, setTeacherComment] = useState<string>('');

  // EK 1: Felsefi Metin İnceleme Rubrik Puanları (Max 100)
  const [reviewScores, setReviewScores] = useState<{
    concepts: number;
    problem: number;
    arguments: number;
    premises: number;
    criticism: number;
  }>({
    concepts: 14,
    problem: 14,
    arguments: 28,
    premises: 20,
    criticism: 10
  });

  // EK 2: Felsefi Metin Yazımı Rubrik Puanları (Max 100)
  const [writingScores, setWritingScores] = useState<{
    problem: number;
    concepts: number;
    argument: number;
    grounding: number;
    terminology: number;
    language: number;
    integrity: number;
  }>({
    problem: 14,
    concepts: 14,
    argument: 14,
    grounding: 14,
    terminology: 14,
    language: 8,
    integrity: 8
  });

  const totalReviewScore =
    reviewScores.concepts +
    reviewScores.problem +
    reviewScores.arguments +
    reviewScores.premises +
    reviewScores.criticism;

  const totalWritingScore =
    writingScores.problem +
    writingScores.concepts +
    writingScores.argument +
    writingScores.grounding +
    writingScores.terminology +
    writingScores.language +
    writingScores.integrity;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <span>MEB Türkiye Yüzyılı Maarif Modeli</span>
              <span aria-hidden="true">·</span>
              <span>Resmî Program Ekleri (Ek 1 & Ek 2)</span>
              <span aria-hidden="true">·</span>
              <span>Süreç & Ürün Odaklı Performans Değerlendirme</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tracking-tight">
              TYMM Felsefe Ölçme & Değerlendirme Rubrikleri
            </h1>
            <p className="mt-1 text-sm text-stone-600 max-w-3xl">
              Öğretim programında zorunlu kılınan 100 puanlık Felsefi Metin İnceleme ve Felsefi Metin Yazımı dereceli puanlama anahtarlarını dijital olarak doldurun, puanlayın ve yazdırılabilir form çıktısı alın.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Formu Yazdır / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Rubric Tab Switcher */}
      <div className="flex items-center gap-2 p-1 bg-stone-200 rounded-lg text-xs font-semibold max-w-md">
        <button
          onClick={() => setActiveRubric('review')}
          className={`flex-1 py-2 text-center rounded-md transition-colors cursor-pointer ${
            activeRubric === 'review'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          EK 1: Felsefi Metin İnceleme Formu (10. Sınıf)
        </button>
        <button
          onClick={() => setActiveRubric('writing')}
          className={`flex-1 py-2 text-center rounded-md transition-colors cursor-pointer ${
            activeRubric === 'writing'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          EK 2: Felsefi Metin Yazımı Formu (11. Sınıf)
        </button>
      </div>

      {/* Student Details Strip */}
      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="font-semibold text-stone-600 block mb-1">Öğrenci Adı Soyadı:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Örn: Ayşe Yılmaz"
            className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="font-semibold text-stone-600 block mb-1">Sınıfı ve Numarası:</label>
          <input
            type="text"
            value={studentNo}
            onChange={(e) => setStudentNo(e.target.value)}
            placeholder="Örn: 10-A / 452"
            className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="flex items-end justify-between bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/60">
          <div>
            <span className="text-[11px] text-amber-900 font-medium block">Toplam Performans Notu:</span>
            <span className="text-2xl font-mono font-bold text-amber-950">
              {activeRubric === 'review' ? totalReviewScore : totalWritingScore} / 100
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-900 font-bold rounded">
            {(activeRubric === 'review' ? totalReviewScore : totalWritingScore) >= 85
              ? 'Çok İyi'
              : (activeRubric === 'review' ? totalReviewScore : totalWritingScore) >= 70
              ? 'İyi'
              : (activeRubric === 'review' ? totalReviewScore : totalWritingScore) >= 50
              ? 'Kabul Edilebilir'
              : 'Geliştirilebilir'}
          </span>
        </div>
      </div>

      {/* 1. EK 1: METİN İNCELEME DERECELİ PUANLAMA ANAHTARI */}
      {activeRubric === 'review' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between">
            <h2 className="text-sm font-display font-bold">
              FELSEFİ METİN İNCELEME PERFORMANS GÖREVİ DERECELİ PUANLAMA ANAHTARI (EK 1)
            </h2>
            <span className="text-xs font-mono text-amber-400">Toplam: 100 Puan</span>
          </div>

          <div className="divide-y divide-stone-200 text-xs">
            {/* Criteria 1 */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">
                  1. Felsefi Kavramların Belirlenmesi (Maks. 16 Puan)
                </span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {reviewScores.concepts} Puan
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { lvl: 1, label: 'Geliştirilebilir (1-4 p)', desc: 'Belirlenen kavramlar felsefi değildir.', val: 4 },
                  { lvl: 2, label: 'Kabul edilebilir (5-8 p)', desc: 'Belirlenen kavramların bir kısmı felsefidir.', val: 8 },
                  { lvl: 3, label: 'İyi (9-12 p)', desc: 'Belirlenen kavramların çoğu felsefidir.', val: 12 },
                  { lvl: 4, label: 'Çok iyi (13-16 p)', desc: 'Belirlenen kavramlar metnin felsefi görüşünün ana kavramlarıdır.', val: 16 }
                ].map((item) => (
                  <button
                    key={item.lvl}
                    onClick={() => setReviewScores((s) => ({ ...s, concepts: item.val }))}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      reviewScores.concepts === item.val
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="block font-bold text-[11px] mb-0.5">{item.label}</span>
                    <span className="text-[11px] text-stone-600 leading-tight block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Criteria 2 */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">
                  2. Felsefi Problemin Belirlenmesi (Maks. 16 Puan)
                </span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {reviewScores.problem} Puan
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { lvl: 1, label: 'Geliştirilebilir (1-4 p)', desc: 'Felsefi problem belirlenememiştir.', val: 4 },
                  { lvl: 2, label: 'Kabul edilebilir (5-8 p)', desc: 'Felsefi problem kısmen ifade edilmiştir.', val: 8 },
                  { lvl: 3, label: 'İyi (9-12 p)', desc: 'Felsefi problem doğru ifade edilmiştir.', val: 12 },
                  { lvl: 4, label: 'Çok iyi (13-16 p)', desc: 'Felsefi problem literatüre uygun ifade edilmiştir.', val: 16 }
                ].map((item) => (
                  <button
                    key={item.lvl}
                    onClick={() => setReviewScores((s) => ({ ...s, problem: item.val }))}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      reviewScores.problem === item.val
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="block font-bold text-[11px] mb-0.5">{item.label}</span>
                    <span className="text-[11px] text-stone-600 leading-tight block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Criteria 3 */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">
                  3. Argümanların Bulunması (Maks. 32 Puan)
                </span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {reviewScores.arguments} Puan
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { lvl: 1, label: 'Geliştirilebilir (1-7 p)', desc: 'Akıl yürütme ve argümanlar bulunamamıştır.', val: 7 },
                  { lvl: 2, label: 'Kabul edilebilir (8-15 p)', desc: 'Akıl yürütme ve argümanlar kısmen bulunmuştur.', val: 15 },
                  { lvl: 3, label: 'İyi (16-24 p)', desc: 'Akıl yürütme ve argümanların çoğu bulunmuştur.', val: 24 },
                  { lvl: 4, label: 'Çok iyi (24-32 p)', desc: 'Akıl yürütme ve argümanların hepsi bulunmuştur.', val: 32 }
                ].map((item) => (
                  <button
                    key={item.lvl}
                    onClick={() => setReviewScores((s) => ({ ...s, arguments: item.val }))}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      reviewScores.arguments === item.val
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="block font-bold text-[11px] mb-0.5">{item.label}</span>
                    <span className="text-[11px] text-stone-600 leading-tight block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Criteria 4 */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">
                  4. Argümanların Gerekçelerinin Gösterilmesi (Maks. 24 Puan)
                </span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {reviewScores.premises} Puan
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { lvl: 1, label: 'Geliştirilebilir (1-6 p)', desc: 'Argümanların öncül ve sonuçları gösterilememiştir.', val: 6 },
                  { lvl: 2, label: 'Kabul edilebilir (6-12 p)', desc: 'Argümanların öncül ve sonuçları kısmen gösterilmiştir.', val: 12 },
                  { lvl: 3, label: 'İyi (12-18 p)', desc: 'Argümanların öncül ve sonuçlarının çoğu gösterilmiştir.', val: 18 },
                  { lvl: 4, label: 'Çok iyi (18-24 p)', desc: 'Argümanların öncül ve sonuçlarının hepsi gösterilmiştir.', val: 24 }
                ].map((item) => (
                  <button
                    key={item.lvl}
                    onClick={() => setReviewScores((s) => ({ ...s, premises: item.val }))}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      reviewScores.premises === item.val
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="block font-bold text-[11px] mb-0.5">{item.label}</span>
                    <span className="text-[11px] text-stone-600 leading-tight block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Criteria 5 */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">
                  5. Savunulan Felsefi Görüşün Eleştirilmesi (Maks. 12 Puan)
                </span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {reviewScores.criticism} Puan
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { lvl: 1, label: 'Geliştirilebilir (1 p)', desc: 'Savunulan felsefi görüş eleştirilememiştir.', val: 1 },
                  { lvl: 2, label: 'Kabul edilebilir (2-4 p)', desc: 'Savunulan felsefi görüş kısmen eleştirilmiştir.', val: 4 },
                  { lvl: 3, label: 'İyi (5-7 p)', desc: 'Savunulan felsefi görüş doğru eleştirilmiştir.', val: 7 },
                  { lvl: 4, label: 'Çok iyi (8-12 p)', desc: 'Savunulan felsefi görüş literatüre uygun eleştirilmiştir.', val: 12 }
                ].map((item) => (
                  <button
                    key={item.lvl}
                    onClick={() => setReviewScores((s) => ({ ...s, criticism: item.val }))}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      reviewScores.criticism === item.val
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="block font-bold text-[11px] mb-0.5">{item.label}</span>
                    <span className="text-[11px] text-stone-600 leading-tight block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. EK 2: METİN YAZIMI DERECELİ PUANLAMA ANAHTARI */}
      {activeRubric === 'writing' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between">
            <h2 className="text-sm font-display font-bold">
              FELSEFİ METİN YAZIMI PERFORMANS GÖREVİ DERECELİ PUANLAMA ANAHTARI (EK 2)
            </h2>
            <span className="text-xs font-mono text-amber-400">Toplam: 100 Puan</span>
          </div>

          <div className="divide-y divide-stone-200 text-xs">
            {[
              {
                id: 'problem',
                title: 'Problemin Tanımlanması (16 Puan)',
                max: 16,
                current: writingScores.problem,
                options: [
                  { label: 'Geliştirilebilir (1-4 p)', desc: 'Problem tanımlanamamıştır.', val: 4 },
                  { label: 'Kabul edilebilir (5-8 p)', desc: 'Problem belli bir düzeyde tanımlanmıştır.', val: 8 },
                  { label: 'İyi (9-12 p)', desc: 'Problem anlaşılır bir biçimde tanımlanmıştır.', val: 12 },
                  { label: 'Çok iyi (13-16 p)', desc: 'Problem tam olarak tanımlanmıştır.', val: 16 }
                ],
                setter: (val: number) => setWritingScores((s) => ({ ...s, problem: val }))
              },
              {
                id: 'concepts',
                title: 'Kavramların Yansıtılması (16 Puan)',
                max: 16,
                current: writingScores.concepts,
                options: [
                  { label: 'Geliştirilebilir (1-4 p)', desc: 'Belirlenen kavramlar problemi yansıtmamaktadır.', val: 4 },
                  { label: 'Kabul edilebilir (5-8 p)', desc: 'Belirlenen kavramlar problemin bir kısmını yansıtmaktadır.', val: 8 },
                  { label: 'İyi (9-12 p)', desc: 'Belirlenen kavramlar problemin çoğunu yansıtmaktadır.', val: 12 },
                  { label: 'Çok iyi (13-16 p)', desc: 'Belirlenen kavramlar problemin tamamını yansıtmaktadır.', val: 16 }
                ],
                setter: (val: number) => setWritingScores((s) => ({ ...s, concepts: val }))
              },
              {
                id: 'argument',
                title: 'Argümanın Ortaya Konması (16 Puan)',
                max: 16,
                current: writingScores.argument,
                options: [
                  { label: 'Geliştirilebilir (1-4 p)', desc: 'Argüman ortaya konmamıştır.', val: 4 },
                  { label: 'Kabul edilebilir (5-8 p)', desc: 'Argüman kısmen ortaya konmuştur.', val: 8 },
                  { label: 'İyi (9-12 p)', desc: 'Argüman iyi bir şekilde ortaya konmuştur.', val: 12 },
                  { label: 'Çok iyi (13-16 p)', desc: 'Argüman tam olarak ortaya konmuştur.', val: 16 }
                ],
                setter: (val: number) => setWritingScores((s) => ({ ...s, argument: val }))
              },
              {
                id: 'grounding',
                title: 'Temellendirmenin Yapılması (16 Puan)',
                max: 16,
                current: writingScores.grounding,
                options: [
                  { label: 'Geliştirilebilir (1-4 p)', desc: 'Gerekçeleri ile temellendirme yapılmamıştır.', val: 4 },
                  { label: 'Kabul edilebilir (5-8 p)', desc: 'Temellendirme kısmen gerekçelendirilmiştir.', val: 8 },
                  { label: 'İyi (9-12 p)', desc: 'Temellendirmenin çoğu gerekçelendirilmiştir.', val: 12 },
                  { label: 'Çok iyi (13-16 p)', desc: 'Temellendirme tam olarak gerekçelendirilmiştir.', val: 16 }
                ],
                setter: (val: number) => setWritingScores((s) => ({ ...s, grounding: val }))
              },
              {
                id: 'terminology',
                title: 'Felsefi Terminolojinin Yansıtılması (16 Puan)',
                max: 16,
                current: writingScores.terminology,
                options: [
                  { label: 'Geliştirilebilir (1-4 p)', desc: 'Felsefi terminoloji yansıtılamamıştır.', val: 4 },
                  { label: 'Kabul edilebilir (5-8 p)', desc: 'Felsefi terminoloji kısmen yansıtılmıştır.', val: 8 },
                  { label: 'İyi (9-12 p)', desc: 'Felsefi terminolojinin çoğu yansıtılmıştır.', val: 12 },
                  { label: 'Çok iyi (13-16 p)', desc: 'Felsefi terminoloji tam olarak yansıtılmıştır.', val: 16 }
                ],
                setter: (val: number) => setWritingScores((s) => ({ ...s, terminology: val }))
              },
              {
                id: 'language',
                title: 'Dilin Etkili Kullanılması (10 Puan)',
                max: 10,
                current: writingScores.language,
                options: [
                  { label: 'Geliştirilebilir (1 p)', desc: 'Dil etkili kullanılmamıştır.', val: 1 },
                  { label: 'Kabul edilebilir (2-4 p)', desc: 'Dil kısmen etkili kullanılmıştır.', val: 4 },
                  { label: 'İyi (5-7 p)', desc: 'Dil genellikle etkili kullanılmıştır.', val: 7 },
                  { label: 'Çok iyi (8-10 p)', desc: 'Dil etkili kullanılmıştır.', val: 10 }
                ],
                setter: (val: number) => setWritingScores((s) => ({ ...s, language: val }))
              },
              {
                id: 'integrity',
                title: 'Metnin Bütünlüğünün Sağlanması (10 Puan)',
                max: 10,
                current: writingScores.integrity,
                options: [
                  { label: 'Geliştirilebilir (1 p)', desc: 'Metnin bütünlüğü sağlanmamıştır.', val: 1 },
                  { label: 'Kabul edilebilir (2-4 p)', desc: 'Metnin bütünlüğü kısmen sağlanmıştır.', val: 4 },
                  { label: 'İyi (5-7 p)', desc: 'Metnin bütünlüğünün çoğu sağlanmıştır.', val: 7 },
                  { label: 'Çok iyi (8-10 p)', desc: 'Metnin bütünlüğü tam olarak sağlanmıştır.', val: 10 }
                ],
                setter: (val: number) => setWritingScores((s) => ({ ...s, integrity: val }))
              }
            ].map((section) => (
              <div key={section.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{section.title}</span>
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {section.current} Puan
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {section.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => section.setter(opt.val)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        section.current === opt.val
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="block font-bold text-[11px] mb-0.5">{opt.label}</span>
                      <span className="text-[11px] text-stone-600 leading-tight block">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teacher Evaluation Comment Box */}
      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2 text-xs">
        <label className="font-bold text-stone-800 block">Öğretmen Değerlendirme Yorumu & Geri Bildirimi:</label>
        <textarea
          rows={3}
          value={teacherComment}
          onChange={(e) => setTeacherComment(e.target.value)}
          placeholder="Öğrencinin felsefi akıl yürütme becerisi, güçlü ve gelişmeye açık yönleri hakkında pedagojik geri bildirim yazın..."
          className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs sm:text-sm"
        />
      </div>
    </div>
  );
};
