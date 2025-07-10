// Electron main process: Expose CRUD for inventory via IPC
import { eq } from 'drizzle-orm';
import { ipcMain } from 'electron';
import { db, schema } from '../../drizzle';

ipcMain.handle('inventory:getAll', async () => {
  return await db.select().from(schema.inventory);
});

ipcMain.handle('inventory:create', async (_event, data) => {
  const [created] = await db.insert(schema.inventory).values(data).returning();
  return created;
});

ipcMain.handle('inventory:update', async (_event, { id, ...data }) => {
  const [updated] = await db
    .update(schema.inventory)
    .set(data)
    .where(eq(schema.inventory.id, id))
    .returning();
  return updated;
});

ipcMain.handle('inventory:delete', async (_event, id) => {
  const [deleted] = await db
    .delete(schema.inventory)
    .where(eq(schema.inventory.id, id))
    .returning();
  return deleted;
});
