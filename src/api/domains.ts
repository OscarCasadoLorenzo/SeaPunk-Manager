// Electron main process: Expose CRUD for domains via IPC
import { eq } from 'drizzle-orm';
import { ipcMain } from 'electron';
import { db, schema } from '../../drizzle';

ipcMain.handle('domains:getAll', async () => {
  return await db.select().from(schema.domains);
});

ipcMain.handle('domains:create', async (_event, data) => {
  const [created] = await db.insert(schema.domains).values(data).returning();
  return created;
});

ipcMain.handle('domains:update', async (_event, { characterId, ...data }) => {
  const [updated] = await db
    .update(schema.domains)
    .set(data)
    .where(eq(schema.domains.characterId, characterId))
    .returning();
  return updated;
});

ipcMain.handle('domains:delete', async (_event, characterId) => {
  const [deleted] = await db
    .delete(schema.domains)
    .where(eq(schema.domains.characterId, characterId))
    .returning();
  return deleted;
});
