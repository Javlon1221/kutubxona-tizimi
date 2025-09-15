# Kutubxona Frontend

React bilan yaratilgan kutubxona boshqaruv tizimi frontend qismi.

## Xususiyatlar

- 📚 **Kitoblar boshqaruvi** - Kitoblar qo'shish, tahrirlash, o'chirish
- 👥 **O'quvchilar boshqaruvi** - O'quvchilar ro'yxatdan o'tkazish va boshqarish
- 📖 **Kitob olish/qaytarish** - Kitob olish va qaytarish jarayoni
- 📊 **Dashboard** - Umumiy statistika va tezkor amallar
- 🎨 **Zamonaviy UI** - Tailwind CSS bilan yaratilgan responsive dizayn
- ⚡ **Tez ishlash** - Vite bundler va optimizatsiya qilingan kod

## Texnologiyalar

- **React 18** - Frontend framework
- **Vite** - Build tool va dev server
- **Tailwind CSS** - CSS framework
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Iconlar

## O'rnatish

1. Dependencies o'rnatish:
```bash
npm install
```

2. Development server ishga tushirish:
```bash
npm run dev
```

3. Browserda ochish: `http://localhost:5173`

## Backend bilan ulanish

Frontend avtomatik ravishda `http://localhost:5000` da ishlayotgan backend server bilan bog'lanadi.

Backend server ishga tushirish:
```bash
cd ../kutubxona-backend
npm start
```

## Sahifalar

- **Dashboard** (`/`) - Asosiy sahifa va statistika
- **Kitoblar** (`/books`) - Kitoblar boshqaruvi
- **O'quvchilar** (`/users`) - O'quvchilar boshqaruvi  
- **Olish/Qaytarish** (`/borrow`) - Kitob olish va qaytarish

## API Endpoints

Frontend quyidagi API endpointlar bilan ishlaydi:

### Kitoblar
- `GET /api/books` - Barcha kitoblar
- `POST /api/books` - Yangi kitob qo'shish
- `PUT /api/books/:id` - Kitobni yangilash
- `DELETE /api/books/:id` - Kitobni o'chirish

### O'quvchilar
- `GET /api/users` - Barcha o'quvchilar
- `POST /api/users` - Yangi o'quvchi qo'shish
- `PUT /api/users/:id` - O'quvchini yangilash
- `DELETE /api/users/:id` - O'quvchini o'chirish

### Kitob olish/qaytarish
- `POST /api/borrow` - Kitob olish
- `PUT /api/borrow/:id/return` - Kitob qaytarish

## Build

Production build yaratish:
```bash
npm run build
```

Build fayllar `dist/` papkasida yaratiladi.

## Linting

Kod tekshirish:
```bash
npm run lint
```