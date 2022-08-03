# PLATYPUS - Libraries Management App

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

Tipe Tabel yang biasa dipake:

- STRING(255): akan mengalokasikan langsung 255 space (255kb)
- TEXT(1024): akan alokasikan yang diisi (100kb)
- INTEGER: number
- FLOAT, DOUBLE: kalo data kita punya koma
- JSON, JSONB: kalo data kita json
- UUID: id unique, biasa buat jadi tipe dari id, alt selain integer
- BOOLEAN: true/false

Query:

Users.findAll({
    where: {

    }
})

Users.findOne({
    where: {

    }
})

Users.create()

Users.update()

Users.destroy()

### Docs Sequelize yang perlu dibaca:

- Migration
- Seeder
- Model
- Operator: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
- Include
- Attributes

### Destroy multi data

await Promise.all(
    users.map(async user => {
        await user.destroy()
    })
)