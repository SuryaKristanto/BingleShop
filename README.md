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

Before running the project, first create a PostgreSQL database and fill in the required environment in ".env.example" (once filled, change the file name to ".env" only). After that, migrate the tables and seeders using the script listed in package.json.

```
npm run db:migrate
```

```
npm run db:seed
```

Run the project using start:dev or start script, and the project is ready to be run locally and tested.

```
npm run start:dev
```

```
npm run start
```

## Pattern

The design pattern that I use is monolithic because the scale is small, so it is more efficient. I use MCR (Model, Controller, and Router) because I only create a back-end system for this project. First I will create files related to the database in the model, then I will create functions for endpoints according to their category in the controller, and finally I will put the function in the router to be directed to each endpoint.
