// Electron main process: Expose CRUD for combatstats via IPC
import { eq } from 'drizzle-orm';
import { ipcMain } from 'electron';
import { db, schema } from '../../drizzle';

ipcMain.handle('combatstats:getAll', async () => {
  return await db.select().from(schema.combatStats);
});

ipcMain.handle('combatstats:create', async (_event, data) => {
  const [created] = await db
    .insert(schema.combatStats)
    .values(data)
    .returning();
  return created;
});

ipcMain.handle(
  'combatstats:update',
  async (_event, { characterId, ...data }) => {
    const [updated] = await db
      .update(schema.combatStats)
      .set(data)
      .where(eq(schema.combatStats.characterId, characterId))
      .returning();
    return updated;
  }
);

ipcMain.handle('combatstats:delete', async (_event, characterId) => {
  const [deleted] = await db
    .delete(schema.combatStats)
    .where(eq(schema.combatStats.characterId, characterId))
    .returning();
  return deleted;
});
