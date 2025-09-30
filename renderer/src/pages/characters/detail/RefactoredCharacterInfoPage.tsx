import { useCharacterContext } from '@/contexts/CharacterContext';
import { useCharacterWithDetails } from '@/hooks/useCharacters';
import { Card, CardContent } from '@/ui/primitives/card';
import { Skeleton } from '@/ui/primitives/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/primitives/tabs';
import { useNavigate } from '@tanstack/react-router';
import { DeleteCharacterModal } from './components/DeleteCharacterModal';
import { InventoryTab } from './components/InventoryTab';
import { NarrativeTab } from './components/NarrativeTab';
import { StatsTab } from './components/StatsTab';

export default function RefactoredCharacterInfoPage() {
  const { selectedCharacterId, setSelectedCharacterId } = useCharacterContext();
  const { data: character, isLoading: characterLoading } =
    useCharacterWithDetails(selectedCharacterId || '');
  const navigate = useNavigate();

  const handleDeleteSuccess = () => {
    setSelectedCharacterId(null);
    navigate({ to: '/characters' });
  };

  if (!selectedCharacterId) {
    return (
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto h-full'>
        <Card className='w-full'>
          <CardContent className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>
              Selecciona un personaje para ver sus detalles
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (characterLoading) {
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

  if (!character) {
    return (
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto h-full'>
        <Card className='w-full'>
          <CardContent className='flex items-center justify-center h-64'>
            <p className='text-red-500'>Error al cargar el personaje</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Gestiona la información de {character.characterName}
            </p>
          </div>
          <DeleteCharacterModal
            characterId={character.id}
            characterName={character.characterName}
            onSuccess={handleDeleteSuccess}
          />
        </div>

        {/* Tabbed forms */}
        <Tabs defaultValue='stats' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='stats'>Estadísticas</TabsTrigger>
            <TabsTrigger value='narrative'>Narrativa</TabsTrigger>
            <TabsTrigger value='inventory'>Inventario</TabsTrigger>
          </TabsList>

          <TabsContent value='stats' className='space-y-6'>
            <StatsTab />
          </TabsContent>

          <TabsContent value='narrative' className='space-y-6'>
            <NarrativeTab />
          </TabsContent>

          <TabsContent value='inventory' className='space-y-6'>
            <InventoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
