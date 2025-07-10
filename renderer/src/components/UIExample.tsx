import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from '@/ui';
import React from 'react';

export const UIExample: React.FC = () => {
  return (
    <div className='p-6 space-y-6'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>shadcn/ui Example</CardTitle>
          <CardDescription>
            This demonstrates the shadcn/ui components in your project.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' type='email' placeholder='Enter your email' />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='message'>Message</Label>
            <Textarea id='message' placeholder='Type your message here...' />
          </div>

          <div className='flex gap-2 flex-wrap'>
            <Badge variant='default'>Default</Badge>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='destructive'>Destructive</Badge>
            <Badge variant='outline'>Outline</Badge>
          </div>

          <div className='flex gap-2'>
            <Button variant='default'>Default</Button>
            <Button variant='secondary'>Secondary</Button>
            <Button variant='outline'>Outline</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
