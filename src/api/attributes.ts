// Electron main process: Expose CRUD for attributes via IPC
import { eq } from 'drizzle-orm';
import { ipcMain } from 'electron';
import { db, schema } from '../../drizzle';

ipcMain.handle('attributes:getAll', async () => {
  return await db.select().from(schema.attributes);
});

ipcMain.handle('attributes:create', async (_event, data) => {
  const [created] = await db.insert(schema.attributes).values(data).returning();
  return created;
});

ipcMain.handle(
  'attributes:update',
  async (_event, { characterId, ...data }) => {
    const [updated] = await db
      .update(schema.attributes)
      .set(data)
      .where(eq(schema.attributes.characterId, characterId))
      .returning();
    return updated;
  }
);

ipcMain.handle('attributes:delete', async (_event, characterId) => {
  const [deleted] = await db
    .delete(schema.attributes)
    .where(eq(schema.attributes.characterId, characterId))
    .returning();
  return deleted;
});
