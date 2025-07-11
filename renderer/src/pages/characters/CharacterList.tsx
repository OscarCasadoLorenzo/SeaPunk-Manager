import { useCharacterContext } from '@/contexts/CharacterContext';
import { useCharacters } from '@/hooks';
import { Character } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import { Skeleton } from '@/ui/primitives/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/primitives/table';
import { useEffect } from 'react';

export default function CharacterList() {
  const { data, isLoading, isError } = useCharacters();
  const { selectedCharacterId, setSelectedCharacterId } = useCharacterContext();

  useEffect(() => {
    console.log('CharacterList component mounted');
    console.log('Data:', data);
  }, [data]);

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacterId(characterId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Personajes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-8 w-full' />
        ) : isError ? (
          <div className='text-red-500'>Error al cargar personajes.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Arquetipo</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Jugador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((char: Character) => (
                  <TableRow
                    key={char.id}
                    className={`cursor-pointer hover:bg-muted/50 ${
                      selectedCharacterId === char.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => handleCharacterSelect(char.id)}
                  >
                    <TableCell className='font-medium'>
                      {char.characterName}
                    </TableCell>
                    <TableCell>{char.archetype}</TableCell>
                    <TableCell>{char.race}</TableCell>
                    <TableCell>{char.level}</TableCell>
                    <TableCell>
                      {char.player?.playerName || char.playerId}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='text-center'>
                    No hay personajes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
