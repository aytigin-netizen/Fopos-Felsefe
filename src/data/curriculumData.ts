import { CurriculumTopic } from '../types/philosophy';

export const TYMM_CURRICULUM_TOPICS: CurriculumTopic[] = [
  // ===================== 10. SINIF (9 ÜNİTE) =====================
  {
    id: 'tymm-10-1',
    grade: '10. Sınıf',
    unitNumber: 1,
    unit: '1. Ünite: Felsefenin Doğası',
    title: 'Felsefenin Anlamı, Gelişim Süreci ve İşlevi',
    code: 'FEL.10.1.1',
    hours: 10,
    percentage: 15,
    fieldSkills: 'SBAB13. Felsefi Sorgulama (5 Bütünleşik Beceri)',
    tendencies: ['E1.1. Merak', 'E3.1. Muhakeme', 'E3.2. Odaklanma', 'E3.3. Yaratıcılık', 'E3.5. Açık Fikirlilik', 'E3.7. Sistematiklik', 'E3.8. Soru Sorma', 'E3.9. Şüphe Duyma', 'E3.10. Eleştirel Bakma'],
    values: ['D3. Çalışkanlık', 'D4. Dostluk', 'D6. Dürüstlük', 'D14. Saygı', 'D16. Sorumluluk'],
    literacies: ['OB1. Bilgi Okuryazarlığı', 'OB2. Dijital Okuryazarlık', 'OB4. Görsel Okuryazarlık', 'OB5. Kültür Okuryazarlığı'],
    keyPhilosophers: ['Sokrates', 'Platon', 'Aristoteles', 'Farabi', 'Jaspers', 'Âşık Veysel', 'Neşet Ertaş'],
    keyConcepts: ['bilgelik', 'felsefe', 'filozof', 'refleksiyon', 'sorgulama', 'evrensellik'],
    outcomes: [
      'FEL.10.1.1. Felsefenin anlamını, gelişim sürecini ve işlevini sorgulayabilme'
    ],
    processComponents: [
      'a) Felsefenin anlamını merak eder ve felsefenin ortak tanımının imkânına yönelik şüphe duyar.',
      'b) Felsefi düşüncenin genel özellikleri, ortaya çıkışı ve tarihsel gelişimi üzerine derinlemesine düşünür.',
      'c) Felsefi soruların temel özelliklerini ifade ederek felsefi soru sorar.',
      'ç) Felsefenin bilim, din ve sanat alanlarıyla ilişkisine eleştirel yaklaşır.',
      'd) Felsefenin bireysel ve toplumsal işlevlerini tartışır.'
    ],
    p4cQuestion: '"Felsefe yanıtı olmayan sorular sormak mıdır, yoksa sorgulanmamış yanıtları yerle bir etmek midir?"',
    activityIdea: 'Öğrenciler "Felsefe nedir? Filozof kime denir? Felsefe ne işe yarar?" soruları etrafında okulda röportaj yapar ve okul genel ağında yayınlar.',
    enrichment: '"Felsefe üzerine felsefe yapılabilir mi?" sorusu üzerine görüş geliştirilir. Âşık Veysel ve Neşet Ertaş eserlerinde felsefi temalar incelenir. Farklı medeniyetlerdeki kadın düşünürler araştırılır.',
    support: 'Felsefenin anlamı ve özelliklerini pekiştirmeye yönelik görsel ve işitsel uyaranların ağırlıkta olduğu materyaller kullanılır.'
  },
  {
    id: 'tymm-10-2',
    grade: '10. Sınıf',
    unitNumber: 2,
    unit: '2. Ünite: Felsefe, Mantık ve Argümantasyon',
    title: 'Düşünme-Dil İlişkisi ve Argümantasyonun Yapısı',
    code: 'FEL.10.2.1 / FEL.10.2.2',
    hours: 6,
    percentage: 8,
    fieldSkills: 'SBAB14. Felsefi Muhakeme (Yorumlama & Çözümleme)',
    conceptualSkills: 'KB2.13. Yapılandırma',
    tendencies: ['E1.6. Seçicilik', 'E3.3. Yaratıcılık', 'E3.10. Eleştirel Bakma'],
    values: ['D2. Aile', 'D6. Dürüstlük', 'D16. Sorumluluk'],
    literacies: ['OB1. Bilgi Okuryazarlığı', 'OB5. Kültür Okuryazarlığı'],
    keyPhilosophers: ['Aristoteles', 'Gottlob Frege', 'Ludwig Wittgenstein'],
    keyConcepts: ['akıl yürütme', 'argüman', 'dil', 'düşünme', 'mantık', 'safsata', 'tutarlılık', 'öncül (P)', 'sonuç (C)'],
    outcomes: [
      'FEL.10.2.1. Düşünme ve dil ilişkisini yapılandırabilme',
      'FEL.10.2.2. Mantığın temel kavramlarını ve argümantasyon sürecini yorumlayabilme'
    ],
    processComponents: [
      'Düşünme ve dil ilişkisini inceleyerek nedensel ilişkiler ortaya koyar.',
      'İfadeleri bağlamından koparmadan mantıksal yapılarına göre öncül (P) ve sonuç (C) bileşenlerine ayırır.',
      'Safsata türlerini (otoriteye başvurma, adam karalama, cımbızlama, popülerliğe başvurma, nedensellik, yanlış analoji) tespit eder.'
    ],
    p4cQuestion: '"Dil olmadan düşünmek mümkün müdür, yoksa dil düşüncenin hem evi hem de hapishanesi midir?"',
    activityIdea: 'Medyadan ve sosyal medyadan derlenen metinlerde "Safsata Avı": Adam karalama, cımbızlama ve yanlış neden safsatalarını tespit edip yeniden yazma.',
    enrichment: 'Çok değerli mantık, bulanık mantık ve Wittgenstein\'ın "dil oyunu" kuramı araştırılır. Argüman diyagramı bir algoritmaya/koda dönüştürülüp test edilir.',
    support: 'Mantık ve argümantasyonda kullanılan temel kavramlar kısa bilgi kartları ve akran eşleşmeleriyle pekiştirilir.'
  },
  {
    id: 'tymm-10-3',
    grade: '10. Sınıf',
    unitNumber: 3,
    unit: '3. Ünite: Varlık Felsefesi',
    title: 'Varlığın Varlığı, Mahiyeti ve Temel Problemleri',
    code: 'FEL.10.3.1',
    hours: 10,
    percentage: 15,
    fieldSkills: 'SBAB14. Felsefi Muhakeme (Felsefi Problemleri Anlama & Değerlendirme)',
    tendencies: ['E1.1. Merak', 'E3.5. Açık Fikirlilik', 'E3.7. Sistematiklik'],
    values: ['D3. Çalışkanlık', 'D4. Dostluk', 'D12. Sabır', 'D14. Saygı', 'D16. Sorumluluk'],
    literacies: ['OB1. Bilgi Okuryazarlığı'],
    keyPhilosophers: ['Platon', 'Aristoteles', 'İbn Sina', 'Descartes', 'Sartre', 'Hilmi Ziya Ülken'],
    keyConcepts: ['fenomen', 'idea', 'madde', 'oluş', 'öz', 'töz', 'varlık', 'varoluş', 'dualizm', 'nihilizm', 'realizm'],
    outcomes: [
      'FEL.10.3.1. Varlık felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme'
    ],
    processComponents: [
      'Varlık felsefesinin konusunu ve temel kavramlarını açıklar.',
      'Varlık felsefesinin temel problemlerini (Varlığın var olup olmadığı, varlığın ne olduğu) açıklar.',
      'Varlık felsefesiyle ilgili metinlerde (Phaidon, Metafizik, İbn Sina Metafizik, Hilmi Ziya Ülken Varlık ve Oluş) yer alan argümanları inceler.'
    ],
    p4cQuestion: '"Rüyaları, simülasyonları ve sanal dünyaları gerçeklikten ayıran nesnel bir ölçüt var mıdır?"',
    activityIdea: 'Theseus\'un Gemisi paradoksu üzerinden süreklilik ve atomik töz tartışması. İbn Sina\'nın Uçan Adam deneyi ile Descartes\'ın Cogito\'sunun karşılaştırılması.',
    enrichment: 'İbn Sina\'nın "Uçan Adam" metaforu ile Descartes\'ın "Cogito" argümanı karşılaştırılarak interaktif dijital materyal hazırlanır. Thomas Nagel\'ın "Yarasa Olmak Nasıl Bir Şeydir?" eseri yorumlanır.',
    support: 'Varlık akımları (idealizm, materyalizm, düalizm) sadeleştirilmiş kavram kartlarıyla eşleştirilir.'
  },
  {
    id: 'tymm-10-4',
    grade: '10. Sınıf',
    unitNumber: 4,
    unit: '4. Ünite: Bilgi Felsefesi',
    title: 'Bilginin İmkânı, Kaynağı ve Doğruluk Ölçütleri',
    code: 'FEL.10.4.1',
    hours: 8,
    percentage: 11,
    fieldSkills: 'SBAB14. Felsefi Muhakeme',
    tendencies: ['E3.6. Analitiklik', 'E3.7. Sistematiklik', 'E3.8. Soru Sorma', 'E3.10. Eleştirel Bakma'],
    values: ['D3. Çalışkanlık', 'D12. Sabır', 'D14. Saygı', 'D16. Sorumluluk'],
    literacies: ['OB1. Bilgi Okuryazarlığı', 'OB2. Dijital Okuryazarlık', 'OB4. Görsel Okuryazarlık'],
    keyPhilosophers: ['Platon', 'Sokrates', 'Gorgias', 'Pyrrhon', 'Gazali', 'Descartes', 'Locke', 'Kant', 'Necati Öner'],
    keyConcepts: ['bilgi', 'doğruluk', 'gerçeklik', 'uygunluk', 'tutarlılık', 'tümel uzlaşım', 'apaçıklık', 'yarar'],
    outcomes: [
      'FEL.10.4.1. Bilgi felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme'
    ],
    processComponents: [
      'Bilgi felsefesinin konusunu ve temel kavramlarını açıklar.',
      'Bilginin imkânı, bilginin kaynağı (akıl, deney, sezgi, eleştiri) ve doğruluk ölçütlerini açıklar.',
      'Klasik metinleri (Theaitetos, Gazali Hakikat Arayışı, Saf Aklın Eleştirisi, Necati Öner Bilginin Serüveni) analiz eder.'
    ],
    p4cQuestion: '"Bir inancın doğru olması onun bilgi sayılması için yeterli midir? (Gettier Problemi)"',
    activityIdea: 'Platon\'un Mağara Alegorisi animasyonu üzerinden sanı (doxa) ile hakikat (episteme) ayrımının günümüz sosyal medya yankı odalarıyla eşleştirilmesi.',
    enrichment: 'Gazali\'nin "kesin bilgi" arayışındaki şüphe yaklaşımı ile Descartes\'ın "metodik şüphe" yöntemi arasındaki tarihsel etkileşim araştırılır. David Hume nedensellik eleştirisi incelenir.',
    support: 'Doğruluk ölçütleri (uygunluk, tutarlılık, tümel uzlaşım, apaçıklık, yarar) günlük gazete haberleri üzerinden örneklendirilir.'
  },
  {
    id: 'tymm-10-5',
    grade: '10. Sınıf',
    unitNumber: 5,
    unit: '5. Ünite: Ahlak Felsefesi',
    title: 'Evrensel Ahlak Yasasının İmkânı ve İnsan Özgürlüğü',
    code: 'FEL.10.5.1',
    hours: 8,
    percentage: 11,
    fieldSkills: 'SBAB14. Felsefi Muhakeme',
    tendencies: ['E1.1. Merak', 'E1.2. Bağımsızlık', 'E3.3. Yaratıcılık', 'E3.5. Açık Fikirlilik', 'E3.7. Sistematiklik', 'E3.8. Soru Sorma', 'E3.10. Eleştirel Bakma'],
    values: ['D3. Çalışkanlık', 'D11. Özgürlük', 'D14. Saygı', 'D15. Sevgi', 'D16. Sorumluluk'],
    literacies: ['OB1. Bilgi Okuryazarlığı', 'OB5. Kültür Okuryazarlığı'],
    keyPhilosophers: ['Platon', 'Aristoteles', 'Farabi', 'Yûsuf Has Hâcib', 'Kant', 'Nurettin Topçu', 'İbn Miskeveyh'],
    keyConcepts: ['ahlak', 'erdem', 'etik', 'iyi', 'kötü', 'özgürlük', 'sorumluluk', 'vicdan', 'kategorik buyruk', 'faydacılık'],
    outcomes: [
      'FEL.10.5.1. Ahlak felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme'
    ],
    processComponents: [
      'Ahlak felsefesinin temel kavramlarını açıklar.',
      'Evrensel ahlak yasasının imkânı (kabul edenler vs reddedenler) ve özgürlük-sorumluluk ilişkisini değerlendirir.',
      'Temel eserleri (Devlet, Nikomakhos\'a Etik, Kutadgu Bilig, Ahlak Metafiziğinin Temellendirilmesi, Nurettin Topçu İsyan Ahlakı) inceler.'
    ],
    p4cQuestion: '"Kimsenin görmediği bir yerde kurallara uymak ahlak mıdır, yoksa sadece vicdanın huzuru mudur? (Gyges\'in Yüzüğü)"',
    activityIdea: 'Biyoetik Kurulu Simülasyonu: "Otonom bir yapay zekalı araç, kaza durumunda kimi korumayı öncelemelidir?" senaryosunda etik karar verici rolü üstlenme.',
    enrichment: 'Gyges\'in Yüzüğü öyküsü üzerinden insan doğası irdelenir. Turing testinde yer alan ahlaka yönelik sorulara alternatif örnekler üretilir. İbn Miskeveyh ölçülülük erdemi tüketim toplumuyla bağdaştırılır.',
    support: 'Özgürlük problemini açıklayan günlük yaşam durumları ve ikilem kartları üzerinden grup çalışmaları yapılır.'
  },
  {
    id: 'tymm-10-6',
    grade: '10. Sınıf',
    unitNumber: 6,
    unit: '6. Ünite: Estetik ve Sanat Felsefesi',
    title: 'Sanatın Doğası, Güzellik ve Ortak Estetik Yargılar',
    code: 'FEL.10.6.1',
    hours: 6,
    percentage: 8,
    fieldSkills: 'SBAB14. Felsefi Muhakeme',
    tendencies: ['E3.5. Açık Fikirlilik', 'E3.7. Sistematiklik', 'E3.8. Soru Sorma', 'E3.10. Eleştirel Bakma'],
    values: ['D3. Çalışkanlık', 'D7. Estetik', 'D11. Özgürlük', 'D14. Saygı', 'D16. Sorumluluk'],
    literacies: ['OB4. Görsel Okuryazarlık', 'OB9. Sanat Okuryazarlığı'],
    keyPhilosophers: ['Aristoteles', 'Schiller', 'Croce', 'İsmail Tunalı', 'John Berger', 'Walter Benjamin', 'Arthur Danto'],
    keyConcepts: ['estetik', 'hoş', 'güzellik', 'sanat', 'sanat eseri', 'taklit', 'yaratım', 'oyun'],
    outcomes: [
      'FEL.10.6.1. Estetik ve sanat felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme'
    ],
    processComponents: [
      'Sanat kuramlarını (taklit olarak sanat, yaratım olarak sanat, oyun olarak sanat) açıklar.',
      'Güzelliğin öznelliği/nesnelliği ve ortak estetik yargıların imkânını tartışır.',
      'Poetika, İnsanın Estetik Eğitimi Üzerine, İsmail Tunalı Estetik, Görme Biçimleri eserlerini inceler.'
    ],
    p4cQuestion: '"Bir müzede sergilenen duvara bantlanmış muz gerçekten sanat eseri midir? Sanatı sanat yapan nesne midir yoksa bağlam mıdır?"',
    activityIdea: 'Taklit vs Yaratım Çizim Atölyesi: Öğrenciler önce bir nesneyi kopyalar, sonra zihinlerindeki özgür tasarımını çizer; sanat kuramlarıyla tartışır.',
    enrichment: 'M. Cattelan "Komedyen" ve Warhol "Brillo Kutuları" Arthur Danto\'nun Kurumsal Sanat Kuramı ile analiz edilir. Walter Benjamin "Mekanik Yeniden Üretim Çağında Sanat Eseri" ve Aura kaybı tartışılır.',
    support: 'Sanat kuramları görsel kolajlar ve örnek eser kartları üzerinden sadeleştirilerek açıklanır.'
  },
  {
    id: 'tymm-10-7',
    grade: '10. Sınıf',
    unitNumber: 7,
    unit: '7. Ünite: Siyaset Felsefesi',
    title: 'Devletin Kökeni, İktidarın Meşruiyeti ve Ütopyalar',
    code: 'FEL.10.7.1',
    hours: 8,
    percentage: 11,
    fieldSkills: 'SBAB14. Felsefi Muhakeme',
    tendencies: ['E3.3. Yaratıcılık', 'E3.5. Açık Fikirlilik', 'E3.7. Sistematiklik', 'E3.10. Eleştirel Bakma'],
    values: ['D1. Adalet', 'D3. Çalışkanlık', 'D16. Sorumluluk', 'D19. Vatanseverlik'],
    literacies: ['OB1. Bilgi Okuryazarlığı', 'OB6. Vatandaşlık Okuryazarlığı'],
    keyPhilosophers: ['Platon', 'Aristoteles', 'Orhon Yazıtları', 'Farabi', 'Yûsuf Has Hâcib', 'İbn Haldun', 'Hobbes', 'Locke', 'Rawls'],
    keyConcepts: ['adalet', 'birey', 'devlet', 'eşitlik', 'iktidar', 'özgürlük', 'toplum', 'ütopya', 'distopya', 'toplum sözleşmesi'],
    outcomes: [
      'FEL.10.7.1. Siyaset felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme'
    ],
    processComponents: [
      'Devletin ortaya çıkış nedenlerini (doğal devlet vs yapay devlet) ve iktidarın kaynağını açıklar.',
      'İdeal bir toplumsal düzenin mümkün olup olmadığını ve ütopyaları değerlendirir.',
      'Devlet, Politika, Orhon Yazıtları, El-Medinetü\'l-Fâzıla, Kutadgu Bilig, Mukaddime, Leviathan metinlerini çözümler.'
    ],
    p4cQuestion: '"Eğer insanlar doğuştan bencilse, devletsiz bir adalet mümkün olabilir mi?"',
    activityIdea: 'John Rawls\'un "Bilinmezlik Perdesi (Cehalet Örtüsü)" kurgusu ile adil bir anayasa taslağı yazma simülasyonu.',
    enrichment: 'John Rawls "Bir Adalet Teorisi" ile adil toplum ütopyası kurgulanır. Jeremy Bentham\'ın "Panoptikon" tasarımı üzerinden gözetim toplumu ve dijital izleme tartışılır.',
    support: 'Devlet modelleri ve ütopya türleri durum kartları ve kavram haritalarıyla özetlenir.'
  },
  {
    id: 'tymm-10-8',
    grade: '10. Sınıf',
    unitNumber: 8,
    unit: '8. Ünite: Din Felsefesi',
    title: 'Tanrı\'nın Varlığı Argümanları, Evren ve Ruhun Ölümsüzlüğü',
    code: 'FEL.10.8.1',
    hours: 6,
    percentage: 8,
    fieldSkills: 'SBAB14. Felsefi Muhakeme',
    tendencies: ['E3.2. Odaklanma', 'E3.7. Sistematiklik', 'E3.10. Eleştirel Bakma'],
    values: ['D3. Çalışkanlık', 'D10. Mütevazılık', 'D14. Saygı', 'D16. Sorumluluk', 'D20. Yardımseverlik'],
    literacies: ['OB1. Bilgi Okuryazarlığı'],
    keyPhilosophers: ['Augustinus', 'Gazali', 'İbn Rüşd', 'Hume', 'Hegel', 'Alvin Plantinga', 'Pascal', 'İbnülarabi'],
    keyConcepts: ['din', 'ibadet', 'iman', 'inanç', 'kutsal', 'mucize', 'Tanrı', 'vahiy', 'teizm', 'deizm', 'panteizm', 'ateizm'],
    outcomes: [
      'FEL.10.8.1. Din felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme'
    ],
    processComponents: [
      'Din felsefesi ile teoloji arasındaki farkları açıklar.',
      'Tanrı\'nın varlığına ilişkin argümanları (teleolojik, kozmolojik, ontolojik, kötülük problemi) çözümler.',
      'Evrenin sonluluğu/sonsuzluğu ve ruhun ölümsüzlüğü tartışmalarını değerlendirir.'
    ],
    p4cQuestion: '"Dünyada masumların acı çekmesi (kötülük problemi), mutlak iyi ve mutlak güçlü bir varlık düşüncesiyle nasıl uzlaştırılabilir?"',
    activityIdea: 'Felsefe ile Teoloji karşılaştırmalı Venn Diyagramı çalışması ve Tanrı kanıtlamaları argüman eşleştirme gridi.',
    enrichment: 'Farabi ve Gazali\'nin nedensellik ve mucize tartışması karşılaştırılır. Platon Euthyphron ikilemi ve Eş\'ari/Mutezile yorumları incelenir. Pascal Bahsi oyun teorisiyle çözümlenir.',
    support: 'Tanrı\'nın varlığına yönelik akımlar yapılandırılmış grid ve tanılayıcı dallanmış ağaçla sunulur.'
  },
  {
    id: 'tymm-10-9',
    grade: '10. Sınıf',
    unitNumber: 9,
    unit: '9. Ünite: Bilim Felsefesi',
    title: 'Bilimin Doğası, Yöntemi ve Paradigma Değişimleri',
    code: 'FEL.10.9.1',
    hours: 6,
    percentage: 8,
    fieldSkills: 'SBAB14. Felsefi Muhakeme',
    tendencies: ['E1.1. Merak', 'E3.7. Sistematiklik', 'E3.10. Eleştirel Bakma'],
    values: ['D3. Çalışkanlık', 'D14. Saygı', 'D16. Sorumluluk'],
    literacies: ['OB1. Bilgi Okuryazarlığı', 'OB4. Görsel Okuryazarlık'],
    keyPhilosophers: ['İbnülheysem', 'Takiyüddin', 'Reichenbach', 'Karl Popper', 'Aydın Sayılı', 'Thomas Kuhn', 'Fuat Sezgin', 'Ş. Teoman Duralı'],
    keyConcepts: ['bilim', 'bilimsel yöntem', 'gözlem', 'hipotez', 'kuram', 'paradigma', 'yasa', 'yanlışlanabilirlik', 'doğrulama'],
    outcomes: [
      'FEL.10.9.1. Bilim felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme'
    ],
    processComponents: [
      'Bilimin ne olduğunu ve bilim olan ile olmayan (sınır koyma/demarkasyon) ölçütlerini açıklar.',
      'Klasik bilim anlayışı (ürün olarak bilim/Carnap) ile çağdaş bilim anlayışını (etkinlik olarak bilim/Kuhn) karşılaştırır.',
      'Popper\'ın yanlışlanabilirlik ilkesi ile Kuhn\'un bilimsel devrimler paradigmasını çözümler.'
    ],
    p4cQuestion: '"Hiçbir zaman yanlışlanamayacak bir iddia, bilimsel bir gerçeklik sayılabilir mi?"',
    activityIdea: 'İbnülheysem\'in Karanlık Oda ve Takiyüddin\'in optik deneyleri üzerinden bilimsel yöntemin basamaklarını posterleştirme.',
    enrichment: 'Sosyal bilimlerde hermeneutik yöntem araştırılır. Teoman Duralı\'nın biyoloji felsefesi temelinde insanın biyolojik ve kültürel boyutları incelenir.',
    support: 'Bilimsel yöntemin basamakları akış şeması ve karşılaştırma kartlarıyla desteklenir.'
  },

  // ===================== 11. SINIF (6 ÇAĞDAŞ TEMATİK ÜNİTE) =====================
  {
    id: 'tymm-11-1',
    grade: '11. Sınıf',
    unitNumber: 1,
    unit: '1. Ünite: Çevre Sorunları ve Felsefe',
    title: 'Çevre Etiği, İnsan-Doğa İlişkisi ve Sürdürülebilirlik',
    code: 'FEL.11.1.1 / FEL.11.1.2',
    hours: 12,
    percentage: 16,
    fieldSkills: 'SBAB14. Felsefi Muhakeme, SBAB15. Felsefi Düşünce Ortaya Koyma',
    tendencies: ['E1.6. Seçicilik', 'E3.2. Odaklanma', 'E3.3. Yaratıcılık', 'E3.6. Analitiklik', 'E3.7. Sistematiklik'],
    values: ['D3. Çalışkanlık', 'D5. Duyarlılık', 'D9. Merhamet', 'D16. Sorumluluk', 'D19. Vatanseverlik', 'D20. Yardımseverlik'],
    literacies: ['OB1. Bilgi Okuryazarlığı', 'OB4. Görsel Okuryazarlık', 'OB7. Veri Okuryazarlığı', 'OB8. Sürdürülebilirlik Okuryazarlığı'],
    keyPhilosophers: ['İbn Tufeyl', 'J.R. DesJardins', 'Hans Jonas', 'Arne Naess', 'Mimar Sinan'],
    keyConcepts: ['çevre', 'çevre etiği', 'insan merkezci etik (antroposentrizm)', 'canlı merkezci etik (biyosentrizm)', 'çevre merkezci etik (ekosentrizm)', 'sürdürülebilirlik'],
    outcomes: [
      'FEL.11.1.1. Çevre ile ilgili felsefi soru ve problemleri anlayabilme',
      'FEL.11.1.2. Çevre sorunlarıyla ilgili felsefi düşünce ortaya koyabilme'
    ],
    processComponents: [
      'Çevre-insan ilişkisinde doğanın kendi başına bir değeri olup olmadığını sorgular.',
      'Çevre etiği yaklaşımlarını (insan merkezli, canlı merkezli, çevre merkezli) çözümler.',
      'Gözlemlediği bir çevre sorunu hakkında felsefi argüman geliştirerek özgün felsefi bir metin yazar.'
    ],
    p4cQuestion: '"Doğanın insandan bağımsız olarak kendi başına bir içsel değeri var mıdır, yoksa doğa sadece insanın faydalanması için var olan bir kaynak mıdır?"',
    activityIdea: 'Eko-Etik Duruşma: Bir baraj veya maden projesi senaryosunda öğrenciler Antroposentrik (İnsan merkezli), Biyosentrik (Canlı merkezli) ve Ekosentrik (Çevre merkezli) savunma heyetleri kurar.',
    enrichment: 'İbn Tufeyl\'in "Hay Bin Yakzan" eseri üzerinden insanın doğadan öğrenme süreci ve Reggio Emilia yaklaşımı incelenir. J.R. DesJardins çevre politikaları felsefesi değerlendirilir.',
    support: 'Çevre etiği akımları karşılaştırmalı infografiklerle somutlaştırılır; felsefi metin yazımında taslak şablonu verilir.'
  },
  {
    id: 'tymm-11-2',
    grade: '11. Sınıf',
    unitNumber: 2,
    unit: '2. Ünite: Teknoloji ve Hayat',
    title: 'Ontolojik Anlam Kaybı, Yabancılaşma ve Robot Etiği',
    code: 'FEL.11.2.1 / FEL.11.2.2',
    hours: 12,
    percentage: 16,
    fieldSkills: 'SBAB14. Felsefi Muhakeme, SBAB15. Felsefi Düşünce Ortaya Koyma',
    tendencies: ['E3.3. Yaratıcılık', 'E3.4. Gerçeği Arama', 'E3.7. Sistematiklik', 'E3.10. Eleştirel Bakma'],
    values: ['D3. Çalışkanlık', 'D8. Mahremiyet', 'D13. Sağlıklı Yaşam', 'D16. Sorumluluk', 'D17. Tasarruf', 'D19. Vatanseverlik'],
    literacies: ['OB1. Bilgi Okuryazarlığı', 'OB2. Dijital Okuryazarlık', 'OB4. Görsel Okuryazarlık'],
    keyPhilosophers: ['Martin Heidegger', 'Gabriel Marcel', 'Jean Baudrillard', 'El-Cezeri', 'John Searle', 'Cahit Arf', 'Neil Postman', 'Z. Bauman'],
    keyConcepts: ['ontolojik anlam', 'tekhne', 'teknoloji karşıtlığı', 'teknoloji taraftarlığı', 'zaman ve mekân', 'yabancılaşma', 'simülasyon', 'yapay zeka'],
    outcomes: [
      'FEL.11.2.1. Teknoloji ile ilgili felsefi soru ve problemleri anlayabilme',
      'FEL.11.2.2. Teknoloji ve hayat ilişkisiyle ilgili felsefi düşünce ortaya koyabilme'
    ],
    processComponents: [
      'Teknolojinin zaman-mekân algısını ve ontolojik anlamı nasıl dönüştürdüğünü sorgular.',
      'Baudrillard\'ın simülasyon kuramı ve Heidegger\'in tekhne anlayışı üzerinden insanın gerçeklik algısını tartışır.',
      'El-Cezeri ve Cahit Arf perspektifinden "Robotlar ahlaklı davranabilir mi?" sorusuna yönelik felsefi metin yazar.'
    ],
    p4cQuestion: '"Bir yapay zeka insan gibi kusursuz empati taklidi yapabiliyorsa, gerçekten hissediyor sayılır mı? (Searle Çin Odası)"',
    activityIdea: 'John Searle\'ün "Çin Odası Deneyi" sınıf canlandırması: Sembolleri kural kitabına göre eşleştiren bir öğrenci ile gerçek anlamı anlayan bir öğrencinin karşılaştırılması.',
    enrichment: 'Cahit Arf\'ın "Makine Düşünebilir mi ve Nasıl Düşünebilir?" tezi irdelenir. Neil Postman\'ın "Teknopoli" kavramı çerçevesinde teknolojinin insan doğasına uygunluğu tartışılır.',
    support: 'Ontolojik ve aksiyolojik teknoloji problemleri günlük sosyal medya ve akıllı telefon alışkanlıkları üzerinden tartışılır.'
  },
  {
    id: 'tymm-11-3',
    grade: '11. Sınıf',
    unitNumber: 3,
    unit: '3. Ünite: Akıl ve İnanç',
    title: 'Akıl-İnanç-Gönül İlişkisi ve Düşünsel Bağlamlar',
    code: 'FEL.11.3.1 / FEL.11.3.2',
    hours: 10,
    percentage: 15,
    fieldSkills: 'SBAB14. Felsefi Muhakeme, SBAB15. Felsefi Düşünce Ortaya Koyma',
    tendencies: ['E3.3. Yaratıcılık', 'E3.7. Sistematiklik', 'E3.10. Eleştirel Bakma'],
    values: ['D3. Çalışkanlık', 'D12. Sabır', 'D16. Sorumluluk'],
    literacies: ['OB1. Bilgi Okuryazarlığı'],
    keyPhilosophers: ['Tertullianus', 'Augustinus', 'Farabi', 'Gazali', 'Yûsuf Has Hâcib', 'Hacı Bektaş Veli', 'Yunus Emre', 'Mevlana', 'Âşık Paşa', 'Kierkegaard', 'İbn Rüşd', 'Kant'],
    keyConcepts: ['akıl', 'gönül', 'inanç', 'rasyonellik', 'irrasyonellik', 'çift hakikat'],
    outcomes: [
      'FEL.11.3.1. Akıl-inanç ilişkisiyle ilgili felsefi soru ve problemleri anlayabilme',
      'FEL.11.3.2. Akıl-inanç ilişkisiyle ilgili felsefi düşünce ortaya koyabilme'
    ],
    processComponents: [
      'İnancın temellendirilmesinde aklın rolünü, rasyonel ve irrasyonel yaklaşımları açıklar.',
      'İbn Rüşd\'ün "Felsefe dinin süt kardeşidir" tezi ile Kant\'ın "İnanca yer açmak için bilgiyi sınırladım" sözünü karşılaştırır.',
      'Akıl-inanç-gönül dengesi üzerine felsefi bir metin yazar.'
    ],
    p4cQuestion: '"Anlamak için mi inanırız, yoksa inandığımız için mi anlamaya başlarız?"',
    activityIdea: 'Gazali ile Meşşai filozoflar (Farabi & İbn Rüşd) arasında akıl, nedensellik ve vahiy konulu felsefi münazara çemberi.',
    enrichment: 'Kierkegaard\'ın "Korku ve Titreme" eserinde inanç sıçraması ve akıl ilişkisi yansıtma yazısıyla değerlendirilir.',
    support: 'Akıl ve inanç ilişkisini yansıtan kısa alıntılar eşleştirilerek sadeleştirilmiş metin analizi yaptırılır.'
  },
  {
    id: 'tymm-11-4',
    grade: '11. Sınıf',
    unitNumber: 4,
    unit: '4. Ünite: Edebiyat ve Felsefe',
    title: 'Felsefi Roman, Felsefi Şiir ve İnsanın Anlam Arayışı',
    code: 'FEL.11.4.1 / FEL.11.4.2',
    hours: 12,
    percentage: 16,
    fieldSkills: 'SBAB14. Felsefi Muhakeme, SBAB15. Felsefi Düşünce Ortaya Koyma',
    tendencies: ['E3.2. Odaklanma', 'E3.6. Analitiklik', 'E3.7. Sistematiklik', 'E3.10. Eleştirel Bakma'],
    values: ['D3. Çalışkanlık', 'D14. Saygı', 'D15. Sevgi', 'D16. Sorumluluk'],
    literacies: ['OB1. Bilgi Okuryazarlığı', 'OB5. Kültür Okuryazarlığı'],
    keyPhilosophers: ['Parmenides', 'Platon', 'Yunus Emre', 'Dostoyevski', 'Hölderlin', 'Tanpınar', 'Kafka', 'Sartre', 'Camus', 'Gadamer'],
    keyConcepts: ['edebiyat', 'felsefi roman', 'felsefi şiir', 'edebî unsurlarla felsefe yapma', 'hermeneutik'],
    outcomes: [
      'FEL.11.4.1. Edebiyat felsefe ilişkisi ile ilgili soru ve problemleri anlayabilme',
      'FEL.11.4.2. Edebiyat felsefe ilişkisi ile ilgili felsefi düşünce ortaya koyabilme'
    ],
    processComponents: [
      'Edebî metinlerin felsefi değer taşıyıp taşımadığını ve dili kullanım biçimlerini karşılaştırır.',
      'Dostoyevski, Kafka, Camus ve Ahmet Hamdi Tanpınar eserlerindeki varoluşsal durumları (yalnızlık, sorumluluk, saçma) felsefi olarak çözümler.',
      'Edebiyat felsefe ilişkisi üzerine özgün bir felsefi deneme yazar.'
    ],
    p4cQuestion: '"Felsefi bir hakikati anlatmak için kavramsal bir makale mi yoksa sarsıcı bir roman mı daha güçlüdür?"',
    activityIdea: 'Kafka\'nın "Dönüşüm"ü ve Tanpınar\'ın "Saatleri Ayarlama Enstitüsü" üzerinden modern insanın yabancılaşması ve bürokrasi felsefesi analizi.',
    enrichment: 'Hermeneutik gelenekte metin-yazar-yorumcu ilişkisi Gadamer\'in "Hakikat ve Yöntem" eseriyle incelenir. Platon\'un şairleri devletten dışlama argümanı değerlendirilir.',
    support: 'Felsefi şiir ve edebi parçalar için anahtar kavram rehberi verilerek metin incelemesi desteklenir.'
  },
  {
    id: 'tymm-11-5',
    grade: '11. Sınıf',
    unitNumber: 5,
    unit: '5. Ünite: Hayatın Anlamı',
    title: 'Mutluluk, Varoluş, Kendi Olma, Kaygı ve Saçma',
    code: 'FEL.11.5.1 / FEL.11.5.2',
    hours: 12,
    percentage: 16,
    fieldSkills: 'SBAB14. Felsefi Muhakeme, SBAB15. Felsefi Düşünce Ortaya Koyma',
    tendencies: ['E1.3. Azim ve Kararlılık', 'E2.1. Empati', 'E3.1. Muhakeme', 'E3.2. Odaklanma', 'E3.3. Yaratıcılık', 'E3.7. Sistematiklik', 'E3.8. Soru Sorma', 'E3.10. Eleştirel Bakma'],
    values: ['D3. Çalışkanlık', 'D10. Mütevazılık', 'D11. Özgürlük', 'D12. Sabır', 'D16. Sorumluluk'],
    literacies: ['OB1. Bilgi Okuryazarlığı'],
    keyPhilosophers: ['Kung-Fu-Tzu', 'Sokrates', 'Epiktetos', 'Augustinus', 'Farabi', 'Schopenhauer', 'Kierkegaard', 'Nietzsche', 'Heidegger', 'Camus', 'Sartre', 'Gülşehrî'],
    keyConcepts: ['kaygı', 'kendi olma', 'mutluluk', 'ölüm', 'saçma (absürd)', 'umutsuzluk', 'varoluş', 'yabancılaşma', 'otantik yaşam'],
    outcomes: [
      'FEL.11.5.1. Hayatın anlamına ilişkin felsefi soru ve problemleri anlayabilme',
      'FEL.11.5.2. Hayatın anlamına ilişkin felsefi düşünce ortaya koyabilme'
    ],
    processComponents: [
      'Mutluluk ve hayat ilişkisi probleminde erdem, haz, irade ve acı kavramlarını çözümler.',
      'Varoluşçuluğun gelişimini (kaygı, yabancılaşma, saçma) inceler ve insanın özünü yaratma imkanını değerlendirir.',
      'Nietzsche\'nin "Böyle Buyurdu Zerdüşt - Üç Dönüşüm" (Deve, Aslan, Çocuk) alegorisi ve Albert Camus\'nün Sisifos Söyleni üzerinden felsefi metin yazar.'
    ],
    p4cQuestion: '"Eğer hayatın önceden belirlenmiş evrensel bir anlamı yoksa, bu durum insanı umutsuzluğa mı sürükler yoksa mutlak bir özgürlük mü bahşeder?"',
    activityIdea: 'Sisifos Çemberi: Günlük hayattaki anlamsız görünen tekrarlarımız (sosyal medya döngüleri, sınav kaygısı) ile Camus\'nün "Sisifos\'u mutlu hayal etmek gerekir" tezi üzerine soruşturma.',
    enrichment: 'Gülşehrî\'nin "Mantıku\'t Tayr"ındaki 30 kuşun Simurg arayışı insanın anlam arayışıyla kıyaslanır. "Görünüyorum o hâlde varım" sosyal medya mottosu tartışılır.',
    support: 'Varoluşçu kavramlar (kaygı, ölüm, saçma) sadeleştirilmiş metaforlarla açıklanır.'
  },
  {
    id: 'tymm-11-6',
    grade: '11. Sınıf',
    unitNumber: 6,
    unit: '6. Ünite: Hukuk ve Felsefe',
    title: 'Doğal Hukuk, Pozitif Hukuk, Hakkaniyet ve Adalet',
    code: 'FEL.11.6.1 / FEL.11.6.2',
    hours: 10,
    percentage: 15,
    fieldSkills: 'SBAB14. Felsefi Muhakeme, SBAB15. Felsefi Düşünce Ortaya Koyma',
    tendencies: ['E3.1. Muhakeme', 'E3.3. Yaratıcılık', 'E3.6. Analitiklik', 'E3.7. Sistematiklik', 'E3.10. Eleştirel Bakma'],
    values: ['D1. Adalet', 'D3. Çalışkanlık', 'D16. Sorumluluk'],
    literacies: ['OB1. Bilgi Okuryazarlığı', 'OB6. Vatandaşlık Okuryazarlığı'],
    keyPhilosophers: ['Aristoteles', 'İbn Haldun', 'Hobbes', 'Locke', 'Rousseau', 'John Rawls', 'Edward Said'],
    keyConcepts: ['ceza', 'hakkaniyet', 'hukuk', 'suç', 'yasa', 'doğal hukuk', 'pozitif hukuk', 'ahlak-hukuk ilişkisi', 'cehalet örtüsü'],
    outcomes: [
      'FEL.11.6.1. Hukukun doğasına yönelik soru ve felsefi problemleri anlayabilme',
      'FEL.11.6.2. Hukuk sorunları üzerine felsefi düşünce ortaya koyabilme'
    ],
    processComponents: [
      'Hukukun gereğini, kaynağını (doğal hukuk vs pozitif hukuk) ve ahlak-hukuk ilişkisini çözümler.',
      'John Rawls\'un adalet anlayışı, "cehalet örtüsü" ve hakkaniyet ilkeleri üzerinden hukuksal sorunları değerlendirir.',
      'Güncel hukuk sorunlarına (bilişim suçları, yapay zeka mülkiyeti, temel haklar) yönelik felsefi metin yazar.'
    ],
    p4cQuestion: '"Yasal olan her şey ahlaki midir? Vicdan ile yasa çatıştığında hangisi üstün gelmelidir? (Antigone İkilemi)"',
    activityIdea: 'Antigone Mahkemesi & Dava İncelemesi: Pozitif hukuk kuralları ile evrensel doğal hukuk ilkelerinin çatıştığı gerçek bir dava simülasyonu.',
    enrichment: 'Edward Said\'in görüşleri temelinde oryantalizm ve sömürgecilik çerçevesinde küresel adalet irdelenir. "Yapay zekanın güncel hukuk sorunlarının çözümündeki rolleri" tartışılır.',
    support: 'Doğal hukuk ile pozitif hukuk arasındaki ayrımlar somut örnek olay kartlarıyla verilir.'
  }
];
