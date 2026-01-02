## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/suryaaji016/indonesia_satu_manajemen_Surya.git
cd indonesia_satu_manajemen_Surya
```

### 2. Setup Backend

```bash
cd server
npm install
```

### 3. Setup Frontend

```bash
cd ../client
npm install
```

## Konfigurasi

### Database Setup

1. Buat database PostgreSQL baru:

```sql
CREATE DATABASE ism_credit_scoring;
```

2. Konfigurasi database di `server/config/config.json`:

```json
{
  "development": {
    "username": "postgres",
    "password": "your_password",
    "database": "ism_credit_scoring",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

3. Buat file `.env` di folder `server`:

```
JWT_SECRET=your_jwt_secret_key_here
```

### Migrasi dan Seeding

Jalankan migrasi dan seeding data:

```bash
cd server
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## Cara Menjalankan

### Development Mode

#### 1. Jalankan Backend (Terminal 1)

```bash
cd server
npm start
```

Server akan berjalan di `http://localhost:3000`

#### 2. Jalankan Frontend (Terminal 2)

```bash
cd client
npm run dev
```

Client akan berjalan di `http://localhost:5173`
