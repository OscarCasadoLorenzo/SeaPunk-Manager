# Creación de Personajes - Documentación

## Cambios Implementados

### 1. **Campo de Jugador Opcional**

- El nombre del jugador es ahora opcional para NPCs
- Se utiliza validación condicional con Zod: si `isNPC` es `false`, el jugador es requerido

### 2. **Simplificación de Campos**

- **Eliminado**: Campo "Tipo de Personaje"
- **Eliminado**: Checkbox "Visible" (no existe en el esquema de BD)
- **Mantenido**: Solo checkbox "Es NPC" que controla toda la lógica

### 3. **Lógica Dinámica del Formulario**

#### Estado por Defecto:

- ✅ Checkbox "Es NPC" marcado
- 🔒 Campo "Jugador Asociado" bloqueado y vacío
- ℹ️ Personaje se creará como NPC

#### Cuando se desmarca "Es NPC":

- ✅ Checkbox "Es NPC" desmarcado
- 🔓 Campo "Jugador Asociado" habilitado
- 📝 Selector poblado con lista de jugadores disponibles
- ⚠️ Campo "Jugador Asociado" se vuelve requerido

### 4. **Validación Mejorada**

```typescript
// Validación condicional con Zod
.refine((data) => {
  if (!data.isNPC && (!data.playerName || data.playerName.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Player name is required for non-NPC characters",
  path: ["playerName"]
});
```

### 5. **Manejo de NPCs en el Backend**

Para NPCs, se utiliza un jugador especial llamado "NPCs" que debe existir en la base de datos:

- Si no existe, el sistema mostrará un error
- Los NPCs se asocian a este jugador especial
- `type` se establece automáticamente como "NPC" o "Player"
- `isVisible` se establece como `true` por defecto

## Componentes Modificados

### `createCharacterFormConfig.ts`

- Esquema Zod con validación condicional
- Configuración de formulario simplificada
- Campo de jugador como selector con opciones dinámicas

### `useCreateCharacterLogic.ts`

- Lógica dinámica de configuración de formulario
- useEffect para limpiar campo de jugador cuando se marca NPC
- Validación mejorada antes del envío
- Manejo especial para jugador "NPCs"

### `CharacterList.tsx`

- Utiliza la configuración dinámica del formulario
- Modal responsivo con FormBuilder

## Flujo de Usuario

1. **Abrir creación**: Click en "Nuevo Personaje" en CharacterList
2. **Configuración inicial**: Formulario abre con "Es NPC" marcado
3. **Para NPCs**: Completar solo información del personaje
4. **Para PCs**: Desmarcar "Es NPC" y seleccionar jugador
5. **Envío**: Validación automática según tipo de personaje
6. **Resultado**: Personaje creado con tipo y asociaciones correctas

## Requisitos del Sistema

- **Base de Datos**: Debe existir un jugador con nombre "NPCs" para crear NPCs
- **Jugadores**: Deben existir jugadores en el sistema para seleccionar en PCs
- **FormBuilder**: Utiliza configuración dinámica que se actualiza en tiempo real

## Beneficios

- ✅ **UX Mejorado**: Un solo campo controla la lógica
- ✅ **Validación Robusta**: No se pueden crear PCs sin jugador
- ✅ **Consistencia**: Mismo sistema de formularios que edición
- ✅ **Flexibilidad**: Soporte completo para NPCs y PCs
- ✅ **Mantenibilidad**: Lógica centralizada en hooks personalizados
