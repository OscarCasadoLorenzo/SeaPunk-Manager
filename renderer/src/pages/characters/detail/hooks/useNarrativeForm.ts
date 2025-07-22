import { useCharacterContext } from '@/contexts/CharacterContext';
import { useNarrative, useUpdateNarrative } from '@/hooks/useNarratives';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  narrativeFormSchema,
  type NarrativeFormData,
} from '../schemas/narrativeFormSchema';

export const useNarrativeForm = () => {
  const { selectedCharacterId } = useCharacterContext();

  // Data hooks
  const { data: narrative, isLoading: narrativeLoading } = useNarrative(
    selectedCharacterId || ''
  );

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

  // Update form when data changes
  React.useEffect(() => {
    if (narrative) {
      form.reset(getDefaultValues());
    }
  }, [narrative, form]);

  // Submit handler
  const handleSubmit = async (data: NarrativeFormData) => {
    if (!selectedCharacterId || !narrative?.id) return;

    try {
      await updateNarrative.mutateAsync({
        id: narrative.id,
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
