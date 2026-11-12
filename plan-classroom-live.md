# FOPOS Sprint 2 — QR Kodlu Sınıf Oturumu ve Canlı Oylama

**Durum:** Uygulama planı; kodlama başlamadan önce onay bekliyor.  
**Hedef:** Öğretmenin bir sınıf oturumu açması, QR kodu tahtada göstermesi, öğrencilerin anonim biçimde katılması ve oy sonuçlarının tahtada canlı güncellenmesi.

## 1. Mevcut durum ve sprint sınırı

Mevcut QR akışı, sabit bir uygulama bağlantısı üretiyor. Öğrenciye özel oturum veya katılım kodu yok. `ClassroomPresentationModal` içindeki oylar `useState` ile tutuluyor; `ThoughtExperimentsLab` içindeki oylar da yalnızca o tarayıcıda değişiyor. Bu sprintin amacı bu sahte sayaçları gerçek bir sınıf oturumuna dönüştürmek.

İlk sürümde öğrenci hesabı, ad-soyad, e-posta, not kaydı veya kalıcı öğrenci profili olmayacak. Öğrenciler kısa oturum kodu ve tarayıcıda üretilen anonim katılım belirteciyle oy kullanacak. Oturum kapandığında canlı oylama duracak. Kalıcı ders/öğrenci analitiği bu sprintin dışında tutulacak.

## 2. Ürün akışı

### Öğretmen akışı

1. Öğretmen akıllı tahta modunda **Sınıf Oturumu Başlat** düğmesine basar.
2. Sistem altı karakterli, tahmin edilmesi zor bir oturum kodu ve öğretmen yönetim belirteci üretir.
3. Öğretmen bir düşünce deneyi ve oylama sorusu seçer.
4. Tahta ekranında QR kod, kısa katılım adresi, oturum kodu ve bağlı öğrenci sayısı görünür.
5. Öğretmen soruyu açar veya yeni bir soru turu başlatır.
6. Sonuçlar öğrenci isimleri olmadan canlı yüzde ve toplam oy olarak güncellenir.
7. Öğretmen oylamayı kapatır, yeni tura geçer veya oturumu sonlandırır.

### Öğrenci akışı

1. Öğrenci QR kodu okutur ve `/join/:sessionCode` sayfasına gider.
2. Uygulama öğrenci için rastgele bir anonim katılım belirteci üretir; kişisel bilgi istemez.
3. Öğrenci aktif soruyu ve seçenekleri görür.
4. Bir seçeneği seçip **Oyumu Gönder** düğmesine basar.
5. Başarılı gönderimden sonra aynı tur için ikinci oy engellenir; öğrenci yalnızca sonuçların öğretmen tarafından paylaşılmasını bekler.
6. Oturum kapanırsa öğrenciye anlaşılır bir durum mesajı gösterilir.

## 3. Teknik kararlar

### Canlı iletişim modeli

İlk sprintte WebSocket yerine **REST + Server-Sent Events (SSE)** kullanılacak. Öğrencinin oy göndermesi `POST /api/classroom/sessions/:code/votes` ile yapılacak. Öğretmen ekranı `GET /api/classroom/sessions/:code/events` SSE bağlantısından katılım, oy ve tur güncellemelerini dinleyecek.

Bu modelde istemciden sunucuya sürekli çift yönlü kanal gerekmez. Öğrenciler kısa HTTP istekleri gönderir; yalnızca öğretmen ekranının canlı sonuç dinlemesi gerekir. Bağlantı koparsa `EventSource` yeniden bağlanabilir ve istemci mevcut durumu tekrar çeker.

### Oturum saklama

Sprintin pilot hedefi tek çalışan sunucu instance’ıdır. Geliştirme ve ilk pilot için bellekte tutulan session store kullanılabilir; ancak bu davranış production’da açıkça sınırlı olmalıdır. Birden fazla instance veya Cloud Run autoscaling kullanılacaksa oy sayacı ve SSE yayınları ortak Redis katmanına taşınmalıdır.

Önerilen uygulama sırası:

- İlk implementasyonda `ClassroomSessionStore` arayüzü tanımlanır.
- `MemoryClassroomSessionStore` test ve yerel geliştirme için uygulanır.
- Production ayarında Redis store seçeneği hazırlanır veya canlı yayına almadan önce ölçekleme tek instance ile sınırlandırılır.
- Store katmanı UI veya endpoint koduna gömülmez; böylece Redis geçişi yeniden yazım gerektirmez.

### Önerilen veri modeli

```ts
interface ClassroomSession {
  id: string;
  code: string;
  teacherTokenHash: string;
  status: 'lobby' | 'voting' | 'paused' | 'closed';
  experimentId: string;
  currentRoundId: string | null;
  participantCount: number;
  createdAt: string;
  expiresAt: string;
}

interface VotingRound {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  status: 'open' | 'closed';
  counts: Record<string, number>;
  voterTokens: Set<string>;
}
```

