import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import { Link } from '@tanstack/react-router';
import { Clock, Dice6, Heart, Plus, Zap } from 'lucide-react';

interface QuickActionsProps {
  onNewCharacter: () => void;
  onRandomEvent: () => void;
  onAdvanceTime: () => void;
  onQuickHeal: () => void;
}

export function QuickActions({
  onNewCharacter,
  onRandomEvent,
  onAdvanceTime,
  onQuickHeal,
}: QuickActionsProps) {
  return (
    <Card className='bg-slate-800/30 border-slate-700/50 backdrop-blur-sm shadow-lg'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg text-slate-200 flex items-center gap-2'>
          <Zap className='w-5 h-5 text-yellow-400' />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Button
          variant='outline'
          className='w-full justify-start bg-slate-700/30 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:border-purple-400/50 hover:text-purple-300 transition-all duration-200'
          onClick={onNewCharacter}
        >
          <Plus className='w-4 h-4 mr-2' />
          Nuevo Personaje
        </Button>
        <Button
          variant='outline'
          className='w-full justify-start bg-slate-700/30 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:border-yellow-400/50 hover:text-yellow-300 transition-all duration-200'
          onClick={onRandomEvent}
        >
          <Zap className='w-4 h-4 mr-2' />
          Evento Aleatorio
        </Button>
        <Button
          variant='outline'
          className='w-full justify-start bg-slate-700/30 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:border-blue-400/50 hover:text-blue-300 transition-all duration-200'
          onClick={onAdvanceTime}
        >
          <Clock className='w-4 h-4 mr-2' />
          Avanzar Tiempo
        </Button>
        <Button
          variant='outline'
          className='w-full justify-start bg-slate-700/30 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:border-green-400/50 hover:text-green-300 transition-all duration-200'
          onClick={onQuickHeal}
        >
          <Heart className='w-4 h-4 mr-2' />
          Curación Rápida
        </Button>
        <Link to='/dice'>
          <Button
            variant='outline'
            className='w-full justify-start bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-400/50 text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:border-cyan-300 hover:text-cyan-300 transition-all duration-200 shadow-lg'
          >
            <Dice6 className='w-4 h-4 mr-2' />
            Lanzador de Dados
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
