import { ThoughtExperiment } from '../types/philosophy';

export const THOUGHT_EXPERIMENTS: ThoughtExperiment[] = [
  {
    id: 'trolley',
    title: 'Tramvay İkilemi & Otonom Karar Etiği',
    subtitle: 'Faydacılık (Bentham/Mill) vs. Kantçı Deontoloji (Ödev Ahlakı)',
    field: 'Etik & Ahlak',
    image: '/assets/images/trolley_dilemma_1794482208117.jpg',
    philosophers: ['Immanuel Kant', 'Jeremy Bentham', 'John Stuart Mill', 'Philippa Foot'],
    summary: 'Frenleri patlamış bir tramvay 5 işçiye doğru hızla ilerliyor. Yanınızdaki makas kolunu çekerek tramvayı tek bir işçinin bulunduğu yan hatta yönlendirebilirsiniz. Kolu çeker misiniz?',
    context: 'Philippa Foot tarafından ortaya atılan ve TYMM Ahlak Felsefesi ile Teknoloji Etiğinde otonom araç algoritmaları için incelenen deney; bir insanı araç olarak kullanmanın ahlakiliğini sorgulatır.',
    interactiveType: 'trolley',
    discussionQuestions: [
      'Bir kişinin hayatını feda ederek beş kişiyi kurtarmak her koşulda matematiksel olarak ahlaki midir?',
      'Kolu çekerek doğrudan bir ölüme sebep olmakla (eylem), hiçbir şey yapmayıp beş kişinin ölümünü izlemek (eylemsizlik) arasında ahlaki bir sorumluluk farkı var mıdır?',
      'Otonom bir yapay zekalı araç kaza anında kimi korumalıdır? Araçtaki yolcuyu mu yoksa yayaları mı?'
    ],
    mebUnit: '10. Sınıf 5. Ünite: Ahlak Felsefesi / 11. Sınıf 2. Ünite: Teknoloji ve Hayat',
    tymmCode: 'FEL.10.5.1 / FEL.11.2.2'
  },
  {
    id: 'theseus',
    title: 'Theseus\'un Gemisi & Değişim Paradoksu',
    subtitle: 'Maddi Töz, Süreklilik ve Kişisel Özdeşlik Problemi',
    field: 'Ontoloji (Varlık)',
    image: '/assets/images/ship_theseus_1794482209012.jpg',
    philosophers: ['Herakleitos', 'Aristoteles', 'Thomas Hobbes', 'John Locke'],
    summary: 'Theseus\'un ahşap gemisi limanda korunmaktadır. Yıllar geçtikçe çürüyen her tahta yenisiyle değiştirilir. Son tahta da değiştiğinde bu gemi hâlâ Theseus\'un gemisi midir?',
    context: 'TYMM Varlık Felsefesi ünitesinde töz ve oluş problemini somutlaştıran paradoks; hücreleri sürekli yenilenen insanın aynı benlik kalıp kalmadığını ve Aristoteles\'in dört nedenini tartışmaya açar.',
    interactiveType: 'theseus',
    discussionQuestions: [
      'Bir nesneyi o nesne yapan şey onu oluşturan somut atomlar mıdır, yoksa kazandığı biçim ve işlev midir?',
      'İnsan vücudundaki hücreler zamanla yenilenir. 7 yıl önceki "siz" ile bugünkü "siz" aynı kişi midir?',
      'Çıkarılan eski tahtalardan ikinci bir gemi inşa edilirse, gerçek Theseus gemisi hangisidir?'
    ],
    mebUnit: '10. Sınıf 3. Ünite: Varlık Felsefesi (Töz ve Değişim Problemi)',
    tymmCode: 'FEL.10.3.1'
  },
  {
    id: 'cave',
    title: 'Platon\'un Mağara Alegorisi & Simülasyon',
    subtitle: 'Görünüş (Doxa / Sanı) ile Hakikat (Episteme / İdea) Ayrımı',
    field: 'Epistemoloji (Bilgi)',
    image: '/assets/images/plato_cave_1794482209298.jpg',
    philosophers: ['Platon', 'Sokrates', 'René Descartes', 'Jean Baudrillard'],
    summary: 'Çocukluklarından beri bir mağarada zincirlenmiş mahkumlar, arkalarındaki ateşin duvara yansıttığı gölgeleri tek gerçeklik sanırlar. Bir mahkum zincirlerini kırıp dışarı çıktığında güneşi görür.',
    context: 'TYMM Bilgi Felsefesi ve Teknoloji ve Hayat ünitelerinde yer alan alegori; duyuların aldatıcılığı ile modern dijital simülasyonları ve algoritmik yankı odalarını sorgulamayı hedefler.',
    interactiveType: 'cave',
    discussionQuestions: [
      'Günümüz dijital çağında algoritmalar ve kişiselleştirilmiş sosyal medya akışları modern mağaramızın gölgeleri olabilir mi?',
      'Güneşin ışığı gözlerini kamaştıran ve hakikati gören kişi neden mağaradaki eski dostlarına gerçeği anlatmakta zorlanır?',
      'Rahatlatıcı bir illüzyon içinde yaşamak mı, yoksa acı verici olsa da hakikatin peşinden gitmek mi daha değerlidir?'
    ],
    mebUnit: '10. Sınıf 4. Ünite: Bilgi Felsefesi / 11. Sınıf 2. Ünite: Teknoloji ve Hayat',
    tymmCode: 'FEL.10.4.1 / FEL.11.2.1'
  },
  {
    id: 'veil',
    title: 'Rawls\'un Bilgisizlik Peçesi (Cehalet Örtüsü)',
    subtitle: 'Hakkaniyet Olarak Adalet ve Sosyal Sözleşme',
    field: 'Siyaset Felsefesi',
    image: '/assets/images/fopos_hero_agora_1794482207191.jpg',
    philosophers: ['John Rawls', 'Thomas Hobbes', 'John Locke', 'Jean-Jacques Rousseau'],
    summary: 'Toplumu sıfırdan kuracak bir kurallar bütünü belirleyeceksiniz. Ancak peçenin arkasındasınız: Doğacağınız aileyi, cinsiyetinizi, zengin mi fakir mi, sağlıklı mı engelli mi olacağınızı bilmiyorsunuz.',
    context: 'TYMM Siyaset Felsefesi ve 11. Sınıf Hukuk ve Felsefe ünitelerinde hakkaniyet kavramını ve adil gelir dağılımını temellendiren en etkili düşünce deneyi.',
    interactiveType: 'veil',
    discussionQuestions: [
      'Toplumun en dezavantajlı basamağında yer alma ihtimaliniz olsaydı, asgari ücret ve temel haklar anayasasını nasıl yazardınız?',
      'Kişisel başarılarımızın ne kadarı kendi emeğimiz, ne kadarı doğuştan gelen çevre koşullarıdır?',
      'Eşitsizlikler yalnızca toplumun en dezavantajlı kesiminin yararına olduğunda mı meşrudur? (Fark İlkesi)'
    ],
    mebUnit: '10. Sınıf 7. Ünite: Siyaset Felsefesi / 11. Sınıf 6. Ünite: Hukuk ve Felsefe',
    tymmCode: 'FEL.10.7.1 / FEL.11.6.2'
  },
  {
    id: 'chinese_room',
    title: 'Searle\'ün Çin Odası & Cahit Arf Tezi',
    subtitle: 'Sözdizim (Sentaks) vs. Anlambilim (Semantik) ve Yapay Zeka',
    field: 'Teknoloji Felsefesi',
    image: '/assets/images/fopos_hero_agora_1794482207191.jpg',
    philosophers: ['John Searle', 'Cahit Arf', 'Alan Turing', 'El-Cezeri'],
    summary: 'Çince bilmeyen bir kişi, elindeki İngilizce kural kitabına bakıp dışarıdan gelen Çince sembollere uygun karşılıkları dışarı verir. Dışarıdakiler onun akıcı Çince bildiğini sanır. Oysa o içeride hiçbir şey anlamamaktadır.',
    context: 'TYMM 11. Sınıf 2. Ünite: Teknoloji ve Hayat kapsamında; yapay zekanın verileri işlemesi ile gerçek bir bilince, duyguya ve anlama yetisine sahip olması arasındaki derin ayrımı inceler.',
    interactiveType: 'chinese_room',
    discussionQuestions: [
      'Bir bilgisayarın dili kusursuz işlemesi onun gerçekten düşündüğü anlamına gelir mi?',
      'Cahit Arf\'ın sorduğu gibi: "Makineler düşünebilir mi ve nasıl düşünebilir?" İnsanın düşünmesini makineden ayıran öz nedir?',
      'Robotlar için ahlaki sorumluluk ve haklar söz konusu olabilir mi?'
    ],
    mebUnit: '11. Sınıf 2. Ünite: Teknoloji ve Hayat (Robot Etiği ve Aksiyoloji)',
    tymmCode: 'FEL.11.2.2'
  },
  {
    id: 'eco_dilemma',
    title: 'Çevre Etiği: Baraj, Vadi ve Ekosistem',
    subtitle: 'Antroposentrizm (İnsan Merkezli) vs. Ekosentrizm (Çevre Merkezli)',
    field: 'Çevre Etiği',
    image: '/assets/images/fopos_hero_agora_1794482207191.jpg',
    philosophers: ['J.R. DesJardins', 'Hans Jonas', 'İbn Tufeyl', 'Arne Naess'],
    summary: 'Bir bölgedeki enerji ihtiyacı için temiz hidroelektrik santrali yapılması planlanmaktadır. Ancak baraj, endemik bitki ve balık türlerinin yaşadığı kadim bir vadiyi su altında bırakacaktır.',
    context: 'TYMM 11. Sınıf 1. Ünite: Çevre Sorunları ve Felsefe ünitesinde insanın doğayla ilişkisi, gelecek kuşaklara sorumluluk ve doğanın kendi içsel değeri irdelenir.',
    interactiveType: 'eco_dilemma',
    discussionQuestions: [
      'İnsanın refahı ve enerji ihtiyacı, başka canlı türlerinin yok olmasını meşrulaştırabilir mi?',
      'Doğanın insana fayda sağlamasa bile kendi başına ahlaki bir değeri var mıdır?',
      'Gelecek nesiller henüz doğmadığı halde bugün yaşayan insanların onlara karşı ahlaki bir sorumluluğu var mıdır?'
    ],
    mebUnit: '11. Sınıf 1. Ünite: Çevre Sorunları ve Felsefe',
    tymmCode: 'FEL.11.1.1 / FEL.11.1.2'
  }
];
