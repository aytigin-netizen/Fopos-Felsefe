import { ApiSource, CurriculumTopic, FallbackReason, GeneratedLessonPlan, SavedLessonPlan } from '../types/philosophy';

export interface LessonPlanExportPayload {
  grade: string;
  unit: string;
  topicTitle: string;
  code: string;
  fieldSkills: string;
  enrichment?: string;
  support?: string;
  source?: ApiSource | null;
  fallbackReason?: FallbackReason | null;
  savedAt?: string;
  plan: GeneratedLessonPlan;
}

function getSourceLabel(source?: ApiSource | null, fallbackReason?: FallbackReason | null): string {
  if (source === 'gemini') return 'Canlı Gemini Yapay Zekâ Üretimi';
  if (fallbackReason === 'timeout') return 'Yerel Yedek Şablon (Zaman aşımı)';
  if (fallbackReason === 'api_error') return 'Yerel Yedek Şablon (API hatası)';
  return 'Yerel Yedek Şablon';
}

function slugifyCode(code: string): string {
  return (code || 'tymm-ders-plani')
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/gi, '-')
    .replace(/^-|-$/g, '');
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function buildLessonPlanMarkdown(payload: LessonPlanExportPayload): string {
  const { grade, unit, topicTitle, code, fieldSkills, enrichment, support, source, fallbackReason, savedAt, plan } = payload;
  const dateStr = savedAt
    ? new Date(savedAt).toLocaleString('tr-TR')
    : new Date().toLocaleString('tr-TR');

  const lines: string[] = [
    `# ${plan.title}`,
    '',
    `> **FOPOS · Türkiye Yüzyılı Maarif Modeli (TYMM 2026) Felsefe Dersi Planı**`,
    '',
    '| Bilgi Alanı | Detay |',
    '| :--- | :--- |',
    `| **Sınıf Düzeyi** | ${grade} |`,
    `| **Ünite** | ${unit} |`,
    `| **Konu** | ${topicTitle} |`,
    `| **Kazanım Kodu** | \`${code}\` |`,
    `| **Alan Becerisi** | ${fieldSkills} |`,
    `| **Süre** | 40 Dakika |`,
    `| **Üretim Kaynağı** | ${getSourceLabel(source, fallbackReason)} |`,
    `| **Tarih** | ${dateStr} |`,
    '',
    '---',
    '',
    '## 1. Planlanan Öğrenme Çıktıları',
    ...(plan.learningOutcomes?.length
      ? plan.learningOutcomes.map((o) => `- ${o}`)
      : ['- İlgili TYMM öğrenme çıktıları doğrultusunda felsefi muhakeme yürütür.']),
    '',
    '## 2. Uyarıcı Materyal / Açılış Vakası',
    `> ${plan.stimulusMaterial}`,
    '',
    '## 3. Ders Akış Etapları (40 Dakika)',
    '',
    '| Etap | Sınıf İçi Etkinlik | Öğretmen Rolü |',
    '| :--- | :--- | :--- |',
    ...(plan.stages || []).map(
      (s) => `| **${s.phase.replace(/\|/g, '/')}** | ${s.activity.replace(/\|/g, '/')} | ${s.role.replace(/\|/g, '/')} |`
    ),
    '',
    '## 4. Yönlendirici Sokratik Soruşturma Soruları',
    ...(plan.inquiryQuestions || []).map((q, idx) => `${idx + 1}. ${q}`),
    '',
  ];

  if (plan.commonFallaciesToWatch?.length) {
    lines.push(
      '## 5. Sınıfta İzlenecek Olası Mantık Safsataları',
      ...plan.commonFallaciesToWatch.map((f) => `- ${f}`),
      ''
    );
  }

  if (enrichment || support) {
    lines.push('## 6. Farklılaştırma (TYMM)');
    if (enrichment) lines.push(`- **Zenginleştirme:** ${enrichment}`);
    if (support) lines.push(`- **Destekleme:** ${support}`);
    lines.push('');
  }

  if (plan.reflectionPrompt) {
    lines.push('## 7. Ders Sonu Öz-Değerlendirme', `_${plan.reflectionPrompt}_`, '');
  }

  return lines.join('\n');
}

