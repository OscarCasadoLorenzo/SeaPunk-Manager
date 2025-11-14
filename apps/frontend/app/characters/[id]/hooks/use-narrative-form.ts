import { useCharacterContext } from '@/contexts/CharacterContext';
import { useUpdateNarrative } from '@/hooks/useNarratives';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  narrativeFormSchema,
  type NarrativeFormData,
} from '../schemas/narrative-form-schema';

export const useNarrativeForm = (character: any) => {
  const { selectedCharacterId } = useCharacterContext();

  // Extract data from the passed character object
  const narrative = character?.narrative;
  const narrativeLoading = false;

  // Mutation hooks
  const updateNarrative = useUpdateNarrative();

  // Extract current values for default form values
  const getDefaultValues = (): NarrativeFormData => {
    if (!narrative) {
      return {
        physicalDescription: '',
        externalProfile: '',
        internalProfile: '',
        background: '',
        specialties: '',
      };
    }

    return {
      physicalDescription: narrative.physicalDescription || '',
      externalProfile: narrative.externalProfile || '',
      internalProfile: narrative.internalProfile || '',
      background: narrative.background || '',
      specialties: narrative.specialties || '',
    };
  };

  // Form setup
  const form = useForm<NarrativeFormData>({
    resolver: zodResolver(narrativeFormSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  // Reset form when character changes (immediate reset to prevent showing old data)
  React.useEffect(() => {
    if (selectedCharacterId) {
      // Immediately reset to default empty values when character changes
      form.reset({
        physicalDescription: '',
        externalProfile: '',
        internalProfile: '',
        background: '',
        specialties: '',
      });
    }
  }, [selectedCharacterId]);

  // Update form with actual narrative data when it loads
  React.useEffect(() => {
    if (narrative && selectedCharacterId) {
      const defaultValues = getDefaultValues();
      form.reset(defaultValues);
    }
  }, [narrative, selectedCharacterId]);

  // Submit handler
  const handleSubmit = async (data: NarrativeFormData) => {
    const narr = narrative as any;
    if (!selectedCharacterId || !narr?.id) return;

    try {
      await updateNarrative.mutateAsync({
        id: narr.id,
        data: {
          physicalDescription: data.physicalDescription,
          externalProfile: data.externalProfile,
          internalProfile: data.internalProfile,
          background: data.background,
          specialties: data.specialties,
        },
      });

      toast.success('Narrativa actualizada correctamente');
    } catch (error) {
      toast.error('Error al actualizar la narrativa');
      console.error('Error updating narrative:', error);
    }
  };

  // Loading state
  const isLoading = updateNarrative.isPending;

  return {
    form,
    handleSubmit,
    isLoading,
    narrativeLoading,
    narrative,
  };
};
