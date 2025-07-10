// Renderer process: API helpers for characters CRUD via IPC
export async function getCharacters() {
  console.log('DEBUG: characters:getAll called');
  return window.electron.ipcRenderer.invoke('characters:getAll');
}

export async function createCharacter(data: any) {
  return window.electron.ipcRenderer.invoke('characters:create', data);
}

export async function updateCharacter({ id, ...data }: any) {
  return window.electron.ipcRenderer.invoke('characters:update', {
    id,
    ...data,
  });
}

export async function deleteCharacter(id: number) {
  return window.electron.ipcRenderer.invoke('characters:delete', id);
}
