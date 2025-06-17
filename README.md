# Esnaf Lokanta

Esnaf Lokanta, Next.js ile geliştirilmiş bir restoran yönetim ve sipariş uygulamasıdır.

## Özellikler

- Ürün ve menü yönetimi (günlük menü desteği)
- Kullanıcı yönetimi (admin paneli)
- Sipariş yönetimi
- Mesajlaşma sistemi
- Kullanıcı kayıt/giriş işlemleri
- Görsel yükleme desteği

## Kurulum

Projeyi klonlayın:

```bash
git clone <repo-link>
cd esnaf-lokanta
```

Bağımlılıkları yükleyin:

```bash
npm install
# veya
yarn install
```

Veritabanı migrasyonlarını çalıştırın:

```bash
npx prisma migrate dev
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

## Kullanım

- [http://localhost:3000](http://localhost:3000) adresini ziyaret edin.
- Admin paneline `/admin` yolundan erişebilirsiniz.

## Proje Yapısı

- `src/app/` — Uygulama sayfaları ve API route'ları
- `prisma/` — Veritabanı şeması ve migrasyonlar
- `public/` — Statik dosyalar ve görseller

## Katkı

Katkıda bulunmak isterseniz, lütfen bir issue açın veya pull request gönderin.

## Lisans

MIT Lisansı
