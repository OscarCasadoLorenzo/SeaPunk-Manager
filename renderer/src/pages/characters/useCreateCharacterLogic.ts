import { useCreateCharacter, usePlayers } from '@/hooks';
import { CreateCharacterRequest } from '@/types';
import { extractDefaultValues } from '@/utils/form-builder';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  createCharacterFormConfig,
  createCharacterFormSchema,
  type CreateCharacterFormData,
} from './createCharacterFormConfig';

export const useCreateCharacterLogic = () => {
  const [isCreating, setIsCreating] = useState(false);
  const createCharacter = useCreateCharacter();
  const { data: players } = usePlayers();

  // Extract default values for the form
  const getDefaultValues = (): CreateCharacterFormData => {
    return {
      ...(extractDefaultValues(
        createCharacterFormConfig
      ) as CreateCharacterFormData),
      level: 1,
      epicPoints: 0,
      isNPC: true, // Default to NPC
      playerName: undefined, // No player selected by default
    };
  };

  // Form setup
  const form = useForm({
    resolver: zodResolver(createCharacterFormSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange' as const,
    reValidateMode: 'onChange' as const,
    shouldFocusError: true,
  }) as any;

  // Watch isNPC to control playerName field
  const isNPC = form.watch('isNPC');

  // Create dynamic form config based on current state
  const getDynamicFormConfig = () => {
    const playerOptions =
      players?.map((player) => ({
        value: player.playerName,
        label: player.playerName,
      })) || [];

    // Clone the base config and update the playerName field
    const dynamicConfig = {
      ...createCharacterFormConfig,
      sections: createCharacterFormConfig.sections.map((section) => ({
        ...section,
        fields: section.fields.map((field) => {
          if (field.name === 'playerName') {
            return {
              ...field,
              options: playerOptions,
              disabled: isNPC,
              required: !isNPC,
            };
          }
          return field;
        }),
      })),
    };

    return dynamicConfig;
  };

  // Effect to clear playerName when isNPC changes
  useEffect(() => {
    if (isNPC) {
      form.setValue('playerName', undefined);
    }
  }, [isNPC, form]);

  // Submit handler
  const handleSubmit = async (data: CreateCharacterFormData) => {
    try {
      let playerId = '';

      // If it's not an NPC, we need a player
      if (!data.isNPC) {
        if (!data.playerName) {
          toast.error(
            'Se requiere seleccionar un jugador para personajes no NPC.'
          );
          return;
        }

        // Find the player
        const existingPlayer = players?.find(
          (p) => p.playerName === data.playerName
        );

        if (!existingPlayer) {
          toast.error('El jugador seleccionado no existe.');
          return;
        }

        playerId = existingPlayer.id;
      } else {
        // Find the player
        const existingPlayer = players?.find((p) => p.playerName === 'DJ');
        if (!existingPlayer) {
          toast.error('El jugador DJ no existe.');
          return;
        }
        playerId = existingPlayer.id;
      }

      // Prepare character data
      const characterData: CreateCharacterRequest = {
        characterName: data.characterName,
        archetype: data.archetype,
        faction: data.faction,
        race: data.race,
        level: data.level,
        category: data.category,
        epicPoints: data.epicPoints,
        type: data.isNPC ? 'NPC' : 'Player',
        isNPC: data.isNPC,
        isVisible: true, // Always visible for now
        playerId,
      };

      await createCharacter.mutateAsync(characterData);
      toast.success('¡Personaje creado exitosamente!');
      form.reset();
      setIsCreating(false);
    } catch (error) {
      toast.error('Error al crear el personaje');
      console.error('Error creating character:', error);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    form.reset();
    setIsCreating(false);
  };

  // Start creation handler
  const handleStartCreation = () => {
    setIsCreating(true);
  };

  // Loading state
  const isLoading = createCharacter.isPending;

  return {
    // State
    isCreating,
    isLoading,

    // Form
    form,

    // Handlers
    handleSubmit,
    handleCancel,
    handleStartCreation,

    // Form config (dynamic)
    createCharacterFormConfig: getDynamicFormConfig(),
  };
};

export default useCreateCharacterLogic;
