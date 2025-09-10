import { AppDataSource } from './src/database/mysql/data-source';

async function checkEntities() {
  await AppDataSource.initialize();
  console.log(
    'Entities found:',
    AppDataSource.entityMetadatas.map((e) => e.name),
  );
  await AppDataSource.destroy();
}

checkEntities();