export function exportLessonPlanMarkdown(payload: LessonPlanExportPayload): void {
  const md = buildLessonPlanMarkdown(payload);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  triggerBlobDownload(blob, `ders-plani-${slugifyCode(payload.code)}.md`);
}

export async function exportLessonPlanPdf(payload: LessonPlanExportPayload): Promise<void> {
  const pdfMakeModule = await import('pdfmake/build/pdfmake');
  const vfsFontsModule = await import('pdfmake/build/vfs_fonts');

  const pdfMake = (pdfMakeModule.default || pdfMakeModule) as any;
  const vfsFonts = (vfsFontsModule.default || vfsFontsModule) as any;

  if (typeof pdfMake.addVirtualFileSystem === 'function') {
    pdfMake.addVirtualFileSystem(vfsFonts);
  } else {
    pdfMake.vfs = vfsFonts;
  }

  const { grade, unit, topicTitle, code, fieldSkills, enrichment, support, source, fallbackReason, savedAt, plan } = payload;
  const dateStr = savedAt
    ? new Date(savedAt).toLocaleString('tr-TR')
    : new Date().toLocaleString('tr-TR');

  const content: any[] = [
    {
      table: {
        widths: ['*'],
        body: [
          [
            {
              stack: [
                {
                  text: 'FOPOS · TÜRKİYE YÜZYILI MAARİF MODELİ (TYMM) DERS PLANI',
                  fontSize: 9,
                  bold: true,
                  color: '#FCD34D',
                  margin: [0, 0, 0, 4],
                },
                {
                  text: plan.title,
                  fontSize: 15,
                  bold: true,
                  color: '#FFFFFF',
                },
              ],
              fillColor: '#1C1917',
              margin: [12, 10, 12, 10],
            },
          ],
        ],
      },
      layout: 'noBorders',
      margin: [0, 0, 0, 12],
    },
    {
      table: {
        widths: [110, '*'],
        body: [
          [{ text: 'Sınıf / Ünite', bold: true, color: '#44403C' }, `${grade} · ${unit}`],
          [{ text: 'Konu & Kod', bold: true, color: '#44403C' }, `${topicTitle} (${code})`],
          [{ text: 'Alan Becerisi', bold: true, color: '#44403C' }, fieldSkills],
          [{ text: 'Süre & Kaynak', bold: true, color: '#44403C' }, `40 Dakika · ${getSourceLabel(source, fallbackReason)}`],
          [{ text: 'Tarih', bold: true, color: '#44403C' }, dateStr],
        ],
      },
      layout: 'lightHorizontalLines',
      fontSize: 9.5,
      margin: [0, 0, 0, 14],
    },
    { text: '1. Planlanan Öğrenme Çıktıları', style: 'sectionHeading' },
    {
      ul: plan.learningOutcomes?.length
        ? plan.learningOutcomes
        : ['İlgili TYMM öğrenme çıktıları doğrultusunda felsefi muhakeme yürütür.'],
      fontSize: 10,
      margin: [0, 0, 0, 12],
    },
    { text: '2. Uyarıcı Materyal / Açılış Vakası', style: 'sectionHeading' },
    {
      table: {
        widths: ['*'],
        body: [
          [
            {
              text: plan.stimulusMaterial,
              italics: true,
              fontSize: 10,
              color: '#292524',
              fillColor: '#FFFBEB',
              margin: [10, 8, 10, 8],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0.8,
        vLineWidth: () => 0.8,
        hLineColor: () => '#FDE68A',
        vLineColor: () => '#FDE68A',
      },
      margin: [0, 0, 0, 14],
    },
    { text: '3. Ders Akış Etapları (40 Dakika)', style: 'sectionHeading' },
    {
      table: {
        headerRows: 1,
        widths: [115, '*', 110],
        body: [
          [
            { text: 'Etap', bold: true, color: '#FFFFFF', fillColor: '#292524' },
            { text: 'Sınıf İçi Etkinlik', bold: true, color: '#FFFFFF', fillColor: '#292524' },
            { text: 'Öğretmen Rolü', bold: true, color: '#FFFFFF', fillColor: '#292524' },
          ],
          ...(plan.stages || []).map((s) => [
            { text: s.phase, bold: true, fontSize: 9.5, color: '#92400E' },
            { text: s.activity, fontSize: 9.5 },
            { text: s.role, fontSize: 9, color: '#57534E' },
          ]),
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 14],
    },
    { text: '4. Yönlendirici Sokratik Soruşturma Soruları', style: 'sectionHeading' },
    {
      ol: plan.inquiryQuestions || [],
      fontSize: 10,
      margin: [0, 0, 0, 12],
    },
  ];

  if (plan.commonFallaciesToWatch?.length) {
    content.push(
      { text: '5. Sınıfta İzlenecek Olası Mantık Safsataları', style: 'sectionHeading' },
      { ul: plan.commonFallaciesToWatch, fontSize: 9.5, margin: [0, 0, 0, 12] }
    );
  }

  if (enrichment || support) {
    content.push({ text: '6. Farklılaştırma (Zenginleştirme ve Destekleme)', style: 'sectionHeading' });
    const diffItems: any[] = [];
    if (enrichment) diffItems.push({ text: [{ text: 'Zenginleştirme: ', bold: true }, enrichment] });
    if (support) diffItems.push({ text: [{ text: 'Destekleme: ', bold: true }, support] });
    content.push({ ul: diffItems, fontSize: 9.5, margin: [0, 0, 0, 12] });
  }

  if (plan.reflectionPrompt) {
    content.push(
      { text: '7. Ders Sonu Öz-Değerlendirme', style: 'sectionHeading' },
      { text: plan.reflectionPrompt, italics: true, fontSize: 10, color: '#44403C' }
    );
  }

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [36, 36, 36, 40],
    content,
    styles: {
      sectionHeading: {
        fontSize: 11.5,
        bold: true,
        color: '#92400E',
        margin: [0, 4, 0, 6],
      },
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `FOPOS · TYMM Felsefe Öğretim Platformu   |   Sayfa ${currentPage} / ${pageCount}`,
      alignment: 'center',
      fontSize: 8,
      color: '#78716C',
      margin: [0, 10, 0, 0],
    }),
  };

  const pdfDoc = pdfMake.createPdf(docDefinition);
  const blob: Blob = await pdfDoc.getBlob();
  triggerBlobDownload(blob, `ders-plani-${slugifyCode(code)}.pdf`);
}

export function topicAndPlanToExportPayload(
  topic: CurriculumTopic,
  plan: GeneratedLessonPlan,
  source: ApiSource | null,
  fallbackReason: FallbackReason | null
): LessonPlanExportPayload {
  return {
    grade: topic.grade,
    unit: topic.unit,
    topicTitle: topic.title,
    code: topic.code,
    fieldSkills: topic.fieldSkills,
    enrichment: topic.enrichment,
    support: topic.support,
    source,
    fallbackReason,
    plan,
  };
}

export function savedPlanToExportPayload(
  entry: SavedLessonPlan,
  allTopics: CurriculumTopic[]
): LessonPlanExportPayload {
  const matched = allTopics.find((t) => t.id === entry.topicId);
  return {
    grade: entry.grade,
    unit: entry.unit,
    topicTitle: entry.topicTitle,
    code: entry.code,
    fieldSkills: entry.fieldSkills,
    enrichment: matched?.enrichment,
    support: matched?.support,
    source: entry.source,
    fallbackReason: entry.fallbackReason,
    savedAt: entry.savedAt,
    plan: entry.plan,
  };
}
