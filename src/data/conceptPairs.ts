import { ConceptCard } from '../types/philosophy';

export const PHILOSOPHY_CONCEPTS: ConceptCard[] = [
  {
    id: 'k1',
    term: 'Kategorik Buyruk (Koşulsuz Buyruk)',
    definition: 'Koşula, çıkara veya sonuca bağlı olmaksızın, sırf ahlaki bir ödev olduğu için uyulması gereken evrensel eylem ilkesi.',
    philosopherOrSchool: 'Immanuel Kant',
    branch: 'Ahlak Felsefesi'
  },
  {
    id: 'k2',
    term: 'Tabula Rasa (Boş Levha)',
    definition: 'Zihnin doğuştan hiçbir bilgi içermediği, tüm bilgi ve idelerin sonradan deneyim ve duyumlar yoluyla kazanıldığı tezi.',
    philosopherOrSchool: 'John Locke',
    branch: 'Epistemoloji'
  },
  {
    id: 'k3',
    term: 'İdealar Kuramı',
    definition: 'Duyularla algılanan değişken dünyanın sadece bir gölge olduğu, değişmeyen hakiki gerçekliğin ise akılla kavranabilen idealar aleminde bulunduğu öğretisi.',
    philosopherOrSchool: 'Platon',
    branch: 'Ontoloji & Epistemoloji'
  },
  {
    id: 'k4',
    term: 'Varoluş Özden Önce Gelir',
    definition: 'İnsanın önceden belirlenmiş sabit bir fıtratı olmadığı; önce var olduğu, ardından kendi seçimleri ve eylemleriyle kendi özünü yarattığı düşüncesi.',
    philosopherOrSchool: 'Jean-Paul Sartre',
    branch: 'Varoluşçuluk (Egzistansiyalizm)'
  },
  {
    id: 'k5',
    term: 'Fayda İlkesi (En Büyük Mutluluk)',
    definition: 'Bir eylemin ahlaki değerinin, etkilenen en fazla sayıda insana sağladığı toplam mutluluk ve haz miktarı ile ölçülmesi gerektiği tezi.',
    philosopherOrSchool: 'Jeremy Bentham & J.S. Mill',
    branch: 'Ahlak Felsefesi'
  },
  {
    id: 'k6',
    term: 'Deus sive Natura (Tanrı ya da Doğa)',
    definition: 'Evren ile Tanrı\'nın aynı tek töz olduğu, Tanrı\'nın doğanın dışında değil içkin bir zorunluluk olarak her şeyin ta kendisi olduğu panteist öğreti.',
    philosopherOrSchool: 'Baruch Spinoza',
    branch: 'Ontoloji & Metafizik'
  },
  {
    id: 'k7',
    term: 'Kritisizm (Eleştirel Felsefe)',
    definition: 'Bilginin ne yalnızca akıldan ne de yalnızca deneyden türediği; bilginin deneyle başladığı fakat aklın a priori kategorileriyle işlendiği sentez görüşü.',
    philosopherOrSchool: 'Immanuel Kant',
    branch: 'Epistemoloji'
  },
  {
    id: 'k8',
    term: 'Meşşailik (Peripatetizm)',
    definition: 'Aristoteles mantığı ve rasyonalizmini İslam inanç esaslarıyla sentezleyen, akli kanıtlamayı (burhan) merkeze alan felsefe okulu.',
    philosopherOrSchool: 'Farabi & İbn Sina & İbn Rüşd',
    branch: 'İslam Felsefesi'
  },
  {
    id: 'k9',
    term: 'Kartezyen Şüphe (Metodik Şüphe)',
    definition: 'Şüpheyi bir amaç değil, kesin ve sarsılmaz ilk bilgiye (Düşünüyorum, öyleyse varım) ulaşmak için bir araç olarak kullanan epistemolojik yöntem.',
    philosopherOrSchool: 'René Descartes',
    branch: 'Epistemoloji'
  },
  {
    id: 'k10',
    term: 'Übermensch (Üstinsan)',
    definition: 'Geleneksel ahlaki dogmaları ve sürü psikolojisini aşarak kendi değerlerini yaratan, hayatı tüm trajedisiyle kucaklayan ideal insan modeli.',
    philosopherOrSchool: 'Friedrich Nietzsche',
    branch: 'Değerler Felsefesi'
  }
];

