# 🎮 GameBook - Aplikasi Booking

Selamat datang di **GameBook**! Satu-satunya aplikasi booking di mana yang lebih serius dari main game cuma... ya, nggak ada. README ini juga siap bikin kamu senyum-senyum sendiri!

## Apa itu GameBook?
GameBook adalah sistem booking full-stack untuk berbagai game station (PS5, PC Gaming, VR, dan lain-lain). Saking gampangnya, nenek kamu pun bisa booking VR (asal inget password-nya).

## Fitur
- Booking game station favoritmu (maaf, belum bisa booking jodoh)
- Dashboard admin dengan statistik (biar berasa jadi bos beneran)
- Autentikasi user (biar kucingmu nggak booking PS5 diam-diam)
- Ekspor data ke Excel & PDF (biar kelihatan sibuk di depan bos)
- Status real-time, maintenance, dan banyak lagi!

## Cara Menjalankan
1. Clone repo ini (tenang, bukan scam)
2. Install dependencies:
   ```bash
   npm install
   # atau
   pnpm install
   ```
3. Atur `.env` untuk MySQL (tanya temen IT, atau nebak juga boleh)
4. Jalankan migrasi:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Jalankan aplikasinya:
   ```bash
   npm run dev
   ```
6. Buka [http://localhost:3000](http://localhost:3000) dan mulai booking kayak pro!

## Stack Teknologi
- Next.js (biar ngebut)
- Prisma + MySQL (biar datanya aman)
- Tailwind CSS (biar UI-nya kece)
- React (biar kekinian)

## Jokes (biar ngoding nggak tegang)
- Kenapa gamer dikeluarin dari aplikasi booking? Soalnya dia booking "nyawa tak terbatas".
- Mode maintenance di sini beneran, servernya aja kadang ngopi dulu.
- Ekspor ke Excel biar bos ngira kamu kerja. Ekspor ke PDF biar emak bangga.
- Kalau nemu bug, itu bukan bug, itu achievement tersembunyi.

## Kontribusi
Pull request sangat diterima! Tapi kalau bikin error, traktir pizza ya. 🍕

## Lisensi
MIT. Karena berbagi itu indah (kecuali skor tertinggi).

---

Selamat booking, semoga ping-mu selalu hijau! 
Salam dari saya Availlll