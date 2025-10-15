'use client';

import { Dice6, Home, Swords, Users } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className='flex h-full w-16 flex-col items-center space-y-8 border-r bg-background py-4'>
      <Link
        href='/'
        className='rounded-lg p-2 hover:bg-accent hover:text-accent-foreground'
      >
        <Home className='h-6 w-6' />
        <span className='sr-only'>Home</span>
      </Link>

      <Link
        href='/characters'
        className='rounded-lg p-2 hover:bg-accent hover:text-accent-foreground'
      >
        <Users className='h-6 w-6' />
        <span className='sr-only'>Characters</span>
      </Link>

      <Link
        href='/combat'
        className='rounded-lg p-2 hover:bg-accent hover:text-accent-foreground'
      >
        <Swords className='h-6 w-6' />
        <span className='sr-only'>Combat</span>
      </Link>

      <Link
        href='/dice'
        className='rounded-lg p-2 hover:bg-accent hover:text-accent-foreground'
      >
        <Dice6 className='h-6 w-6' />
        <span className='sr-only'>Dice Roller</span>
      </Link>
    </aside>
  );
}
