//osX only ends
console.log('DEBUG: src/api/characters.ts loaded');

// Electron main process: Expose CRUD for characters via IPC
import { eq } from 'drizzle-orm';
import { ipcMain } from 'electron';
import { db, schema } from '../../drizzle';

ipcMain.handle('characters:getAll', async () => {
  console.log('DEBUG: DATABASE_URL', process.env.DATABASE_URL);
  const result = await db.select().from(schema.characters);
  console.log('DEBUG: characters:getAll result', result);
  return result;
});

ipcMain.handle('characters:create', async (_event, data) => {
  const [created] = await db.insert(schema.characters).values(data).returning();
  return created;
});

ipcMain.handle('characters:update', async (_event, { id, ...data }) => {
  const [updated] = await db
    .update(schema.characters)
    .set(data)
    .where(eq(schema.characters.id, id))
    .returning();
  return updated;
});

ipcMain.handle('characters:delete', async (_event, id) => {
  const [deleted] = await db
    .delete(schema.characters)
    .where(eq(schema.characters.id, id))
    .returning();
  return deleted;
});

export {};
