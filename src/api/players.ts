// Electron main process: Expose CRUD for players via IPC
import { eq } from 'drizzle-orm';
import { ipcMain } from 'electron';
import { db, schema } from '../../drizzle';

ipcMain.handle('players:getAll', async () => {
  return await db.select().from(schema.players);
});

ipcMain.handle('players:create', async (_event, data) => {
  const [created] = await db.insert(schema.players).values(data).returning();
  return created;
});

ipcMain.handle('players:update', async (_event, { id, ...data }) => {
  const [updated] = await db
    .update(schema.players)
    .set(data)
    .where(eq(schema.players.id, id))
    .returning();
  return updated;
});

ipcMain.handle('players:delete', async (_event, id) => {
  const [deleted] = await db
    .delete(schema.players)
    .where(eq(schema.players.id, id))
    .returning();
  return deleted;
});