Kalıcı veritabanına yazılacak öğrenci kimliği olmayacak. Redis kullanılırsa `voterTokens` set’i oturum ve tur TTL’i ile tutulacak; ham token yerine hash saklanması tercih edilecek.

## 4. API sözleşmesi

### Öğretmen endpoint’leri

- `POST /api/classroom/sessions` — Oturum oluşturur. Gövdede `experimentId` ve ilk soru bulunur. Yanıtta `code`, `teacherToken`, `joinUrl`, `expiresAt` döner.
- `GET /api/classroom/sessions/:code` — Öğretmen token’ı ile mevcut oturum durumunu getirir.
- `POST /api/classroom/sessions/:code/rounds` — Yeni oylama turu açar veya aktif soruyu değiştirir.
- `POST /api/classroom/sessions/:code/close-round` — Aktif turu kapatır.
- `POST /api/classroom/sessions/:code/close` — Oturumu sonlandırır.
- `GET /api/classroom/sessions/:code/events` — Öğretmen için SSE canlı durum akışı.

### Öğrenci endpoint’leri

- `GET /api/classroom/join/:code` — Kodun geçerli, oturumun açık ve katılımın mümkün olup olmadığını kontrol eder.
- `POST /api/classroom/sessions/:code/participants` — Anonim katılımcı belirteci üretir veya mevcut token’ı doğrular.
- `POST /api/classroom/sessions/:code/votes` — `roundId`, `optionId` ve anonim katılım token’ı ile tek oy kabul eder.
- `GET /api/classroom/sessions/:code/rounds/:roundId` — Öğrencinin görebileceği aktif soru durumunu döner; sonuçların öğrenciye gösterilip gösterilmeyeceği öğretmen ayarına bağlı olur.

Tüm endpoint’ler için ortak hata biçimi kullanılmalı:

```json
{
  "error": {
    "code": "ROUND_ALREADY_VOTED",
    "message": "Bu tur için oyunuz daha önce kaydedildi.",
    "requestId": "..."
  }
}
```

## 5. Arayüz değişiklikleri

### Öğretmen ekranı

Mevcut `ClassroomPresentationModal` içindeki lokal sayaçlar kaldırılıp oturum state’i ile değiştirilecek. Üst çubukta şu bilgiler görünür olacak:

- Oturum kodu ve QR kodu.
- `Bağlı: 24` gibi anonim katılımcı sayısı.
- Oturum durumu: Lobi, Oylama açık, Tur kapalı veya Oturum sona erdi.
- Yeni tur, oylamayı kapat ve oturumu bitir kontrolleri.

Oylama kartı, her seçeneğin canlı oy sayısını ve yüzdesini gösterecek. Sonuçlarda öğrenci kimliği, cihaz bilgisi veya oy veren kişi listesi bulunmayacak.

### Öğrenci ekranı

Yeni ve sade bir `/join/:code` görünümü hazırlanacak. Akıllı tahta tasarımından ayrışacak; telefon ekranına öncelik verecek. Büyük soru metni, dokunması kolay seçenek kartları, tek bir gönderim düğmesi ve gönderim sonrası durum mesajı bulunacak.

Öğrenci ekranında sonuçlar varsayılan olarak oy gönderildikten sonra gösterilmeyecek. Öğretmen isterse tur sonunda tahtada sonucu açacak. Bu, öğrencilerin birbirinin seçimini görerek sonradan etkilenmesini azaltır.

### QR üretimi

Mevcut sabit `sharedUrl` kaldırılacak. QR kod şu biçimde üretilecek:

```text
${window.location.origin}/join/${session.code}
```

Lokal geliştirmede QR, telefondan erişilebilen ağ adresiyle test edilebilmeli. `localhost` bağlantısının başka cihazda çalışmayacağı arayüzde açıkça belirtilmeli; production’da sabit host kullanılmamalı.

## 6. Güvenlik ve kötüye kullanım önlemleri

- Oturum kodu yalnızca kısa bir görüntüleme kodu olacak; öğretmen yönetimi için ayrı, rastgele ve istemcide kalıcı olmayan token kullanılacak.
- Öğretmen token’ı URL’ye veya QR koduna konulmayacak.
- Aynı anonim token aynı `roundId` için yalnızca bir oy verebilecek.
- Oy endpoint’ine IP ve session code bazlı rate limit uygulanacak.
- Kod deneme saldırılarını azaltmak için başarısız katılım denemeleri sınırlandırılacak.
- Request body ve metin alanları uzunlukla sınırlandırılacak.
- Oturumlar varsayılan olarak 90 dakika sonra otomatik kapanacak.
- Kişisel veri toplanmayacak; analitik için yalnızca toplamlar ve teknik hata metrikleri tutulacak.
- CORS yalnızca aynı origin ile sınırlandırılacak; SSE endpoint’i öğretmen token’ı olmadan yönetim verisi yayınlamayacak.

