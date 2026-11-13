import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  ClassroomStoreError,
  MemoryClassroomSessionStore,
} from './server/classroomStore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const classroomStore = new MemoryClassroomSessionStore();

app.use(express.json({ limit: '256kb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'fopos' });
});

const sendClassroomError = (res: Response, error: unknown) => {
  if (error instanceof ClassroomStoreError) {
    return res.status(error.statusCode).json({
      error: { code: error.code, message: error.message },
    });
  }
  console.error('Classroom API error:', error);
  return res.status(500).json({
    error: { code: 'CLASSROOM_INTERNAL_ERROR', message: 'Sınıf oturumu işlemi tamamlanamadı.' },
  });
};

app.post('/api/classroom/sessions', (req: Request, res: Response) => {
  try {
    const { experimentId, question, options } = req.body || {};
    if (typeof experimentId !== 'string' || experimentId.length > 80) {
      throw new ClassroomStoreError('INVALID_EXPERIMENT', 'Geçerli bir düşünce deneyi seçilmelidir.');
    }
    if (typeof question !== 'string' || question.trim().length < 5 || question.length > 500) {
      throw new ClassroomStoreError('INVALID_QUESTION', 'Oylama sorusu 5 ile 500 karakter arasında olmalıdır.');
    }
    if (!Array.isArray(options) || options.length < 2 || options.length > 4) {
      throw new ClassroomStoreError('INVALID_OPTIONS', 'Oylama iki ile dört seçenek arasında olmalıdır.');
    }
    const normalizedOptions = options.map((option: unknown, index: number) => {
      const item = option as { id?: unknown; label?: unknown };
      if (typeof item.id !== 'string' || typeof item.label !== 'string' || item.label.trim().length === 0 || item.label.length > 200) {
        throw new ClassroomStoreError('INVALID_OPTION', `Oylama seçeneği ${index + 1} geçersiz.`);
      }
      return { id: item.id.trim().slice(0, 40), label: item.label.trim() };
    });
    const uniqueIds = new Set(normalizedOptions.map((option) => option.id));
    if (uniqueIds.size !== normalizedOptions.length) {
      throw new ClassroomStoreError('DUPLICATE_OPTION', 'Oylama seçenekleri benzersiz olmalıdır.');
    }

    const { session, teacherToken } = classroomStore.createSession({
      experimentId: experimentId.trim(),
      question: question.trim(),
      options: normalizedOptions,
    });
    const joinUrl = `${req.protocol}://${req.get('host')}/join/${session.code}`;
    return res.status(201).json({ session, teacherToken, joinUrl });
  } catch (error) {
    return sendClassroomError(res, error);
  }
});

app.get('/api/classroom/join/:code', (req: Request, res: Response) => {
  try {
    return res.json({ session: classroomStore.getPublicSession(req.params.code) });
  } catch (error) {
    return sendClassroomError(res, error);
  }
});

app.post('/api/classroom/sessions/:code/participants', (req: Request, res: Response) => {
  try {
    const result = classroomStore.joinSession(req.params.code);
    return res.status(201).json(result);
  } catch (error) {
    return sendClassroomError(res, error);
  }
});

app.post('/api/classroom/sessions/:code/votes', (req: Request, res: Response) => {
  try {
    const { participantToken, roundId, optionId } = req.body || {};
    if (typeof participantToken !== 'string' || participantToken.length > 200) {
      throw new ClassroomStoreError('INVALID_PARTICIPANT_TOKEN', 'Katılım anahtarı geçersiz.', 401);
    }
    if (typeof roundId !== 'string' || typeof optionId !== 'string') {
      throw new ClassroomStoreError('INVALID_VOTE', 'Oy isteği eksik veya geçersiz.');
    }
    const result = classroomStore.castVote({
      code: req.params.code,
      participantToken,
      roundId,
      optionId,
    });
    return res.status(201).json(result);
  } catch (error) {
    return sendClassroomError(res, error);
  }
});

const SSE_HEARTBEAT_MS = 20_000;

const readBearerToken = (req: Request) => {
  const header = req.get('authorization') || '';
  const match = /^Bearer\s+(\S{1,200})$/i.exec(header);
  return match ? match[1] : '';
};

// Öğretmen için canlı sonuç akışı (SSE). Token URL'de değil, Authorization başlığında taşınır.
app.get('/api/classroom/sessions/:code/events', (req: Request, res: Response) => {
  let subscription: ReturnType<MemoryClassroomSessionStore['subscribeTeacher']> | null = null;
  let heartbeat: NodeJS.Timeout | null = null;
  let expiryTimer: NodeJS.Timeout | null = null;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    if (heartbeat) clearInterval(heartbeat);
    if (expiryTimer) clearTimeout(expiryTimer);
    subscription?.unsubscribe();
    res.end();
  };

  const send = (event: string, data: unknown) => {
    if (finished) return;
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    subscription = classroomStore.subscribeTeacher(req.params.code, readBearerToken(req), (session) => {
      send('snapshot', session);
    });
  } catch (error) {
    return sendClassroomError(res, error);
  }

  res.status(200).set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  res.write('retry: 3000\n\n');

  // Bağlanır bağlanmaz mevcut durumu gönder; yeniden bağlanmada istemci durumu böyle tazeler.
  send('snapshot', subscription.snapshot);

  heartbeat = setInterval(() => {
    if (!finished) res.write(': ping\n\n');
  }, SSE_HEARTBEAT_MS);

  expiryTimer = setTimeout(() => {
    send('closed', { reason: 'SESSION_EXPIRED' });
    finish();
  }, Math.max(0, subscription.expiresAt - Date.now()));

  req.on('close', finish);
  return undefined;
});

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Socratic Dialogue API
app.post('/api/socratic-dialogue', async (req: Request, res: Response) => {
  try {
    const { philosopher, topic, userMessage, history } = req.body;

    const philosopherPersonas: Record<string, string> = {
      sokrates: `Sen Antik Yunan filozofu Sokrates'sin. Asla doğrudan kesin bir doğru vermezsin. Muhatabının (öğrencinin) varsayımlarını sorgulamak için İroni (eironeia) ve Doğurtma (maieutik) yöntemini uygularsın. Sorularla öğrencinin kendi çelişkisini fark etmesini sağlarsın. Türkçe, bilgece, samimi ve kışkırtıcı bir dille 2-3 cümlelik derinlikli bir felsefi soru yönelt. Varsa bir mantık hatasını nazikçe sezdir.`,
      kant: `Sen Immanuel Kant'sın. Saf Aklın Eleştirisi ve Ahlak Metafiziğinin Temellendirilmesi perspektifinden konuşursun. Ödev ahlakı, kategorik buyruk (koşulsuz buyruk), a priori bilgi ve aklın sınırları çerçevesinde düşünürsün. Argümanın evrensel bir ilke olup olamayacağını sorgularsın.`,
      nietzsche: `Sen Friedrich Nietzsche'sin. Konformizmi, sürü ahlakını ve sorgulanmamış dogmaları sarsıcı, aforizmatik ve tutkulu bir dille eleştirirsin. Güç istemi, değerlerin yeniden değerlendirilmesi ve üstinsan perspektifinden öğrenciyi kışkırtırsın.`,
      ibnsina: `Sen İbn Sina (Avicenna)'sın. Meşşai felsefe geleneğinin doruk noktasısın. Mantık (kıyas), varlık (zorunlu varlık ve mümkün varlık) ve akli istidlal ile yanıt verirsin. Düzenli, analitik ve tutarlı bir akıl yürütme talep edersin.`,
      spinoza: `Sen Baruch Spinoza'sın. Deus sive Natura (Tanrı ya da Doğa), tek töz, zorunluluk ve geometrik yöntemle düşünürsün. Duyguların esaretinden aklın kılavuzluğunda özgürleşmeyi savunursun.`
    };

    const persona = philosopherPersonas[philosopher] || philosopherPersonas.sokrates;

    if (aiClient) {
      try {
        const formattedHistory = Array.isArray(history)
          ? history.slice(-6).map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Öğrenci' : 'Filozof'}: ${h.text}`).join('\n')
          : '';

        const prompt = `Konu: ${topic || 'Genel Felsefe'}\nÖnceki Diyalog:\n${formattedHistory}\nÖğrencinin Son Argümanı: "${userMessage}"\n\nLütfen belirlenen persona çerçevesinde yanıt ver:`;

        const geminiCall = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: persona,
          },
        });

        // 4-second timeout race
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 4000)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);
        if (response && response.text) {
          return res.json({ reply: response.text });
        }
      } catch (geminiErr) {
        console.warn('Gemini call failed or timed out, falling back to heuristic reply:', geminiErr);
      }
    }

    // Dynamic intelligent fallback when API key is not configured
    const defaultReplies: Record<string, string[]> = {
      sokrates: [
        `"Bunu çok emin bir tavırla söylüyorsun dostum. Peki, bu iddianda geçen o temel kavramı neye dayanarak tanımlıyorsun? Acaba gerçekten bildiğin bir şeyi mi savunuyorsun, yoksa herkes öyle söylüyor diye doğru mu kabul ettin?"`,
        `"Eğer bu doğruysa, tam aksi durumda ortaya çıkacak sonucu nasıl açıklayacaksın? Kendini bir çelişkiye hapsetmiş olabilir misin?"`,
        `"Ruhuna bir ayna tutalım: Bu savunduğun ilke her zaman ve herkes için geçerli olabilir mi, yoksa sadece işine geldiği koşullarda mı doğrulanıyor?"`
      ],
      kant: [
        `"Bu eyleminin veya düşüncenin ardındaki maksimi (temel ilkeyi) düşün: Bu ilkenin aynı anda evrensel bir doğa yasası olmasını ister miydin? Eğer herkes böyle düşünseydi kavramın kendisi yok olmaz mıydı?"`,
        `"İnsanı asla yalnızca bir araç olarak görmemeliyiz; her zaman aynı zamanda bir amaç olarak değerlendirmeliyiz. Argümanın insanın rasyonel özerkliğini koruyor mu?"`
      ],
      nietzsche: [
        `"Bu sözlerinde eski, yorgun değerlerin kokusunu duyuyorum! Bu düşünce yaşama hizmet mi ediyor, yoksa onu zayıflatıp uysallaştırıyor mu? Kendi değerlerini yaratmaya cesaretin var mı?"`,
        `"Bütün bu 'iyi' ve 'doğru' dediklerin, aslında sadece rahatına düşkün zayıfların icadı olmasın sakın?"`
      ]
    };

    const replies = defaultReplies[philosopher] || defaultReplies.sokrates;
    const picked = replies[Math.floor(Math.random() * replies.length)];
    return res.json({ reply: picked });
  } catch (error) {
    console.error('Socratic dialogue error:', error);
    return res.json({
      reply: 'Düşüncenin derinliği bazen sessizlikle başlar. İddianı biraz daha somut bir örnekle yeniden temellendirebilir misin?'
    });
  }
});

