'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createNarrative, getNarratives, updateNarrative } from '../actions';

export function DJPanel() {
  const queryClient = useQueryClient();
  const [newNarrative, setNewNarrative] = useState({
    title: '',
    description: '',
    notes: '',
  });

  const { data: narratives } = useQuery({
    queryKey: ['narratives'],
    queryFn: getNarratives,
  });

  const createMutation = useMutation({
    mutationFn: createNarrative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narratives'] });
      setNewNarrative({ title: '', description: '', notes: '' });
      toast({
        title: 'Narrative Created',
        description: 'New narrative has been created successfully.',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateNarrative(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narratives'] });
      toast({
        title: 'Narrative Updated',
        description: 'The narrative has been updated successfully.',
      });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newNarrative);
  };

  return (
    <div className='space-y-6'>
      <Card className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Create New Narrative</h2>
        <form onSubmit={handleCreate} className='space-y-4'>
          <div>
            <Input
              placeholder='Title'
              value={newNarrative.title}
              onChange={(e) =>
                setNewNarrative({ ...newNarrative, title: e.target.value })
              }
            />
          </div>
          <div>
            <Textarea
              placeholder='Description'
              value={newNarrative.description}
              onChange={(e) =>
                setNewNarrative({
                  ...newNarrative,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Textarea
              placeholder='GM Notes'
              value={newNarrative.notes}
              onChange={(e) =>
                setNewNarrative({ ...newNarrative, notes: e.target.value })
              }
            />
          </div>
          <Button type='submit' disabled={createMutation.isPending}>
            Create Narrative
          </Button>
        </form>
      </Card>

      <Card className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Narratives</h2>
        <Accordion type='single' collapsible className='space-y-2'>
          {narratives?.map((narrative: any) => (
            <AccordionItem key={narrative.id} value={narrative.id}>
              <AccordionTrigger>{narrative.title}</AccordionTrigger>
              <AccordionContent>
                <div className='space-y-4 pt-4'>
                  <Textarea
                    value={narrative.description}
                    onChange={(e) =>
                      updateMutation.mutate({
                        id: narrative.id,
                        data: { description: e.target.value },
                      })
                    }
                  />
                  <Textarea
                    value={narrative.notes}
                    onChange={(e) =>
                      updateMutation.mutate({
                        id: narrative.id,
                        data: { notes: e.target.value },
                      })
                    }
                    placeholder='GM Notes'
                    className='mt-2'
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}
