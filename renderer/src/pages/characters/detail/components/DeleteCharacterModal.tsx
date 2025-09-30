import { useDeleteCharacter } from '@/hooks/useCharacters';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/primitives/alert-dialog';
import { Button } from '@/ui/primitives/button';
import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteCharacterModalProps {
  characterId: string;
  characterName: string;
  onSuccess?: () => void;
}

export function DeleteCharacterModal({
  characterId,
  characterName,
  onSuccess,
}: DeleteCharacterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationName, setConfirmationName] = useState('');
  const deleteCharacterMutation = useDeleteCharacter();

  const isDeleteEnabled = confirmationName === characterName;

  const handleDelete = async () => {
    if (!isDeleteEnabled) return;

    try {
      await deleteCharacterMutation.mutateAsync(characterId);
      toast.success(`Personaje "${characterName}" eliminado correctamente`);
      setIsOpen(false);
      setConfirmationName('');
      onSuccess?.();
    } catch (error) {
      toast.error('Error al eliminar el personaje');
      console.error('Error deleting character:', error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmationName('');
    }
    setIsOpen(open);
  };

  return (
    <>
      <Button
        variant='destructive'
        size='sm'
        onClick={() => setIsOpen(true)}
        className='gap-2'
      >
        <Trash2 className='h-4 w-4' />
        Eliminar Personaje
      </Button>

      <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
        <AlertDialogContent className='max-w-md'>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2 text-destructive'>
              <Trash2 className='h-5 w-5' />
              Eliminar Personaje
            </AlertDialogTitle>
            <AlertDialogDescription className='space-y-3'>
              <p>
                Esta acción eliminará permanentemente el personaje{' '}
                <strong>"{characterName}"</strong> y todos sus datos asociados
                incluyendo:
              </p>
              <ul className='text-sm text-muted-foreground list-disc list-inside space-y-1'>
                <li>Atributos y estadísticas</li>
                <li>Dominios y habilidades</li>
                <li>Narrativa y descripción</li>
                <li>Inventario y efectos</li>
                <li>Esencias y dones de aura</li>
              </ul>
              <p className='text-sm font-medium text-destructive'>
                Esta acción no se puede deshacer.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className='space-y-3'>
            <div className='space-y-2'>
              <Label
                htmlFor='confirmation-name'
                className='text-sm font-medium'
              >
                Para confirmar, escribe el nombre del personaje:
              </Label>
              <Input
                id='confirmation-name'
                value={confirmationName}
                onChange={(e) => setConfirmationName(e.target.value)}
                placeholder={characterName}
                className='font-mono'
                autoComplete='off'
              />
            </div>
          </div>

          <AlertDialogFooter className='gap-2'>
            <AlertDialogCancel
              onClick={() => setConfirmationName('')}
              disabled={deleteCharacterMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={!isDeleteEnabled || deleteCharacterMutation.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {deleteCharacterMutation.isPending ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className='h-4 w-4 mr-2' />
                  Eliminar Personaje
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