// 2. Lesson Plan & P4C Workshop Generator API
app.post('/api/generate-lesson-plan', async (req: Request, res: Response) => {
  try {
    const { grade, unit, topic, code, fieldSkills, duration, methodology } = req.body;

    if (aiClient) {
      try {
        const prompt = `T.C. Millî Eğitim Bakanlığı Türkiye Yüzyılı Maarif Modeli (TYMM) Felsefe Dersi Öğretim Programı ve P4C formatında interaktif bir ders planı hazırla.
Sınıf Düzeyi: ${grade}
Ünite: ${unit} (${code || ''})
Sosyal Bilimler Alan Becerisi: ${fieldSkills || 'SBAB14. Felsefi Muhakeme'}
Konu: ${topic}
Süre: ${duration || 40} dakika
Yöntem/Yaklaşım: ${methodology || 'TYMM Soruşturma Topluluğu & Sokratik Çember'}

Lütfen şu başlıkları içeren yapılandırılmış bir JSON çıktısı ver:
{
  "title": "Dersin Başlığı",
  "learningOutcomes": ["Kazanım 1", "Kazanım 2"],
  "stimulusMaterial": "Giriş için uyarıcı soru, kısa vaka veya düşünce deneyi",
  "inquiryQuestions": ["Soruşturma sorusu 1", "Soruşturma sorusu 2", "Soruşturma sorusu 3"],
  "stages": [
    {"phase": "Giriş & Köprü Kurma (10 dk)", "activity": "Açıklama", "role": "Öğretmen kolaylaştırıcı rolü"},
    {"phase": "Gelişme & Sokratik Çember (20 dk)", "activity": "Açıklama", "role": "Öğretmen rolü"},
    {"phase": "Sonuç & Süreç Değerlendirme (10 dk)", "activity": "Açıklama", "role": "Öğretmen rolü"}
  ],
  "commonFallaciesToWatch": ["Öğrencilerin düşebileceği safsata 1", "Safsata 2"],
  "reflectionPrompt": "Ders sonu öz-değerlendirme sorusu"
}`;

        const geminiCall = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Lesson plan timeout')), 4000)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);
        if (response && response.text) {
          return res.json({ plan: JSON.parse(response.text) });
        }
      } catch (e) {
        console.warn('Lesson plan generation fell back to template:', e);
      }
    }

    // Default high-quality structured plan
    return res.json({
      plan: {
        title: `${grade} ${unit}: ${topic} - TYMM Soruşturma Atölyesi (${code || 'FEL'})`,
        learningOutcomes: [
          'Felsefi argümanları analiz edebilme ve alan becerileri (SBAB14/15) doğrultusunda gerekçelendirme yapar.',
          'Kavramsal ayrımları fark ederek kendi düşüncelerindeki örtük varsayımları sorgular.',
          'Başkalarının fikirlerini saygıyla dinleyip eleştirel karşı tezler geliştirebilir.'
        ],
        stimulusMaterial: `Öğrencilere şu ikilem sunulur: "Hiç kimsenin sizi görmediği ve asla yakalanmayacağınız bir görünmezlik yüzüğünüz olsaydı (Gyges'in Yüzüğü), yine de adil ve ahlaklı davranır mıydınız?"`,
        inquiryQuestions: [
          'Ahlaklı olmak yalnızca cezadan korktuğumuz veya övgü beklediğimiz için midir?',
          'İçsel bir vicdan yasası toplum kurallarından bağımsız olarak var olabilir mi?',
          'Adalet güçlünün çıkarı mıdır, yoksa ortak insan onurunun gereği midir?'
        ],
        stages: [
          { phase: 'Isınma & Uyarıcı (8 dk)', activity: 'Düşünce deneyi okunur ve tahtada sınıf oylaması yapılır.', role: 'Tarafsız kolaylaştırıcı' },
          { phase: 'Sokratik Çember (22 dk)', activity: 'Öğrenciler argüman ve karşıt argüman geliştirir, akıl yürütme ağacına yazılır.', role: 'Kavram netleştirici ve soru yönlendirici' },
          { phase: 'Kapanış & Çıkarım (10 dk)', activity: 'Öğrenciler dersin ana kavramını tek bir felsefi soruyla özetler.', role: 'Süreç değerlendirici' }
        ],
        commonFallaciesToWatch: [
          'Ad Hominem: Fikir yerine arkadaşının kişiliğine saldırma.',
          'Yanlış İkilem: "Ya herkes bencil ya da herkes melektir" indirgemesi.'
        ],
        reflectionPrompt: 'Bugün savunduğun düşünceyi en çok sarsan karşıt soru hangisiydi?'
      }
    });
  } catch (error) {
    console.error('Lesson plan error:', error);
    return res.status(500).json({ error: 'Ders planı oluşturulurken bir hata oluştu.' });
  }
});

