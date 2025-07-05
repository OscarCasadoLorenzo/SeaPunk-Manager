import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/primitives/tabs';
import { Textarea } from '@/ui/primitives/textarea';
import React from 'react';

export default function CharacterInfoPage() {
  return (
    <div className='flex flex-col items-center justify-center p-4 w-full max-w-3xl mx-auto'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Ficha de Personaje</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='numerales' className='w-full'>
            <TabsList className='mb-4'>
              <TabsTrigger value='numerales'>Numerales</TabsTrigger>
              <TabsTrigger value='narrativos'>Narrativos</TabsTrigger>
            </TabsList>
            <TabsContent value='numerales'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Nombre del jugador</Label>
                  <Input placeholder='Nombre del jugador' />
                </div>
                <div>
                  <Label>Nombre del personaje</Label>
                  <Input placeholder='Nombre del personaje' />
                </div>
                <div>
                  <Label>Arquetipo</Label>
                  <Input placeholder='Arquetipo' />
                </div>
                <div>
                  <Label>Facción</Label>
                  <Input placeholder='Facción' />
                </div>
                <div>
                  <Label>Raza</Label>
                  <Input placeholder='Raza' />
                </div>
                <div>
                  <Label>Categoría</Label>
                  <Input placeholder='Categoría' />
                </div>
                <div>
                  <Label>Nivel</Label>
                  <Input type='number' placeholder='Nivel' />
                </div>
                <div>
                  <Label>Puntos de Épica (PÉP)</Label>
                  <Input type='number' placeholder='PÉP' />
                </div>
                <div>
                  <Label>Esencias</Label>
                  <Input placeholder='Esencias' />
                </div>
                <div>
                  <Label>Descripción física</Label>
                  <Input placeholder='Descripción física' />
                </div>
              </div>
              <div className='mt-6 grid grid-cols-2 gap-4'>
                <div>
                  <Label>Atributos</Label>
                  <Textarea
                    className='min-h-[80px]'
                    placeholder='FUE, DIN, VOL, SUR, INT'
                  />
                </div>
                <div>
                  <Label>Dominios + Esencias</Label>
                  <Textarea
                    className='min-h-[80px]'
                    placeholder='FISICO, BATALLA, SOCIAL, ...'
                  />
                </div>
                <div>
                  <Label>Parámetros de combate</Label>
                  <Textarea
                    className='min-h-[80px]'
                    placeholder='Salud física, Resistencia física, Salud mental, ...'
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value='narrativos'>
              <div className='grid gap-4'>
                <div>
                  <Label>Perfil externo</Label>
                  <Textarea
                    className='min-h-[60px]'
                    placeholder='Rasgos físicos, equipo, tatuajes, implantes, apariencia...'
                  />
                </div>
                <div>
                  <Label>Perfil interno</Label>
                  <Textarea
                    className='min-h-[60px]'
                    placeholder='Personalidad, motivaciones, etc.'
                  />
                </div>
                <div>
                  <Label>Trasfondo</Label>
                  <Textarea
                    className='min-h-[60px]'
                    placeholder='Historia, eventos importantes...'
                  />
                </div>
                <div>
                  <Label>Especialidades y poderes</Label>
                  <Textarea
                    className='min-h-[60px]'
                    placeholder='Magias, elixires, artes marciales...'
                  />
                </div>
                <div>
                  <Label>Efectos Especiales y Dones del Aura</Label>
                  <Textarea
                    className='min-h-[60px]'
                    placeholder='Efectos, dones...'
                  />
                </div>
                <div>
                  <Label>Inventario</Label>
                  <Textarea
                    className='min-h-[60px]'
                    placeholder='Objetos, equipo, etc.'
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className='mt-6 flex justify-end'>
            <Button>Guardar ficha</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