## 7. Aşamalar ve kabul ölçütleri

### Aşama 1 — Domain ve endpoint temeli

Oturum, tur ve anonim katılımcı modelleri tanımlanır. Memory store arayüzü, kod üretimi, TTL, endpoint doğrulaması ve ortak hata sözleşmesi eklenir.

**Kabul ölçütü:** Bir oturum oluşturulabilir, kodla sorgulanabilir, tur açılabilir ve geçersiz istekler anlaşılır hata döndürür.

### Aşama 2 — Öğrenci katılımı

`/join/:code` akışı, anonim token üretimi ve tek oy kuralı uygulanır. Öğrenci farklı tarayıcıdan katılabilir; aynı tarayıcı yenilense bile aynı turda ikinci oy kabul edilmez.

**Kabul ölçütü:** En az 20 anonim katılımcı aynı oturuma katılabilir; her katılımcı aktif tura yalnızca bir oy gönderebilir.

### Aşama 3 — Öğretmen canlı ekranı

SSE bağlantısı, yeniden bağlanma, canlı bağlı sayısı, oy sayaçları ve tur durumları eklenir. Mevcut akıllı tahta görünümü korunur.

**Kabul ölçütü:** Öğrencinin gönderdiği oy, öğretmen ekranında sayfa yenilemeden güncellenir. SSE koparsa ekran yeniden bağlanır ve mevcut durum yeniden alınır.

### Aşama 4 — QR ve sınıf deneyimi

Dinamik QR, kısa join URL’si, lobi durumu, tur kapatma, oturum kapatma ve mobil öğrenci ekranı tamamlanır. QR rehberindeki sabit URL kaldırılır.

**Kabul ölçütü:** Öğretmen QR’ı gösterdiğinde bir telefon doğrudan katılım ekranına ulaşır; oturum kapanınca yeni oy kabul edilmez ve kullanıcıya açıklayıcı mesaj gösterilir.

### Aşama 5 — Pilot ve ölçek kararı

Gerçek cihazlarla aynı Wi-Fi ve farklı ağ senaryoları denenir. 20, 40 ve 60 katılımcı yükleriyle oy kabul süresi, SSE kopmaları ve tekrar bağlanma gözlenir. Pilot sonrasında Memory store ile devam mı edileceği, yoksa Redis’e geçiş mi gerektiği kararlaştırılır.

**Kabul ölçütü:** Gerçek bir 40 dakikalık derste öğretmen oturumu açar, sınıf QR ile katılır, en az iki oy turu yürütülür ve kapanış durumu doğru görünür.

## 8. Test planı

Birim testlerde kod çakışması, süresi dolmuş oturum, kapalı turda oy, aynı token’ın ikinci oyu, geçersiz seçenek, rate limit ve oturum kapatma test edilmeli. API testlerinde öğretmen ve öğrenci token’larının birbirine karışmadığı doğrulanmalı.

Tarayıcı testinde öğretmen ve öğrenci ekranları iki ayrı context olarak açılmalı. En az iki öğrenci katılıp oy göndermeli; öğretmen ekranındaki SSE sonucunun yenileme olmadan değiştiği gözlenmeli. Öğrenci bağlantısı kesilip geri geldiğinde aktif turun tekrar yüklenmesi kontrol edilmeli.

Production smoke testleri `/health`, oturum oluşturma, join URL’si, oy gönderme ve SSE header’larını kontrol etmeli. Aynı origin, HTTPS ve QR kodun mobil cihazdan açılabilirliği pilot öncesi doğrulanmalı.

## 9. Sprint dışında bırakılanlar

Bu sprintte kullanıcı hesabı, okul/şube yönetimi, öğrenci listesi, isimle katılım, not verme, kalıcı oy geçmişi, çoklu öğretmen yetkilendirmesi, video/sesli sınıf ve mobil native uygulama yapılmayacak. Bunlar canlı sınıf akışı doğrulandıktan sonra ayrı ürün kararları olarak ele alınmalı.

## 10. Önerilen iş sırası

İlk olarak store arayüzü ve API sözleşmesi yazılmalı. Ardından öğrenci katılımı ve tek oy kuralı tamamlanmalı; canlı SSE ekranı bundan sonra bağlanmalı. QR ve görsel polish son aşamada yapılmalı. Böylece arayüz, henüz güvenilir bir oturum modeli yokken ilerletilmemiş olur.

İlk sprint hedefi **tek öğretmen, tek aktif sınıf oturumu, anonim katılım, iki seçenekli oylama, canlı sonuç ve güvenli kapanış** olmalıdır. Bu çekirdek çalışmadan çoklu tur türleri veya gelişmiş analitik eklenmemeli.

## References

[1]: https://github.com/aytigin-netizen/Fopos-Felsefe "FOPOS GitHub repository"
