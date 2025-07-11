import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CharacterContextType {
  selectedCharacterId: string | null;
  setSelectedCharacterId: (id: string | null) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

export const useCharacterContext = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error(
      'useCharacterContext must be used within a CharacterProvider'
    );
  }
  return context;
};

interface CharacterProviderProps {
  children: ReactNode;
}

export const CharacterProvider: React.FC<CharacterProviderProps> = ({
  children,
}) => {
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
};
