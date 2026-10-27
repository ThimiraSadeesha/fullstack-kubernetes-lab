import { DataSource } from 'typeorm';
import { CreateTasksTable1761570000000 } from './migrations/1761570000000-create-tasks-table.js';
import { Task } from './tasks/task.entity.js';

// Used only by the TypeORM CLI (migration:run / migration:revert).
// The running app builds its own connection in AppModule.
export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Task],
  migrations: [CreateTasksTable1761570000000],
});
