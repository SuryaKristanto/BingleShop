# BingleShop - Online Shopping App

## Migrations

1. Init migration

   ```
   npx sequelize init
   ```

2. Create migration

   ```
   npx sequelize migration:generate --name <name-tabel-or-action>

   # example

   npx sequelize migration:generate --name create-roles
   ```

3. Running Migration

   ```
   npx sequelize db:migrate
   ```

4. Undo Migration

   ```
   npx sequelize db:migrate:undo

   #or

   npx sequelize db:migrate:undo:all
   ```

5. Create seeder

   ```
   npx sequelize seed:generate --name <name>
   ```

6. Running seeder

   ```
   npx sequelize db:seed:all
   ```

7. Undo seeder

   ```
   npx sequelize db:seed:undo:all
   ```

## Run the app

Sebelum menjalankan proyek, terlebih dahulu buat database PostgreSQL dan isi env yang diperlukan di .env.example (setelah diisi ubah nama filenya menjadi .env saja). Setelah itu lakukan migrasi tabel dan seeder menggunakan script yang sudah tertera di package.json.

```
npm run db:migrate
```

```
npm run db:seed
```

Jalankan proyek menggunakan script start:dev maupun start, proyek sudah siap untuk dijalankan secara local dan di test.

```
npm run start:dev
```

```
npm run start
```

## Pattern

Design Pattern yang saya gunakan adalah monolithic karena skalanya yang kecil sehingga lebih efisien. Saya menggunakan MCR(Model, Controller, dan Router) karena saya hanya membuat sistem back end untuk proyek ini. Pertama saya akan membuat file-file yang berkaitan dengan database di model, kemudian saya membuat fungsi untuk endpoint sesuai kategorinya di controller, baru yang terakhir saya taruh fungsi tersebut di router untuk diarahkan ke masing-masing endpoint.
