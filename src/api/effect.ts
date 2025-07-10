// Electron main process: Expose CRUD for effect via IPC
import { eq } from 'drizzle-orm';
import { ipcMain } from 'electron';
import { db, schema } from '../../drizzle';

ipcMain.handle('effect:getAll', async () => {
  return await db.select().from(schema.effect);
});

ipcMain.handle('effect:create', async (_event, data) => {
  const [created] = await db.insert(schema.effect).values(data).returning();
  return created;
});

ipcMain.handle('effect:update', async (_event, { id, ...data }) => {
  const [updated] = await db
    .update(schema.effect)
    .set(data)
    .where(eq(schema.effect.id, id))
    .returning();
  return updated;
});

ipcMain.handle('effect:delete', async (_event, id) => {
  const [deleted] = await db
    .delete(schema.effect)
    .where(eq(schema.effect.id, id))
    .returning();
  return deleted;
});
