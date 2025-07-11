import { useCharacters, useTasks } from '@/hooks';
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
  const { data: tasks } = useTasks();
  const { data, isLoading, isError } = useCharacters();

  useEffect(() => {
    console.log('CharacterList component mounted');
    console.log('Data:', data);
  }, [data]);

  useEffect(() => {
    console.log('Tasks:', tasks);
  }, [tasks]);

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
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Arquetipo</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Jugador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((char: any) => (
                  <TableRow key={char.id}>
                    <TableCell>{char.id}</TableCell>
                    <TableCell>{char.characterName}</TableCell>
                    <TableCell>{char.archetype}</TableCell>
                    <TableCell>{char.race}</TableCell>
                    <TableCell>{char.level}</TableCell>
                    <TableCell>{char.playerId}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='text-center'>
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
