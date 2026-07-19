import 'dotenv/config'; // Ensures .env is loaded
import { DataSource } from 'typeorm';
import { join } from 'path';
import { User } from '../user/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: false
});
