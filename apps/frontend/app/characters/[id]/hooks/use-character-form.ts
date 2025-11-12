'use client';

import { useCharacterContext } from '@/contexts/CharacterContext';
import { useUpdateCharacter } from '@/hooks/useCharacters';
import {
  useCreateInventory,
  useDeleteInventory,
  useUpdateInventory,
} from '@/hooks/useInventories';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { inventoryFormSchema } from '../schemas/inventory-form-schema';
import { narrativeFormSchema } from '../schemas/narrative-form-schema';
import { statsFormSchema } from '../schemas/stats-form-schema';

// Combined schema for all tabs
const characterFormSchema = statsFormSchema
  .merge(narrativeFormSchema)
  .merge(inventoryFormSchema);

type CharacterFormData = z.infer<typeof characterFormSchema>;

export const useCharacterForm = (character: any) => {
  const { selectedCharacterId } = useCharacterContext();

  // Extract data from character object
  const attributes = character?.attributes;
  const domains = character?.domains;
  const combatStats = character?.combatStats;
  const narrative = character?.narrative;
  const inventories = character?.inventories || [];

  // Mutation hooks
  const updateCharacter = useUpdateCharacter();
  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();

  // Extract default values
  const getDefaultValues = (): CharacterFormData => {
    const baseValues: CharacterFormData = {
      // Basic character info
      playerName: character?.player?.playerName || '',
      characterName: character?.characterName || '',
      archetype: character?.archetype || '',
      faction: character?.faction || '',
      race: character?.race || '',
      category: character?.category || '',
      level: character?.level || 1,
      epicPoints: character?.epicPoints || 0,

      // Attributes
      strength: attributes?.strength || 1,
      agility: attributes?.agility || 1,
      willpower: attributes?.willpower || 1,
      luck: attributes?.luck || 1,
      intelligence: attributes?.intelligence || 1,

      // Domains
      physical: domains?.physical || 0,
      combat: domains?.combat || 0,
      social: domains?.social || 0,
      environmental: domains?.environmental || 0,
      stealth: domains?.stealth || 0,
      knowledge: domains?.knowledge || 0,
      technical: domains?.technical || 0,
      resources: domains?.resources || 0,
      demonic: domains?.demonic || 0,
      aura: domains?.aura || 0,

      // Combat Stats
      physicalHealth: combatStats?.physicalHealth || 100,
      maxPhysicalHealth: combatStats?.maxPhysicalHealth || 100,
      physicalResistance: combatStats?.physicalResistance || 100,
      maxPhysicalResistance: combatStats?.maxPhysicalResistance || 100,
      mentalHealth: combatStats?.mentalHealth || 100,
      maxMentalHealth: combatStats?.maxMentalHealth || 100,
      mentalResistance: combatStats?.mentalResistance || 100,
      maxMentalResistance: combatStats?.maxMentalResistance || 100,
      initiative: combatStats?.initiative || 0,
      defense: combatStats?.defense || 0,
      attack: combatStats?.attack || 0,
      impact: combatStats?.impact || 0,
      maxDamage: combatStats?.maxDamage || 0,

      // Narrative
      physicalDescription: narrative?.physicalDescription || '',
      externalProfile: narrative?.externalProfile || '',
      internalProfile: narrative?.internalProfile || '',
      background: narrative?.background || '',
      specialties: narrative?.specialties || '',

      // Inventory (base fields)
      newItemName: '',
      newItemDescription: '',
      newItemQuantity: 1,
      newItemType: undefined,
      emptyInventoryMessage: 'No hay objetos en el inventario',
    };

    // Add dynamic inventory fields
    if (inventories && inventories.length > 0) {
      const dynamicFields = inventories.reduce(
        (acc: any, item: any) => {
          acc[`inventory_${item.id}_name`] = item.name;
          acc[`inventory_${item.id}_description`] = item.description || '';
          acc[`inventory_${item.id}_quantity`] = item.quantity;
          acc[`inventory_${item.id}_type`] = item.type;
          return acc;
        },
        {} as Record<string, any>
      );

      return {
        ...baseValues,
        ...dynamicFields,
      };
    }

    return baseValues;
  };

  // Form setup
  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  // Update form when character data changes
  React.useEffect(() => {
    if (character && selectedCharacterId) {
      const defaultValues = getDefaultValues();
      form.reset(defaultValues);
    }
  }, [character, selectedCharacterId]);

  // Submit handler
  const handleSubmit = async (data: CharacterFormData) => {
    if (!selectedCharacterId) {
      toast.error('No hay personaje seleccionado');
      return;
    }

    try {
      // Build nested update payload
      const updatePayload: any = {
        characterName: data.characterName,
        archetype: data.archetype,
        faction: data.faction,
        race: data.race,
        category: data.category,
        level: data.level,
        epicPoints: data.epicPoints,
      };

      // Add attributes if they exist
      if (attributes?.id) {
        updatePayload.attributes = {
          update: {
            strength: data.strength,
            agility: data.agility,
            willpower: data.willpower,
            luck: data.luck,
            intelligence: data.intelligence,
          },
        };
      }

      // Add domains if they exist
      if (domains?.id) {
        updatePayload.domains = {
          update: {
            physical: data.physical,
            combat: data.combat,
            social: data.social,
            environmental: data.environmental,
            stealth: data.stealth,
            knowledge: data.knowledge,
            technical: data.technical,
            resources: data.resources,
            demonic: data.demonic,
            aura: data.aura,
          },
        };
      }

      // Add combat stats if they exist
      if (combatStats?.id) {
        updatePayload.combatStats = {
          update: {
            physicalHealth: data.physicalHealth,
            maxPhysicalHealth: data.maxPhysicalHealth,
            physicalResistance: data.physicalResistance,
            maxPhysicalResistance: data.maxPhysicalResistance,
            mentalHealth: data.mentalHealth,
            maxMentalHealth: data.maxMentalHealth,
            mentalResistance: data.mentalResistance,
            maxMentalResistance: data.maxMentalResistance,
            initiative: data.initiative,
            defense: data.defense,
            attack: data.attack,
            impact: data.impact,
            maxDamage: data.maxDamage,
          },
        };
      }

      // Add narrative if it exists
      if (narrative?.id) {
        updatePayload.narrative = {
          update: {
            physicalDescription: data.physicalDescription,
            externalProfile: data.externalProfile,
            internalProfile: data.internalProfile,
            background: data.background,
            specialties: data.specialties,
          },
        };
      }

      // Single PATCH request with all nested data
      await updateCharacter.mutateAsync({
        id: selectedCharacterId,
        data: updatePayload,
      });

      // Update existing inventory items
      if (inventories && inventories.length > 0) {
        for (const item of inventories) {
          const nameKey =
            `inventory_${item.id}_name` as keyof CharacterFormData;
          const descKey =
            `inventory_${item.id}_description` as keyof CharacterFormData;
          const qtyKey =
            `inventory_${item.id}_quantity` as keyof CharacterFormData;
          const typeKey =
            `inventory_${item.id}_type` as keyof CharacterFormData;

          await updateInventory.mutateAsync({
            id: item.id,
            data: {
              name: data[nameKey] as string,
              description: data[descKey] as string,
              quantity: data[qtyKey] as number,
              type: data[typeKey] as string,
            },
          });
        }
      }

      // Create new inventory item if provided
      if (data.newItemName && data.newItemType) {
        await createInventory.mutateAsync({
          characterId: selectedCharacterId,
          name: data.newItemName,
          description: data.newItemDescription || '',
          quantity: data.newItemQuantity || 1,
          type: data.newItemType as string,
        });

        // Reset new item fields
        form.setValue('newItemName', '');
        form.setValue('newItemDescription', '');
        form.setValue('newItemQuantity', 1);
        form.setValue('newItemType', undefined);
      }

      toast.success('Personaje actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el personaje');
      console.error('Error updating character:', error);
    }
  };

  // Loading state
  const isLoading =
    updateCharacter.isPending ||
    createInventory.isPending ||
    updateInventory.isPending;

  return {
    form,
    handleSubmit,
    isLoading,
  };
};
