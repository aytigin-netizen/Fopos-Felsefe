# FOPOS Teknik Sprint

- [x] **Bağımlılık ve production kurulumu:** Temiz ortamda npm kurulumu peer dependency hatası vermemeli; `lint`, `build` ve açık production start komutu çalışmalı.
- [x] **Asset yolları:** Hero ve düşünce deneyi görselleri production build içinde bulunmalı ve `/assets/images/...` üzerinden servis edilmeli.
- [x] **Ders planı taslakları:** Üretilen ders planı tarayıcıda kaydedilebilmeli, sayfa yenilendikten sonra listelenebilmeli, tekrar yüklenebilmeli ve silinebilmeli.
- [x] **API sağlık kontrolü:** Production sunucusu kimlik doğrulaması gerektirmeyen `/health` endpoint’inden başarılı durum döndürmeli.

## Sprint 2 — QR Kodlu Sınıf Oturumu ve Canlı Oylama

- [x] **Session store ve öğretmen oturumu:** Oturum kodu, TTL, tur ve öğretmen yönetim token’ı ile session store ve oluşturma endpoint’i.
- [x] **Anonim öğrenci katılımı:** Join URL’si, anonim katılım token’ı ve öğrenci başına tek oy kuralı.
- [x] **Öğrenci katılım ekranı:** Mobil odaklı soru, seçenek ve gönderim sonucu ekranı.
- [x] **Canlı sonuç akışı:** SSE ile öğretmen ekranında sayfa yenilemeden sonuç ve katılımcı sayısı güncellemesi.
