# FOPOS Teknik Sprint Planı

Bu sprintin amacı mevcut prototipi yayınlanabilir ve tekrar çalıştırılabilir bir temele taşımaktır.

## Uygulama yaklaşımı

- Paket yöneticisi npm olarak sabitlenecek; Vite/esbuild peer uyumu sağlanacak.
- Görseller `public/assets/images` altında statik asset olarak servis edilecek.
- Production başlatma komutu açıkça `NODE_ENV=production` ile çalışacak ve `/health` endpoint’i sunulacak.
- Ders planı üretimleri tarayıcıdaki `localStorage` içinde taslak olarak saklanacak. Bu sprintte sunucu veritabanı veya kullanıcı hesabı eklenmeyecek.

## Proje yapısına etkisi

- `public/assets/images`: production’da doğrudan servis edilen görseller.
- `src/components/CurriculumStudio.tsx`: taslakların kaydedilmesi, yüklenmesi ve silinmesi.
- `server.ts`: health check ve production serving davranışı.
- `package.json` / `package-lock.json`: deterministik npm kurulumu ve script’ler.

## Tasarım kararı

Mevcut taş, amber ve editoryal tipografi korunacak. Taslak özelliği mevcut ders planı kartına küçük bir araç çubuğu ve ayrı kayıt listesi olarak eklenecek; sınıf içi kullanımda dikkat dağıtmayacak.
