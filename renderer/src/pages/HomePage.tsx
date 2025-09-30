'use client';

import { CharacterList } from '@/components/CharacterList';
import { QuickActions } from '@/components/QuickActions';
import {
  Character,
  CombatAction,
  CombatParticipant,
  CombatState,
  InventoryItem,
  Scene,
} from '@/components/types';
import { useCharacterData } from '@/hooks/useCharacterData';
import { CombatSetupModal } from '@/ui/components/combat-setup-modal';
import { CombatTurnModal } from '@/ui/components/combat-turn-modal';
import { Badge } from '@/ui/primitives/badge';
import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/primitives/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/primitives/tabs';
import { Textarea } from '@/ui/primitives/textarea';
import {
  Clock,
  Heart,
  Monitor,
  Plus,
  Save,
  Sparkles,
  Sword,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

function CharacterSheet({
  character,
  onSave,
  onClose,
}: {
  character: Character | null;
  onSave: (character: Character) => void;
  onClose: () => void;
}) {
  const [editingCharacter, setEditingCharacter] = useState<Character>(
    character || {
      id: Date.now().toString(),
      playerName: '',
      characterName: '',
      archetype: '',
      faction: '',
      race: '',
      level: 1,
      category: 'Común',
      attributes: {
        fuerza: 0,
        dinamismo: 0,
        voluntad: 0,
        suerte: 0,
        inteligencia: 0,
      },
      domains: {
        fisico: 0,
        batalla: 0,
        social: 0,
        ambiental: 0,
        ocultacion: 0,
        conocimiento: 0,
        tecnico: 0,
        recursos: 0,
        demoniaco: 0,
        aura: 0,
      },
      combat: {
        saludFisica: 100,
        maxSaludFisica: 100,
        resistenciaFisica: 80,
        maxResistenciaFisica: 80,
        saludMental: 100,
        maxSaludMental: 100,
        resistenciaMental: 80,
        maxResistenciaMental: 80,
        iniciativa: 10,
        defensa: 10,
        ataque: 10,
        impacto: 10,
        danoMaximo: 20,
      },
      narrative: {
        descripcionFisica: '',
        perfilExterno: '',
        perfilInterno: '',
        trasfondo: '',
        especialidades: '',
      },
      puntosEpica: 0,
      esencias: [],
      inventory: [],
      effects: [],
      donesAura: [],
      type: 'PC',
      health: 100,
      maxHealth: 100,
      resistance: 80,
      maxResistance: 80,
      initiative: 10,
      attack: 10,
      defense: 10,
      visible: true,
      isNPC: false,
    }
  );

  const handleSave = () => {
    // Sincronizar campos para compatibilidad
    const updatedCharacter = {
      ...editingCharacter,
      health: editingCharacter.combat.saludFisica,
      maxHealth: editingCharacter.combat.maxSaludFisica,
      resistance: editingCharacter.combat.resistenciaFisica,
      maxResistance: editingCharacter.combat.maxResistenciaFisica,
      initiative: editingCharacter.combat.iniciativa,
      attack: editingCharacter.combat.ataque,
      defense: editingCharacter.combat.defensa,
    };
    onSave(updatedCharacter);
    onClose();
  };

  const addInventoryItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: 'Nuevo objeto',
      description: '',
      quantity: 1,
      type: 'item',
    };
    setEditingCharacter((prev) => ({
      ...prev,
      inventory: [...prev.inventory, newItem],
    }));
  };

  const removeInventoryItem = (id: string) => {
    setEditingCharacter((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((item) => item.id !== id),
    }));
  };

  const addEsencia = () => {
    const esencia = prompt('Nombre de la esencia:');
    if (esencia) {
      setEditingCharacter((prev) => ({
        ...prev,
        esencias: [...prev.esencias, esencia],
      }));
    }
  };

  const addDonAura = () => {
    const don = prompt('Nombre del don del aura:');
    if (don) {
      setEditingCharacter((prev) => ({
        ...prev,
        donesAura: [...prev.donesAura, don],
      }));
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-background border border-border rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden'>
        <div className='flex items-center justify-between p-4 border-b border-border'>
          <h2 className='text-2xl font-bold'>
            {character ? 'Editar Personaje' : 'Nuevo Personaje'}
          </h2>
          <div className='flex gap-2'>
            <Button
              onClick={handleSave}
              className='bg-green-600 hover:bg-green-700'
            >
              <Save className='w-4 h-4 mr-2' />
              Guardar
            </Button>
            <Button onClick={onClose} variant='outline'>
              <X className='w-4 h-4' />
            </Button>
          </div>
        </div>

        <div className='overflow-y-auto max-h-[calc(90vh-80px)]'>
          <Tabs defaultValue='basic' className='w-full'>
            <TabsList className='grid w-full grid-cols-6  border-b border-slate-700'>
              <TabsTrigger value='basic'>Básico</TabsTrigger>
              <TabsTrigger value='attributes'>Atributos</TabsTrigger>
              <TabsTrigger value='combat'>Combate</TabsTrigger>
              <TabsTrigger value='narrative'>Narrativa</TabsTrigger>
              <TabsTrigger value='inventory'>Inventario</TabsTrigger>
              <TabsTrigger value='effects'>Efectos</TabsTrigger>
            </TabsList>

            <div className='p-6'>
              <TabsContent value='basic' className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='playerName'>Nombre del Jugador</Label>
                      <Input
                        id='playerName'
                        value={editingCharacter.playerName}
                        onChange={(e) =>
                          setEditingCharacter((prev) => ({
                            ...prev,
                            playerName: e.target.value,
                          }))
                        }
                        className='clean-input'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='characterName'>
                        Nombre del Personaje
                      </Label>
                      <Input
                        id='characterName'
                        value={editingCharacter.characterName}
                        onChange={(e) =>
                          setEditingCharacter((prev) => ({
                            ...prev,
                            characterName: e.target.value,
                          }))
                        }
                        className='clean-input'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='archetype'>Arquetipo</Label>
                      <Input
                        id='archetype'
                        value={editingCharacter.archetype}
                        onChange={(e) =>
                          setEditingCharacter((prev) => ({
                            ...prev,
                            archetype: e.target.value,
                          }))
                        }
                        className='clean-input'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='faction'>Facción</Label>
                      <Input
                        id='faction'
                        value={editingCharacter.faction}
                        onChange={(e) =>
                          setEditingCharacter((prev) => ({
                            ...prev,
                            faction: e.target.value,
                          }))
                        }
                        className='clean-input'
                      />
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='race'>Raza</Label>
                      <Input
                        id='race'
                        value={editingCharacter.race}
                        onChange={(e) =>
                          setEditingCharacter((prev) => ({
                            ...prev,
                            race: e.target.value,
                          }))
                        }
                        className='clean-input'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='level'>Nivel</Label>
                      <Input
                        id='level'
                        type='number'
                        value={editingCharacter.level}
                        onChange={(e) =>
                          setEditingCharacter((prev) => ({
                            ...prev,
                            level: Number.parseInt(e.target.value) || 1,
                          }))
                        }
                        className='clean-input'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='category'>Categoría</Label>
                      <Select
                        value={editingCharacter.category}
                        onValueChange={(value) =>
                          setEditingCharacter((prev) => ({
                            ...prev,
                            category: value as Character['category'],
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Común'>Común</SelectItem>
                          <SelectItem value='Protagonista I'>
                            Protagonista I
                          </SelectItem>
                          <SelectItem value='Protagonista II'>
                            Protagonista II
                          </SelectItem>
                          <SelectItem value='Protagonista III'>
                            Protagonista III
                          </SelectItem>
                          <SelectItem value='Campeón I'>Campeón I</SelectItem>
                          <SelectItem value='Campeón II'>Campeón II</SelectItem>
                          <SelectItem value='Campeón III'>
                            Campeón III
                          </SelectItem>
                          <SelectItem value='Titán I'>Titán I</SelectItem>
                          <SelectItem value='Titán II'>Titán II</SelectItem>
                          <SelectItem value='Titán III'>Titán III</SelectItem>
                          <SelectItem value='Cataclismo'>Cataclismo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='type'>Tipo</Label>
                      <Select
                        value={editingCharacter.type}
                        onValueChange={(value) =>
                          setEditingCharacter((prev) => ({
                            ...prev,
                            type: value as Character['type'],
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='PC'>Personaje Jugador</SelectItem>
                          <SelectItem value='NPC'>PNJ</SelectItem>
                          <SelectItem value='Enemy'>Enemigo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='isNPC'>¿Es NPC?</Label>
                      <Select
                        value={editingCharacter.isNPC ? 'true' : 'false'}
                        onValueChange={(value) =>
                          setEditingCharacter((prev) => ({
                            ...prev,
                            isNPC: value === 'true',
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='false'>
                            No (Tirada Manual)
                          </SelectItem>
                          <SelectItem value='true'>
                            Sí (Tirada Automática)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='puntosEpica'>Puntos de Épica (PÉP)</Label>
                  <Input
                    id='puntosEpica'
                    type='number'
                    value={editingCharacter.puntosEpica}
                    onChange={(e) =>
                      setEditingCharacter((prev) => ({
                        ...prev,
                        puntosEpica: Number.parseInt(e.target.value) || 0,
                      }))
                    }
                    className='clean-input w-32'
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Esencias</Label>
                  <div className='flex flex-wrap gap-2 mb-2'>
                    {editingCharacter.esencias.map((esencia, index) => (
                      <Badge
                        key={index}
                        variant='secondary'
                        className='cursor-pointer'
                        onClick={() => {
                          setEditingCharacter((prev) => ({
                            ...prev,
                            esencias: prev.esencias.filter(
                              (_, i) => i !== index
                            ),
                          }));
                        }}
                      >
                        {esencia} ×
                      </Badge>
                    ))}
                  </div>
                  <Button onClick={addEsencia} variant='outline' size='sm'>
                    <Plus className='w-4 h-4 mr-2' />
                    Añadir Esencia
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value='attributes' className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div>
                    <h3 className='text-lg font-semibold mb-4'>Atributos</h3>
                    <div className='space-y-4'>
                      {Object.entries(editingCharacter.attributes).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className='flex items-center justify-between'
                          >
                            <Label className='capitalize'>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Input
                              type='number'
                              value={value}
                              onChange={(e) =>
                                setEditingCharacter((prev) => ({
                                  ...prev,
                                  attributes: {
                                    ...prev.attributes,
                                    [key]: Number.parseInt(e.target.value) || 0,
                                  },
                                }))
                              }
                              className='clean-input w-20'
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className='text-lg font-semibold mb-4'>
                      Dominios + Esencias
                    </h3>
                    <div className='space-y-4'>
                      {Object.entries(editingCharacter.domains).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className='flex items-center justify-between'
                          >
                            <Label className='capitalize'>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Input
                              type='number'
                              value={value}
                              onChange={(e) =>
                                setEditingCharacter((prev) => ({
                                  ...prev,
                                  domains: {
                                    ...prev.domains,
                                    [key]: Number.parseInt(e.target.value) || 0,
                                  },
                                }))
                              }
                              className='clean-input w-20'
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='combat' className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div>
                    <h3 className='text-lg font-semibold mb-4'>
                      Salud y Resistencia
                    </h3>
                    <div className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label>Salud Física</Label>
                          <Input
                            type='number'
                            value={editingCharacter.combat.saludFisica}
                            onChange={(e) =>
                              setEditingCharacter((prev) => ({
                                ...prev,
                                combat: {
                                  ...prev.combat,
                                  saludFisica:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            className='clean-input'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label>Salud Física Máx.</Label>
                          <Input
                            type='number'
                            value={editingCharacter.combat.maxSaludFisica}
                            onChange={(e) =>
                              setEditingCharacter((prev) => ({
                                ...prev,
                                combat: {
                                  ...prev.combat,
                                  maxSaludFisica:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            className='clean-input'
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label>Resistencia Física</Label>
                          <Input
                            type='number'
                            value={editingCharacter.combat.resistenciaFisica}
                            onChange={(e) =>
                              setEditingCharacter((prev) => ({
                                ...prev,
                                combat: {
                                  ...prev.combat,
                                  resistenciaFisica:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            className='clean-input'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label>Resistencia Física Máx.</Label>
                          <Input
                            type='number'
                            value={editingCharacter.combat.maxResistenciaFisica}
                            onChange={(e) =>
                              setEditingCharacter((prev) => ({
                                ...prev,
                                combat: {
                                  ...prev.combat,
                                  maxResistenciaFisica:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            className='clean-input'
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label>Salud Mental</Label>
                          <Input
                            type='number'
                            value={editingCharacter.combat.saludMental}
                            onChange={(e) =>
                              setEditingCharacter((prev) => ({
                                ...prev,
                                combat: {
                                  ...prev.combat,
                                  saludMental:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            className='clean-input'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label>Salud Mental Máx.</Label>
                          <Input
                            type='number'
                            value={editingCharacter.combat.maxSaludMental}
                            onChange={(e) =>
                              setEditingCharacter((prev) => ({
                                ...prev,
                                combat: {
                                  ...prev.combat,
                                  maxSaludMental:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            className='clean-input'
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label>Resistencia Mental</Label>
                          <Input
                            type='number'
                            value={editingCharacter.combat.resistenciaMental}
                            onChange={(e) =>
                              setEditingCharacter((prev) => ({
                                ...prev,
                                combat: {
                                  ...prev.combat,
                                  resistenciaMental:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            className='clean-input'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label>Resistencia Mental Máx.</Label>
                          <Input
                            type='number'
                            value={editingCharacter.combat.maxResistenciaMental}
                            onChange={(e) =>
                              setEditingCharacter((prev) => ({
                                ...prev,
                                combat: {
                                  ...prev.combat,
                                  maxResistenciaMental:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            className='clean-input'
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-lg font-semibold mb-4'>
                      Parámetros de Combate
                    </h3>
                    <div className='space-y-4'>
                      {[
                        { key: 'iniciativa', label: 'Iniciativa' },
                        { key: 'defensa', label: 'Defensa' },
                        { key: 'ataque', label: 'Ataque' },
                        { key: 'impacto', label: 'Impacto' },
                        { key: 'danoMaximo', label: 'Daño Máximo' },
                      ].map(({ key, label }) => (
                        <div
                          key={key}
                          className='flex items-center justify-between'
                        >
                          <Label>{label}</Label>
                          <Input
                            type='number'
                            value={
                              editingCharacter.combat[
                                key as keyof typeof editingCharacter.combat
                              ]
                            }
                            onChange={(e) =>
                              setEditingCharacter((prev) => ({
                                ...prev,
                                combat: {
                                  ...prev.combat,
                                  [key]: Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            className='clean-input w-20'
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='narrative' className='space-y-6'>
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='descripcionFisica'>
                      Descripción Física
                    </Label>
                    <Textarea
                      id='descripcionFisica'
                      value={editingCharacter.narrative.descripcionFisica}
                      onChange={(e) =>
                        setEditingCharacter((prev) => ({
                          ...prev,
                          narrative: {
                            ...prev.narrative,
                            descripcionFisica: e.target.value,
                          },
                        }))
                      }
                      className='clean-input min-h-[100px]'
                      placeholder='Rasgos físicos, altura, complexión, etc.'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='perfilExterno'>Perfil Externo</Label>
                    <Textarea
                      id='perfilExterno'
                      value={editingCharacter.narrative.perfilExterno}
                      onChange={(e) =>
                        setEditingCharacter((prev) => ({
                          ...prev,
                          narrative: {
                            ...prev.narrative,
                            perfilExterno: e.target.value,
                          },
                        }))
                      }
                      className='clean-input min-h-[100px]'
                      placeholder='Equipo, tatuajes, implantes, apariencia general...'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='perfilInterno'>Perfil Interno</Label>
                    <Textarea
                      id='perfilInterno'
                      value={editingCharacter.narrative.perfilInterno}
                      onChange={(e) =>
                        setEditingCharacter((prev) => ({
                          ...prev,
                          narrative: {
                            ...prev.narrative,
                            perfilInterno: e.target.value,
                          },
                        }))
                      }
                      className='clean-input min-h-[100px]'
                      placeholder='Personalidad, motivaciones, miedos, objetivos...'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='trasfondo'>Trasfondo</Label>
                    <Textarea
                      id='trasfondo'
                      value={editingCharacter.narrative.trasfondo}
                      onChange={(e) =>
                        setEditingCharacter((prev) => ({
                          ...prev,
                          narrative: {
                            ...prev.narrative,
                            trasfondo: e.target.value,
                          },
                        }))
                      }
                      className='clean-input min-h-[150px]'
                      placeholder='Historia personal, eventos importantes, relaciones...'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='especialidades'>
                      Especialidades y Poderes
                    </Label>
                    <Textarea
                      id='especialidades'
                      value={editingCharacter.narrative.especialidades}
                      onChange={(e) =>
                        setEditingCharacter((prev) => ({
                          ...prev,
                          narrative: {
                            ...prev.narrative,
                            especialidades: e.target.value,
                          },
                        }))
                      }
                      className='clean-input min-h-[150px]'
                      placeholder='Magias, elixires, artes marciales, habilidades especiales...'
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='inventory' className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold'>Inventario</h3>
                  <Button onClick={addInventoryItem} variant='outline'>
                    <Plus className='w-4 h-4 mr-2' />
                    Añadir Objeto
                  </Button>
                </div>

                <div className='space-y-4'>
                  {editingCharacter.inventory.map((item) => (
                    <Card key={item.id} className='clean-card'>
                      <CardContent className='p-4'>
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                          <div className='space-y-2'>
                            <Label>Nombre</Label>
                            <Input
                              value={item.name}
                              onChange={(e) =>
                                setEditingCharacter((prev) => ({
                                  ...prev,
                                  inventory: prev.inventory.map((i) =>
                                    i.id === item.id
                                      ? { ...i, name: e.target.value }
                                      : i
                                  ),
                                }))
                              }
                              className='clean-input'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label>Tipo</Label>
                            <Select
                              value={item.type}
                              onValueChange={(value) =>
                                setEditingCharacter((prev) => ({
                                  ...prev,
                                  inventory: prev.inventory.map((i) =>
                                    i.id === item.id
                                      ? {
                                          ...i,
                                          type: value as InventoryItem['type'],
                                        }
                                      : i
                                  ),
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='weapon'>Arma</SelectItem>
                                <SelectItem value='armor'>Armadura</SelectItem>
                                <SelectItem value='item'>Objeto</SelectItem>
                                <SelectItem value='consumable'>
                                  Consumible
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className='space-y-2'>
                            <Label>Cantidad</Label>
                            <Input
                              type='number'
                              value={item.quantity}
                              onChange={(e) =>
                                setEditingCharacter((prev) => ({
                                  ...prev,
                                  inventory: prev.inventory.map((i) =>
                                    i.id === item.id
                                      ? {
                                          ...i,
                                          quantity:
                                            Number.parseInt(e.target.value) ||
                                            1,
                                        }
                                      : i
                                  ),
                                }))
                              }
                              className='clean-input'
                            />
                          </div>
                          <div className='flex items-end'>
                            <Button
                              onClick={() => removeInventoryItem(item.id)}
                              variant='destructive'
                              size='sm'
                            >
                              <X className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                        <div className='mt-4 space-y-2'>
                          <Label>Descripción</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) =>
                              setEditingCharacter((prev) => ({
                                ...prev,
                                inventory: prev.inventory.map((i) =>
                                  i.id === item.id
                                    ? { ...i, description: e.target.value }
                                    : i
                                ),
                              }))
                            }
                            className='clean-input'
                            placeholder='Descripción del objeto, efectos, etc.'
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value='effects' className='space-y-6'>
                <div className='space-y-6'>
                  <div>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-lg font-semibold'>Dones del Aura</h3>
                      <Button onClick={addDonAura} variant='outline' size='sm'>
                        <Plus className='w-4 h-4 mr-2' />
                        Añadir Don
                      </Button>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {editingCharacter.donesAura.map((don, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='cursor-pointer'
                          onClick={() => {
                            setEditingCharacter((prev) => ({
                              ...prev,
                              donesAura: prev.donesAura.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                        >
                          {don} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className='text-lg font-semibold mb-4'>
                      Efectos Activos
                    </h3>
                    <div className='space-y-4'>
                      {editingCharacter.effects.map((effect) => (
                        <Card key={effect.id} className='clean-card'>
                          <CardContent className='p-4'>
                            <div className='flex items-center justify-between'>
                              <div>
                                <div className='font-medium'>{effect.name}</div>
                                <div className='text-sm text-muted-foreground'>
                                  {effect.description}
                                </div>
                              </div>
                              <div className='flex items-center gap-2'>
                                <Badge
                                  variant={
                                    effect.type === 'buff'
                                      ? 'default'
                                      : effect.type === 'debuff'
                                        ? 'destructive'
                                        : 'secondary'
                                  }
                                >
                                  <Clock className='w-3 h-3 mr-1' />
                                  {effect.duration}
                                </Badge>
                                <Button
                                  onClick={() =>
                                    setEditingCharacter((prev) => ({
                                      ...prev,
                                      effects: prev.effects.filter(
                                        (e) => e.id !== effect.id
                                      ),
                                    }))
                                  }
                                  variant='destructive'
                                  size='sm'
                                >
                                  <X className='w-4 h-4' />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function PublicView({
  scene,
  characters,
  combatActive,
  currentTurn,
}: {
  scene: Scene;
  characters: Character[];
  combatActive: boolean;
  currentTurn: number;
}) {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='container mx-auto p-8'>
        <div className='text-center mb-8'>
          <Button
            onClick={() => window.history.back()}
            variant='ghost'
            className='absolute top-4 right-4'
          >
            Volver al Control
          </Button>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2'>
            {scene.name}
          </h1>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            {scene.description}
          </p>
        </div>

        {combatActive && (
          <Card className='mb-8 bg-red-900/20 border-red-500'>
            <CardContent className='p-6 text-center'>
              <h2 className='text-2xl font-bold text-red-400 mb-2'>
                ¡COMBATE ACTIVO!
              </h2>
              <p className='text-lg'>
                Turno de:{' '}
                <span className='font-bold text-yellow-400'>
                  {characters[currentTurn]?.characterName ||
                    characters[currentTurn]?.playerName ||
                    'N/A'}
                </span>
              </p>
            </CardContent>
          </Card>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {characters.map((character) => (
            <Card key={character.id} className='clean-card backdrop-blur'>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  {character.characterName || character.playerName}
                  <Badge
                    variant={character.type === 'PC' ? 'default' : 'secondary'}
                  >
                    {character.type}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='flex items-center gap-2'>
                      <Heart className='w-4 h-4 text-red-400' />
                      Salud
                    </span>
                    <span>
                      {character.health}/{character.maxHealth}
                    </span>
                  </div>
                  <div className='w-full progress-bar'>
                    <div
                      className='progress-fill progress-health'
                      style={{
                        width: `${
                          (character.health / character.maxHealth) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {character.effects.length > 0 && (
                  <div className='space-y-2'>
                    <div className='text-sm font-semibold flex items-center gap-2'>
                      <Zap className='w-4 h-4' />
                      Efectos
                    </div>
                    {character.effects.map((effect) => (
                      <Badge
                        key={effect.id}
                        variant={
                          effect.type === 'buff'
                            ? 'default'
                            : effect.type === 'debuff'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className='mr-2'
                      >
                        {effect.name} ({effect.duration})
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SeaPunkGMTool() {
  const [publicView, setPublicView] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null
  );

  // Use the character data hook instead of hardcoded state
  const { characters, handleSaveCharacter, toggleCharacterVisibility } =
    useCharacterData();

  // Wrapper to handle character save and close modal
  const handleSaveCharacterWrapper = (character: Character) => {
    handleSaveCharacter(character);
    setEditingCharacter(null);
  };

  const [currentScene] = useState<Scene>({
    id: '1',
    name: 'Puerto Neon',
    description:
      'Las luces de neón se reflejan en las aguas contaminadas del puerto. El aire huele a ozono y sal marina.',
    active: true,
    visible: true,
  });

  const [combatActive, setCombatActive] = useState(false);
  const [currentTurn] = useState(0);
  const [combatState, setCombatState] = useState<CombatState>({
    participants: [],
    currentTurnIndex: 0,
    round: 1,
    phase: 'setup',
    actions: [],
  });
  const [showCombatSetup, setShowCombatSetup] = useState(false);
  const [showCombatTurn, setShowCombatTurn] = useState(false);
  const [selectedCombatants, setSelectedCombatants] = useState<string[]>([]);

  // Función para calcular dados de daño según impacto
  const getDamageDiceFromImpact = (impactResult: number): number => {
    if (impactResult < 10) return 1;
    if (impactResult <= 16) return 2;
    if (impactResult <= 22) return 3;
    if (impactResult <= 26) return 4;
    if (impactResult <= 30) return 5;
    if (impactResult <= 34) return 6;
    if (impactResult <= 37) return 7;
    if (impactResult <= 40) return 8;
    return 9; // más de 40
  };

  // Función para tirar iniciativa
  const rollInitiative = (
    character: Character
  ): { total: number; roll: number } => {
    const roll =
      Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1; // 2d6
    return {
      total: character.combat.iniciativa + roll,
      roll: roll,
    };
  };

  // Función para iniciar combate
  const startCombat = () => {
    const participants: CombatParticipant[] = selectedCombatants.map((id) => {
      const character = characters.find((c) => c.id === id)!;
      const initiative = character.isNPC
        ? rollInitiative(character)
        : { total: 0, roll: 0 };

      return {
        character,
        initiative: initiative.total,
        initiativeRoll: initiative.roll,
        isActive: true,
        hasActed: false,
      };
    });

    // Ordenar por iniciativa (mayor a menor)
    participants.sort((a, b) => b.initiative - a.initiative);

    setCombatState({
      participants,
      currentTurnIndex: 0,
      round: 1,
      phase: combatActive ? 'combat' : 'initiative',
      actions: [],
    });

    setCombatActive(true);
    setShowCombatSetup(false);

    if (participants.some((p) => !p.character.isNPC && p.initiative === 0)) {
      // Hay PCs que necesitan tirar iniciativa manualmente
      setShowCombatTurn(true);
    }
  };

  // Función para procesar ataque
  const processAttack = (
    attackerId: string,
    targetId: string,
    attackRoll: number,
    bonuses = 0
  ) => {
    const attacker = combatState.participants.find(
      (p) => p.character.id === attackerId
    )?.character;
    const target = combatState.participants.find(
      (p) => p.character.id === targetId
    )?.character;

    if (!attacker || !target) return;

    const totalAttack = attacker.combat.ataque + bonuses + attackRoll;
    const defense = target.combat.defensa;

    if (totalAttack > defense) {
      // Ataque exitoso, calcular impacto
      const impactRoll = Math.floor(Math.random() * 20) + 1; // d20
      const totalImpact = attacker.combat.impacto + impactRoll;

      // Determinar dados de daño
      const damageDice = getDamageDiceFromImpact(totalImpact);
      const damageRolls: number[] = [];

      for (let i = 0; i < damageDice; i++) {
        damageRolls.push(Math.floor(Math.random() * 6) + 1);
      }

      const totalDamage = damageRolls.reduce((sum, roll) => sum + roll, 0);
      const finalDamage = Math.min(
        Math.max(0, totalDamage - target.combat.resistenciaFisica),
        attacker.combat.danoMaximo
      );

      // TODO: Update character health through hook
      // Note: This functionality needs to be implemented in the useCharacterData hook
      console.log(`Character ${targetId} should take ${finalDamage} damage`);

      // Registrar acción
      const action: CombatAction = {
        type: 'attack',
        attacker: attackerId,
        target: targetId,
        attackRoll: totalAttack,
        defenseValue: defense,
        impactRoll: totalImpact,
        damageRoll: damageRolls,
        finalDamage,
        description: `${attacker.characterName} ataca a ${target.characterName} por ${finalDamage} de daño`,
      };

      setCombatState((prev) => ({
        ...prev,
        actions: [...prev.actions, action],
      }));
    } else {
      // Ataque fallido
      const action: CombatAction = {
        type: 'attack',
        attacker: attackerId,
        target: targetId,
        attackRoll: totalAttack,
        defenseValue: defense,
        description: `${attacker.characterName} falla el ataque contra ${target.characterName}`,
      };

      setCombatState((prev) => ({
        ...prev,
        actions: [...prev.actions, action],
      }));
    }
  };

  // Función para siguiente turno
  const nextTurn = () => {
    setCombatState((prev) => {
      let nextIndex = prev.currentTurnIndex + 1;
      let nextRound = prev.round;

      if (nextIndex >= prev.participants.length) {
        nextIndex = 0;
        nextRound += 1;
      }

      return {
        ...prev,
        currentTurnIndex: nextIndex,
        round: nextRound,
        participants: prev.participants.map((p) => ({ ...p, hasActed: false })),
      };
    });
  };

  if (publicView) {
    return (
      <PublicView
        scene={currentScene}
        characters={characters.filter((c) => c.visible)}
        combatActive={combatActive}
        currentTurn={currentTurn}
      />
    );
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='container mx-auto p-4'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Sparkles className='w-8 h-8 text-cyan-400' />
              <h1 className='text-3xl font-bold text-foreground'>
                SeaPunk Unleashed GM
              </h1>
            </div>
            <Badge variant='outline' className='border-cyan-400 text-cyan-400'>
              Director Mode
            </Badge>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setPublicView(true)}
              className='clean-button-secondary'
            >
              <Monitor className='w-4 h-4 mr-2' />
              Vista Pública
            </Button>
            <Button
              variant={combatActive ? 'destructive' : 'default'}
              onClick={() => {
                if (combatActive) {
                  setCombatActive(false);
                  setCombatState({
                    participants: [],
                    currentTurnIndex: 0,
                    round: 1,
                    phase: 'setup',
                    actions: [],
                  });
                } else {
                  setShowCombatSetup(true);
                }
              }}
              className='bg-red-600 hover:bg-red-700'
            >
              <Sword className='w-4 h-4 mr-2' />
              {combatActive ? 'Finalizar Combate' : 'Iniciar Combate'}
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Characters Section */}
          <div className='lg:col-span-3'>
            <CharacterList
              characters={characters}
              onEditCharacter={setEditingCharacter}
              onToggleVisibility={toggleCharacterVisibility}
            />
          </div>

          {/* Sidebar */}
          <div className='space-y-4'>
            {/* Quick Actions */}
            <QuickActions
              onNewCharacter={() => setEditingCharacter(null)}
              onRandomEvent={() => {
                // TODO: Implement random event logic
                console.log('Random event triggered');
              }}
              onAdvanceTime={() => {
                // TODO: Implement advance time logic
                console.log('Time advanced');
              }}
              onQuickHeal={() => {
                // TODO: Implement quick heal logic
                console.log('Quick heal applied');
              }}
            />
          </div>
        </div>
      </div>

      {/* Character Sheet Modal */}
      {editingCharacter !== null && (
        <CharacterSheet
          character={editingCharacter}
          onSave={handleSaveCharacterWrapper}
          onClose={() => setEditingCharacter(null)}
        />
      )}

      {/* Combat Setup Modal */}
      {showCombatSetup && (
        <CombatSetupModal
          characters={characters}
          selectedCombatants={selectedCombatants}
          onSelectionChange={setSelectedCombatants}
          onStart={startCombat}
          onClose={() => setShowCombatSetup(false)}
        />
      )}

      {/* Combat Turn Modal */}
      {showCombatTurn && combatActive && (
        <CombatTurnModal
          combatState={combatState}
          onAttack={processAttack}
          onNextTurn={nextTurn}
          onClose={() => setShowCombatTurn(false)}
        />
      )}
    </div>
  );
}
