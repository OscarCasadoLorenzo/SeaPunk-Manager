// Electron main process: Expose CRUD for auragifts via IPC
import { eq } from 'drizzle-orm';
import { ipcMain } from 'electron';
import { db, schema } from '../../drizzle';

ipcMain.handle('auragifts:getAll', async () => {
  return await db.select().from(schema.auraGift);
});

ipcMain.handle('auragifts:create', async (_event, data) => {
  const [created] = await db.insert(schema.auraGift).values(data).returning();
  return created;
});

ipcMain.handle('auragifts:update', async (_event, { characterId, ...data }) => {
  const [updated] = await db
    .update(schema.auraGift)
    .set(data)
    .where(eq(schema.auraGift.characterId, characterId))
    .returning();
  return updated;
});

ipcMain.handle('auragifts:delete', async (_event, characterId) => {
  const [deleted] = await db
    .delete(schema.auraGift)
    .where(eq(schema.auraGift.characterId, characterId))
    .returning();
  return deleted;
});
