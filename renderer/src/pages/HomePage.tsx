'use client';

import { CharacterList } from '@/components/CharacterList';
import { Character } from '@/components/types';
import { useCharacterData } from '@/hooks/useCharacterData';
import { useNavigate } from '@tanstack/react-router';

export default function HomePage() {
  const { characters, isLoading, error } = useCharacterData();
  const navigate = useNavigate();

  const handleEditCharacter = (character: Character) => {
    // Navigate to characters page where the character detail will be shown
    navigate({
      to: '/characters',
      search: { characterId: character.id },
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            Lista de Personajes
          </h2>
          <p style={{ color: '#888', fontSize: '16px' }}>
            Gestiona todos tus personajes de forma sencilla
          </p>
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando personajes...</p>
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            Error al cargar personajes: {error.message}
          </div>
        )}

        {!isLoading && !error && (
          <CharacterList
            characters={characters}
            onEditCharacter={handleEditCharacter}
            onToggleVisibility={() => {}} // Sin funcionalidad por ahora
          />
        )}
      </div>
    </div>
  );
}
