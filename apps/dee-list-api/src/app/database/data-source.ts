import 'dotenv/config'; // Ensures .env is loaded
import { DataSource } from 'typeorm';
import { Item } from '../item/entities/item.entity';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Item],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: false,
});

// npx typeorm-ts-node-commonjs migration:generate -d src/database/data-source.ts src/migrations/initialSchemaCreation
// npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts
// apps/dee-list-api/src/app/migrations/CreateListItemsTable
// apps/dee-list-api/src/app/database/data-source.ts
