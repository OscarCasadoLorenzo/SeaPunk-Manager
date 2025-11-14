'use client';

import { Button } from '@seapunk/ui';
import { useRouter } from 'next/navigation';

export function CreateCharacterButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push('/characters/new')}
      className='bg-primary text-primary-foreground'
    >
      Create Character
    </Button>
  );
}
