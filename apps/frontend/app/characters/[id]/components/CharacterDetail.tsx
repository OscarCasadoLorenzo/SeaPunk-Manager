'use client';

import { useCharacterContext } from '@/contexts/CharacterContext';
import { useCharacterWithDetails } from '@/hooks/useCharacters';
import {
  Card,
  CardContent,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@seapunk/ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { InventoryTab } from './InventoryTab';
import { NarrativeTab } from './NarrativeTab';
import { StatsTab } from './StatsTab';

interface CharacterDetailProps {
  id: string;
}

export default function CharacterDetail({ id }: CharacterDetailProps) {
  const router = useRouter();
  const { selectedCharacterId, setSelectedCharacterId } = useCharacterContext();

  // Set the selected character ID from the URL param
  useEffect(() => {
    if (id && id !== selectedCharacterId) {
      setSelectedCharacterId(id);
    }
  }, [id, selectedCharacterId, setSelectedCharacterId]);

  const { data: character, isLoading: characterLoading } =
    useCharacterWithDetails(selectedCharacterId || id);

  const handleDeleteSuccess = () => {
    setSelectedCharacterId(null);
    router.push('/characters');
  };

  if (characterLoading || !character) {
    return (
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto'>
        <Card className='w-full'>
          <CardContent>
            <Skeleton className='h-96 w-full' />
          </CardContent>
        </Card>
      </div>
    );
  }

  const char = character as any;

  return (
    <div className='flex flex-col p-4 w-full max-w-6xl mx-auto'>
      <div className='space-y-6'>
        {/* Character header */}
        <div className='flex justify-between items-start'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight'>
              Ficha de Personaje
            </h1>
            <p className='text-muted-foreground'>
              Gestiona la información de {char.characterName}
            </p>
          </div>
        </div>

        {/* Tabbed forms */}
        <Tabs defaultValue='stats' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='stats'>Estadísticas</TabsTrigger>
            <TabsTrigger value='narrative'>Narrativa</TabsTrigger>
            <TabsTrigger value='inventory'>Inventario</TabsTrigger>
          </TabsList>

          <TabsContent value='stats' className='space-y-6'>
            <StatsTab character={char} />
          </TabsContent>

          <TabsContent value='narrative' className='space-y-6'>
            <NarrativeTab character={char} />
          </TabsContent>

          <TabsContent value='inventory' className='space-y-6'>
            <InventoryTab character={char} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
