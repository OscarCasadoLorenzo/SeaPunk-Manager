"use client";

import { useStatsForm } from "../hooks/use-stats-form";

interface StatsTabProps {
  character: any;
}

export const StatsTab = ({ character }: StatsTabProps) => {
  const { characterLoading } = useStatsForm(character);

  if (characterLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Cargando estadísticas...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Estadísticas</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
        <div>
          <strong>Jugador:</strong> {character?.player?.playerName}
        </div>
        <div>
          <strong>Personaje:</strong> {character?.characterName}
        </div>
        <div>
          <strong>Arquetipo:</strong> {character?.archetype}
        </div>
        <div>
          <strong>Facción:</strong> {character?.faction}
        </div>
        <div>
          <strong>Raza:</strong> {character?.race}
        </div>
        <div>
          <strong>Nivel:</strong> {character?.level}
        </div>
      </div>

      {/* Attributes */}
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-bold mb-2">Atributos</h3>
        <div className="grid grid-cols-3 gap-2">
          <div>Fuerza: {character?.attributes?.strength}</div>
          <div>Agilidad: {character?.attributes?.agility}</div>
          <div>Voluntad: {character?.attributes?.willpower}</div>
          <div>Suerte: {character?.attributes?.luck}</div>
          <div>Inteligencia: {character?.attributes?.intelligence}</div>
        </div>
      </div>

      {/* Domains */}
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-bold mb-2">Dominios</h3>
        <div className="grid grid-cols-3 gap-2">
          <div>Físico: {character?.domains?.physical}</div>
          <div>Combate: {character?.domains?.combat}</div>
          <div>Social: {character?.domains?.social}</div>
          <div>Ambiental: {character?.domains?.environmental}</div>
          <div>Sigilo: {character?.domains?.stealth}</div>
          <div>Conocimiento: {character?.domains?.knowledge}</div>
        </div>
      </div>

      {/* Combat Stats */}
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-bold mb-2">Estadísticas de Combate</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            Salud Física: {character?.combatStats?.physicalHealth}/
            {character?.combatStats?.maxPhysicalHealth}
          </div>
          <div>
            Resistencia Física: {character?.combatStats?.physicalResistance}/
            {character?.combatStats?.maxPhysicalResistance}
          </div>
          <div>
            Salud Mental: {character?.combatStats?.mentalHealth}/
            {character?.combatStats?.maxMentalHealth}
          </div>
          <div>
            Resistencia Mental: {character?.combatStats?.mentalResistance}/
            {character?.combatStats?.maxMentalResistance}
          </div>
          <div>Iniciativa: {character?.combatStats?.initiative}</div>
          <div>Defensa: {character?.combatStats?.defense}</div>
          <div>Ataque: {character?.combatStats?.attack}</div>
          <div>Impacto: {character?.combatStats?.impact}</div>
        </div>
      </div>
    </div>
  );
};
