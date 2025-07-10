// Electron main process: Expose CRUD for narrative via IPC
import { eq } from 'drizzle-orm';
import { ipcMain } from 'electron';
import { db, schema } from '../../drizzle';

ipcMain.handle('narrative:getAll', async () => {
  return await db.select().from(schema.narrative);
});

ipcMain.handle('narrative:create', async (_event, data) => {
  const [created] = await db.insert(schema.narrative).values(data).returning();
  return created;
});

ipcMain.handle('narrative:update', async (_event, { characterId, ...data }) => {
  const [updated] = await db
    .update(schema.narrative)
    .set(data)
    .where(eq(schema.narrative.characterId, characterId))
    .returning();
  return updated;
});

ipcMain.handle('narrative:delete', async (_event, characterId) => {
  const [deleted] = await db
    .delete(schema.narrative)
    .where(eq(schema.narrative.characterId, characterId))
    .returning();
  return deleted;
});
