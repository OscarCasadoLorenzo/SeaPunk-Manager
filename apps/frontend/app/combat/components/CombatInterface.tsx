'use client';

import {
  Button,
  Card,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from '@seapunk/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HealthManagementPanel } from '../../../components/HealthManagementPanel';
import { getCombatState, startCombat, updateCombatState } from '../actions';

interface CombatParticipant {
  id: string;
  initiative: number;
  character: {
    id: string;
    characterName: string;
    combatStats: {
      currentHealth: number;
      maxHealth: number;
    };
  };
  effects: Array<{
    id: string;
    name: string;
  }>;
}

interface CombatState {
  id: string;
  characters: CombatParticipant[];
}

export function CombatInterface() {
  const queryClient = useQueryClient();
  const { data: combatState } = useQuery({
    queryKey: ['combat'],
    queryFn: getCombatState,
  });

  const startCombatMutation = useMutation({
    mutationFn: startCombat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combat'] });
      toast({
        title: 'Combat Started',
        description: 'The combat has been initiated successfully.',
      });
    },
  });

  const updateCombatMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCombatState(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combat'] });
    },
  });

  const handleStartCombat = (characterIds: string[]) => {
    startCombatMutation.mutate(characterIds);
  };

  const handleInitiativeChange = (characterId: string, initiative: number) => {
    if (!combatState) return;

    updateCombatMutation.mutate({
      id: combatState.id,
      data: {
        characters: {
          update: {
            where: { id: characterId },
            data: { initiative },
          },
        },
      },
    });
  };

  if (!combatState?.characters?.length) {
    return (
      <Card className='p-6'>
        <p className='text-center text-muted-foreground mb-4'>
          No active combat
        </p>
        <Button
          onClick={() => handleStartCombat([])}
          disabled={startCombatMutation.isPending}
        >
          Start New Combat
        </Button>
      </Card>
    );
  }

  return (
    <Card className='p-6'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Initiative</TableHead>
            <TableHead>Health</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {combatState.characters
            .sort((a, b) => b.initiative - a.initiative)
            .map((combatant) => (
              <TableRow key={combatant.id}>
                <TableCell>{combatant.character.characterName}</TableCell>
                <TableCell>
                  <Input
                    type='number'
                    value={combatant.initiative}
                    onChange={(e) =>
                      handleInitiativeChange(
                        combatant.id,
                        parseInt(e.target.value) || 0
                      )
                    }
                    className='w-20'
                  />
                </TableCell>
                <TableCell>
                  <HealthManagementPanel character={combatant.character} />
                </TableCell>
                <TableCell>
                  {combatant.effects.map((effect) => effect.name).join(', ')}
                </TableCell>
                <TableCell>{/* Add action buttons here */}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
}
