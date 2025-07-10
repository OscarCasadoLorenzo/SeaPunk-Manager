// Electron main process: Expose CRUD for essence via IPC
import { eq } from 'drizzle-orm';
import { ipcMain } from 'electron';
import { db, schema } from '../../drizzle';

ipcMain.handle('essence:getAll', async () => {
  return await db.select().from(schema.essence);
});

ipcMain.handle('essence:create', async (_event, data) => {
  const [created] = await db.insert(schema.essence).values(data).returning();
  return created;
});

ipcMain.handle('essence:update', async (_event, { characterId, ...data }) => {
  const [updated] = await db
    .update(schema.essence)
    .set(data)
    .where(eq(schema.essence.characterId, characterId))
    .returning();
  return updated;
});

ipcMain.handle('essence:delete', async (_event, characterId) => {
  const [deleted] = await db
    .delete(schema.essence)
    .where(eq(schema.essence.characterId, characterId))
    .returning();
  return deleted;
});
