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

  const navigateToCombat = () => {
    navigate({ to: '/combat' });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                Lista de Personajes en combate
              </h2>
              <p style={{ color: '#888', fontSize: '16px' }}>
                Gestiona todos tus personajes de forma sencilla
              </p>
            </div>
            <button
              onClick={navigateToCombat}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ⚔️ Sistema de Combate
            </button>
          </div>
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