// 3. Argument Analyzer API
app.post('/api/analyze-argument', async (req: Request, res: Response) => {
  try {
    const { claim, premises, counterArguments } = req.body;

    if (aiClient) {
      const prompt = `Aşağıdaki felsefi argüman yapısını mantık, tutarlılık ve safsata açısından analiz et:
Ana Tez: ${claim}
Öncüller: ${JSON.stringify(premises)}
Karşı Argümanlar: ${JSON.stringify(counterArguments)}

JSON formatında yanıt ver:
{
  "strengthScore": 85,
  "validityAssessment": "Kısa değerlendirme",
  "detectedFallacies": ["Varsa safsatalar veya 'Tespit edilmedi'"],
  "strengtheningTips": ["Argümanı güçlendirecek 1. tavsiye", "2. tavsiye"],
  "counterCounterStrategy": "Karşı tezlere verilebilecek en sağlam mantıksal yanıt"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    return res.json({
      strengthScore: 82,
      validityAssessment: 'Öncüller ana iddiayı güçlü bir biçimde destekliyor ancak tümevarımsal bir genelleme içeriyor.',
      detectedFallacies: ['Hafif Aceleci Genelleme riski mevcut.'],
      strengtheningTips: [
        'Birinci öncülü olgusal veya kavramsal bir tanımla daha net sınırlandırın.',
        'Karşı argümanın dayandığı istisnai durumları baştan kabul edip paranteze alın.'
      ],
      counterCounterStrategy: 'Karşı tezin sunduğu örneğin ana kuralı bozmadığını, tam aksine istisnanın kuralı teyit ettiğini gösterin.'
    });
  } catch (error) {
    console.error('Argument analyze error:', error);
    return res.status(500).json({ error: 'Analiz tamamlanamadı.' });
  }
});

// Mount Vite middleware in development or serve static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FOPOS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
