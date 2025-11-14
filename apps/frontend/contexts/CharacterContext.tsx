'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface CharacterContextType {
  selectedCharacterId: string | null;
  setSelectedCharacterId: (id: string | null) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );

  return (
    <CharacterContext.Provider
      value={{ selectedCharacterId, setSelectedCharacterId }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacterContext() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error(
      'useCharacterContext must be used within a CharacterProvider'
    );
  }
  return context;
}
