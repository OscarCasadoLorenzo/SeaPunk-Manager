import { useCharacterContext } from '@/contexts/CharacterContext';
import {
  useAttribute,
  useAuraGiftsByCharacter,
  useCharacterWithDetails,
  useCombatStats,
  useCreateInventory,
  useDeleteInventory,
  useDomain,
  useEffects,
  useInventories,
  useNarrative,
  useUpdateAttribute,
  useUpdateCharacter,
  useUpdateCombatStats,
  useUpdateDomain,
  useUpdateInventory,
  useUpdateNarrative,
} from '@/hooks';
import { extractDefaultValues } from '@/utils/form-builder';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  characterFormConfig,
  characterFormSchema,
  createCharacterFormConfig,
  type CharacterFormData,
} from './characterFormConfig';

export const useCharacterDetailLogic = () => {
  const { selectedCharacterId } = useCharacterContext();
  const [isEditing, setIsEditing] = useState(false);

  // Data hooks
  const { data: character, isLoading: characterLoading } =
    useCharacterWithDetails(selectedCharacterId || '');
  const { data: attributes } = useAttribute(selectedCharacterId || '');
  const { data: domains } = useDomain(selectedCharacterId || '');
  const { data: combatStats } = useCombatStats(selectedCharacterId || '');
  const { data: narrative } = useNarrative(selectedCharacterId || '');
  const { data: inventories } = useInventories(selectedCharacterId || '');
  const { data: effects } = useEffects(selectedCharacterId || '');
  const { data: auraGifts } = useAuraGiftsByCharacter(
    selectedCharacterId || ''
  );

  // Mutation hooks
  const updateCharacter = useUpdateCharacter();
  const updateAttribute = useUpdateAttribute();
  const updateDomain = useUpdateDomain();
  const updateCombatStats = useUpdateCombatStats();
  const updateNarrative = useUpdateNarrative();
  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();

  // Extract current values for default form values
  const getDefaultValues = (): CharacterFormData => {
    if (!character || !attributes || !domains || !combatStats || !narrative) {
      return extractDefaultValues(characterFormConfig) as CharacterFormData;
    }

    return {
      // Basic character info
      playerName: character.player?.playerName || '',
      characterName: character.characterName,
      archetype: character.archetype,
      faction: character.faction,
      race: character.race,
      category: character.category,
      level: character.level,
      epicPoints: character.epicPoints,
      physicalDescription: narrative.physicalDescription || '',

      // Attributes
      strength: attributes.strength,
      agility: attributes.agility,
      willpower: attributes.willpower,
      luck: attributes.luck,
      intelligence: attributes.intelligence,

      // Domains
      physical: domains.physical,
      combat: domains.combat,
      social: domains.social,
      environmental: domains.environmental,
      stealth: domains.stealth,
      knowledge: domains.knowledge,
      technical: domains.technical,
      resources: domains.resources,
      demonic: domains.demonic,
      aura: domains.aura,

      // Combat Stats
      physicalHealth: combatStats.physicalHealth,
      maxPhysicalHealth: combatStats.maxPhysicalHealth,
      physicalResistance: combatStats.physicalResistance,
      maxPhysicalResistance: combatStats.maxPhysicalResistance,
      mentalHealth: combatStats.mentalHealth,
      maxMentalHealth: combatStats.maxMentalHealth,
      mentalResistance: combatStats.mentalResistance,
      maxMentalResistance: combatStats.maxMentalResistance,
      initiative: combatStats.initiative,
      defense: combatStats.defense,
      attack: combatStats.attack,
      impact: combatStats.impact,
      maxDamage: combatStats.maxDamage,

      // Narrative fields
      externalProfile: narrative.externalProfile || '',
      internalProfile: narrative.internalProfile || '',
      background: narrative.background || '',
      specialties: narrative.specialties || '',

      // Inventory array - initialize with existing inventory data
      inventories:
        inventories?.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          quantity: item.quantity,
          type: item.type as 'Objeto' | 'Consumible',
        })) || [],

      // New inventory item fields (always start empty)
      newItemName: '',
      newItemDescription: '',
      newItemQuantity: 1,
      newItemType: 'placeholder' as any,

      // Empty inventory message
      emptyInventoryMessage: 'No hay objetos en el inventario',

      // Dynamic inventory fields - spread the values for each inventory item
      ...(inventories?.reduce(
        (acc, item) => {
          acc[`inventory_${item.id}_name`] = item.name;
          acc[`inventory_${item.id}_description`] = item.description || '';
          acc[`inventory_${item.id}_quantity`] = item.quantity;
          acc[`inventory_${item.id}_type`] = item.type;
          return acc;
        },
        {} as Record<string, any>
      ) || {}),
    };
  };

  // Form setup
  const form = useForm({
    resolver: zodResolver(characterFormSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange' as const,
    reValidateMode: 'onChange' as const,
    shouldFocusError: true,
  }) as any;

  // Update form when data changes
  React.useEffect(() => {
    if (character && attributes && domains && combatStats && narrative) {
      form.reset(getDefaultValues());
    }
  }, [
    character,
    attributes,
    domains,
    combatStats,
    narrative,
    inventories,
    form,
  ]);

  // Submit handler
  const handleSubmit = async (data: CharacterFormData) => {
    if (!selectedCharacterId) return;

    try {
      // Update character basic info
      await updateCharacter.mutateAsync({
        id: selectedCharacterId,
        data: {
          characterName: data.characterName,
          archetype: data.archetype,
          faction: data.faction,
          race: data.race,
          category: data.category,
          level: data.level,
          epicPoints: data.epicPoints,
        },
      });

      // Update attributes
      if (attributes?.id) {
        await updateAttribute.mutateAsync({
          id: attributes.id,
          data: {
            strength: data.strength,
            agility: data.agility,
            willpower: data.willpower,
            luck: data.luck,
            intelligence: data.intelligence,
          },
        });
      }

      // Update domains
      if (domains?.id) {
        await updateDomain.mutateAsync({
          id: domains.id,
          data: {
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
        });
      }

      // Update combat stats
      if (combatStats?.id) {
        await updateCombatStats.mutateAsync({
          id: combatStats.id,
          data: {
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
        });
      }

      // Update narrative
      if (narrative?.id) {
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
      }

      // Update existing inventory items
      if (inventories && inventories.length > 0) {
        for (const item of inventories) {
          const nameKey = `inventory_${item.id}_name`;
          const descriptionKey = `inventory_${item.id}_description`;
          const quantityKey = `inventory_${item.id}_quantity`;
          const typeKey = `inventory_${item.id}_type`;

          // Check if any field has changed
          if (
            data[nameKey] !== item.name ||
            data[descriptionKey] !== (item.description || '') ||
            data[quantityKey] !== item.quantity ||
            data[typeKey] !== item.type
          ) {
            await updateInventory.mutateAsync({
              id: item.id,
              data: {
                name: data[nameKey],
                description: data[descriptionKey] || '',
                quantity: data[quantityKey],
                type: data[typeKey],
              },
            });
          }
        }
      }

      // Create new inventory item if provided
      if (
        data.newItemName &&
        data.newItemType &&
        data.newItemType !== 'placeholder' &&
        selectedCharacterId
      ) {
        await createInventory.mutateAsync({
          characterId: selectedCharacterId,
          name: data.newItemName,
          description: data.newItemDescription || '',
          quantity: data.newItemQuantity || 1,
          type: data.newItemType,
        });

        // Clear the new item fields after successful creation
        form.setValue('newItemName', '');
        form.setValue('newItemDescription', '');
        form.setValue('newItemQuantity', 1);
        form.setValue('newItemType', 'placeholder' as any);

        toast.success(
          `Character updated and "${data.newItemName}" added to inventory!`
        );
      } else {
        toast.success('Character updated successfully!');
      }

      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update character');
      console.error('Error updating character:', error);
    }
  };

  // Cancel edit handler
  const handleCancelEdit = () => {
    form.reset();
    setIsEditing(false);
  };

  // Edit mode handler
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // Inventory management functions
  const handleUpdateInventoryItem = async (
    itemId: string,
    updates: {
      name?: string;
      description?: string;
      quantity?: number;
      type?: string;
    }
  ) => {
    try {
      await updateInventory.mutateAsync({
        id: itemId,
        data: updates,
      });
      toast.success('Inventory item updated successfully!');
    } catch (error) {
      toast.error('Failed to update inventory item');
      console.error('Error updating inventory item:', error);
    }
  };

  const handleDeleteInventoryItem = async (
    itemId: string,
    itemName: string
  ) => {
    try {
      await deleteInventory.mutateAsync(itemId);
      toast.success(`"${itemName}" removed from inventory!`);
    } catch (error) {
      toast.error('Failed to delete inventory item');
      console.error('Error deleting inventory item:', error);
    }
  };

  // Expose delete handler globally for custom delete buttons
  React.useEffect(() => {
    (window as any).__deleteInventoryHandler = handleDeleteInventoryItem;
    return () => {
      delete (window as any).__deleteInventoryHandler;
    };
  }, [handleDeleteInventoryItem]);

  // Loading state
  const isLoading =
    updateCharacter.isPending ||
    updateAttribute.isPending ||
    updateDomain.isPending ||
    updateCombatStats.isPending ||
    updateNarrative.isPending ||
    createInventory.isPending ||
    updateInventory.isPending ||
    deleteInventory.isPending;

  // Computed values for the view
  const effectsText = [
    ...(effects?.map(
      (e) => `${e.name} (${e.duration} turnos): ${e.description || ''}`
    ) || []),
    ...(auraGifts?.map((ag) => ag.auraGift?.name) || []),
  ].join('\n');

  const inventoryText =
    inventories
      ?.map((i) => `${i.name} (${i.quantity}): ${i.description || ''}`)
      .join('\n') || '';

  return {
    // State
    selectedCharacterId,
    isEditing,
    characterLoading,
    isLoading,

    // Data
    character,
    attributes,
    domains,
    combatStats,
    narrative,
    inventories,
    effects,
    auraGifts,

    // Form
    form,

    // Computed values
    effectsText,
    inventoryText,

    // Handlers
    handleSubmit,
    handleCancelEdit,
    handleStartEdit,
    handleUpdateInventoryItem,
    handleDeleteInventoryItem,

    // Form config - generate dynamically based on inventory
    characterFormConfig: React.useMemo(() => {
      return createCharacterFormConfig(inventories || []);
    }, [inventories]),
  };
};

export default useCharacterDetailLogic;
