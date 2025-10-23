'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserSettings, updateUserSettings } from '../actions';

export function SettingsForm() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getUserSettings,
  });

  const mutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: 'Settings updated',
        description: 'Your settings have been saved successfully.',
      });
    },
  });

  const handleThemeChange = (value: string) => {
    mutation.mutate({ ...settings, theme: value });
  };

  const handleToggleChange = (field: string) => (checked: boolean) => {
    mutation.mutate({ ...settings, [field]: checked });
  };

  if (!settings) return null;

  return (
    <Card className='p-6'>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <Label>Theme</Label>
          <Select value={settings.theme} onValueChange={handleThemeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='light'>Light</SelectItem>
              <SelectItem value='dark'>Dark</SelectItem>
              <SelectItem value='system'>System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center justify-between'>
          <Label htmlFor='notifications'>Notifications</Label>
          <Switch
            id='notifications'
            checked={settings.notifications}
            onCheckedChange={handleToggleChange('notifications')}
          />
        </div>

        <div className='flex items-center justify-between'>
          <Label htmlFor='autoSave'>Auto Save</Label>
          <Switch
            id='autoSave'
            checked={settings.autoSave}
            onCheckedChange={handleToggleChange('autoSave')}
          />
        </div>

        <div className='space-y-2'>
          <Label>Language</Label>
          <Select
            value={settings.language}
            onValueChange={(value) =>
              mutation.mutate({ ...settings, language: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='en'>English</SelectItem>
              <SelectItem value='es'>Spanish</SelectItem>
              <SelectItem value='fr'>French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
