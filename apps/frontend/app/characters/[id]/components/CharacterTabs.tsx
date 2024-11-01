'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AttributesTab } from './AttributesTab';
import { CombatTab } from './CombatTab';
import { InventoryTab } from './InventoryTab';

interface CharacterTabsProps {
  character: Character;
}

export function CharacterTabs({ character }: CharacterTabsProps) {
  return (
    <Tabs defaultValue='attributes' className='w-full'>
      <TabsList>
        <TabsTrigger value='attributes'>Attributes & Domains</TabsTrigger>
        <TabsTrigger value='combat'>Combat Stats</TabsTrigger>
        <TabsTrigger value='inventory'>Inventory</TabsTrigger>
      </TabsList>
      <TabsContent value='attributes'>
        <AttributesTab character={character} />
      </TabsContent>
      <TabsContent value='combat'>
        <CombatTab character={character} />
      </TabsContent>
      <TabsContent value='inventory'>
        <InventoryTab character={character} />
      </TabsContent>
    </Tabs>
  );
}