export interface TimelinePeriod {
  era: string;
  span: string;
  theme: string;
  color: string;
  figures: { name: string; focus: string; quote: string }[];
}

export const PHILOSOPHY_TIMELINE: TimelinePeriod[] = [
  {
    era: 'Antik Çağ & Helenistik Dönem',
    span: 'M.Ö. 6. Yy — M.S. 2. Yy',
    theme: 'Mitolojiden Akla Geçiş, Doğa Sorunu, İnsan ve Polis Etiği',
    color: 'amber',
    figures: [
      { name: 'Thales', focus: 'İlk Doğacı / Arkhe (Su)', quote: 'Her şeyin başlangıcı ve temel ilkesi sudur.' },
      { name: 'Sokrates', focus: 'Ahlak ve Sokratik Yöntem', quote: 'Sorgulanmamış bir hayat yaşamaya değmez.' },
      { name: 'Platon', focus: 'İdealar Kuramı & Devlet', quote: 'Filozoflar kral ya da krallar filozof oluncaya dek kentlerin dertleri bitmez.' },
      { name: 'Aristoteles', focus: 'Mantık, Dört Neden, Altın Orta', quote: 'Bütün insanlar doğal olarak bilmek ister.' }
    ]
  },
  {
    era: 'Orta Çağ ve İslam Rönesansı',
    span: 'M.S. 2. Yy — 15. Yy',
    theme: 'Akıl ve Vahiy / İnanç Uyumu, Tümeller Problemi, Mantık Çevirileri',
    color: 'emerald',
    figures: [
      { name: 'Augustinus', focus: 'İnanç ve İrade Özgürlüğü', quote: 'Anlamak için inanıyorum.' },
      { name: 'Farabi (Muallim-i Sani)', focus: 'Erdemli Şehir (El-Medinetü\'l Fazıla)', quote: 'Erdemlerin en yücesi bilgi ve akıldır.' },
      { name: 'İbn Sina', focus: 'Uçan Adam Deneyi & Varlık', quote: 'Hiçbir duyu organın çalışmasa bile benliğinin farkındasındır.' },
      { name: 'İbn Rüşd', focus: 'Akılcılık ve Çift Hakikat', quote: 'Akıl, hakikatin tek tarafsız yargıcıdır.' }
    ]
  },
  {
    era: 'Rönesans ve 17-18. Yüzyıl Aydınlanması',
    span: '15. Yy — 18. Yy',
    theme: 'Özne, Bilimsel Yöntem, Akıl Çağı ve Sosyal Sözleşmeler',
    color: 'sky',
    figures: [
      { name: 'Francis Bacon', focus: 'Deneysel Yöntem & İdoller', quote: 'Bilgi güçtür.' },
      { name: 'René Descartes', focus: 'Cogito & Rasyonalizm', quote: 'Cogito ergo sum (Düşünüyorum, öyleyse varım).' },
      { name: 'John Locke', focus: 'Tabula Rasa & Doğal Haklar', quote: 'Zihinde daha önce duyularda bulunmayan hiçbir şey yoktur.' },
      { name: 'Immanuel Kant', focus: 'Kritisizm & Ödev Ahlakı', quote: 'Sapere Aude! Kendi aklını kullanma cesaretini göster!' }
    ]
  },
  {
    era: '19. ve 20. Yüzyıl Çağdaş Felsefe',
    span: '19. Yy — Günümüz',
    theme: 'Özgürlük, Dil Felsefesi, Varoluş, Bilim Felsefesi ve Eleştiri',
    color: 'violet',
    figures: [
      { name: 'Friedrich Nietzsche', focus: 'Güç İstemi & Değerler', quote: 'Beni öldürmeyen şey beni güçlendirir.' },
      { name: 'Ludwig Wittgenstein', focus: 'Dil ve Mantık Sınırları', quote: 'Dilimin sınırları dünyamın sınırlarıdır.' },
      { name: 'Jean-Paul Sartre', focus: 'Varoluşçuluk ve Özgürlük', quote: 'İnsan özgürlüğe mahkumdur.' },
      { name: 'Karl Popper', focus: 'Yanlışlanabilirlik & Açık Toplum', quote: 'Asla çürütülemeyecek bir teori bilimsel değildir.' }
    ]
  }
];
