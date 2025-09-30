import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from '@/ui';
import {
  AlertTriangle,
  Database,
  Download,
  RotateCcw,
  Upload,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetPhrase, setResetPhrase] = useState('');
  const [backupStats, setBackupStats] = useState<any>(null);

  // Load database stats on component mount
  useEffect(() => {
    fetchDatabaseStats();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      const response = await fetch('/api/settings/stats');
      if (response.ok) {
        const stats = await response.json();
        setBackupStats(stats);
      }
    } catch (error) {
      console.error('Error fetching database stats:', error);
    }
  };

  const handleExportBackup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/backup/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seapunk-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Backup exportado exitosamente');
      } else {
        throw new Error('Error al exportar backup');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error al exportar el backup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportBackup = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('backup', file);

      const response = await fetch('/api/settings/backup/import', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Backup importado exitosamente');
        await fetchDatabaseStats();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al importar backup');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Error al importar el backup');
    } finally {
      setIsLoading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const handleResetDatabase = async () => {
    if (resetPhrase !== 'RESET DATABASE') {
      toast.error('Debes escribir exactamente "RESET DATABASE" para confirmar');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/backup/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmationPhrase: resetPhrase }),
      });

      if (response.ok) {
        toast.success('Base de datos reiniciada exitosamente');
        setResetPhrase('');
        await fetchDatabaseStats();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al reiniciar la base de datos');
      }
    } catch (error) {
      console.error('Reset error:', error);
      toast.error('Error al reiniciar la base de datos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto p-6 space-y-8'>
      <div className='flex items-center space-x-2'>
        <Database className='h-8 w-8' />
        <h1 className='text-3xl font-bold'>Configuración y Base de Datos</h1>
      </div>

      {/* Database Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Database className='h-5 w-5' />
            <span>Estadísticas de la Base de Datos</span>
          </CardTitle>
          <CardDescription>
            Información general sobre el estado actual de tu base de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backupStats ? (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {backupStats.characters}
                </div>
                <div className='text-sm text-muted-foreground'>Personajes</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {backupStats.players}
                </div>
                <div className='text-sm text-muted-foreground'>Jugadores</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>
                  {backupStats.tasks}
                </div>
                <div className='text-sm text-muted-foreground'>Tareas</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-orange-600'>
                  {backupStats.users}
                </div>
                <div className='text-sm text-muted-foreground'>Usuarios</div>
              </div>
            </div>
          ) : (
            <div className='text-center text-muted-foreground'>
              Cargando estadísticas...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup Management */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Download className='h-5 w-5' />
            <span>Gestión de Backups</span>
          </CardTitle>
          <CardDescription>
            Exporta e importa copias de seguridad de tu base de datos
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Button
              onClick={handleExportBackup}
              disabled={isLoading}
              className='flex items-center space-x-2'
            >
              <Download className='h-4 w-4' />
              <span>Exportar Backup</span>
            </Button>

            <div className='flex items-center space-x-2'>
              <Label htmlFor='backup-file' className='cursor-pointer'>
                <Button asChild disabled={isLoading}>
                  <span className='flex items-center space-x-2'>
                    <Upload className='h-4 w-4' />
                    <span>Importar Backup</span>
                  </span>
                </Button>
              </Label>
              <Input
                id='backup-file'
                type='file'
                accept='.json'
                onChange={handleImportBackup}
                className='hidden'
              />
            </div>
          </div>

          <div className='text-sm text-muted-foreground'>
            Los backups incluyen todos los datos: personajes, jugadores, tareas,
            usuarios y sus relaciones.
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Database Reset */}
      <Card className='border-destructive'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2 text-destructive'>
            <AlertTriangle className='h-5 w-5' />
            <span>Zona Peligrosa</span>
          </CardTitle>
          <CardDescription>
            Acciones irreversibles que afectarán permanentemente tu base de
            datos
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='reset-phrase'>
              Para reiniciar la base de datos, escribe exactamente:{' '}
              <code className='bg-muted px-1 rounded'>RESET DATABASE</code>
            </Label>
            <Input
              id='reset-phrase'
              type='text'
              value={resetPhrase}
              onChange={(e) => setResetPhrase(e.target.value)}
              placeholder='Escribe RESET DATABASE para confirmar'
              className='font-mono'
            />
          </div>

          <Button
            onClick={handleResetDatabase}
            disabled={isLoading || resetPhrase !== 'RESET DATABASE'}
            variant='destructive'
            className='flex items-center space-x-2'
          >
            <RotateCcw className='h-4 w-4' />
            <span>Reiniciar Base de Datos</span>
          </Button>

          <div className='text-sm text-destructive'>
            ⚠️ Esta acción eliminará TODOS los datos permanentemente. Asegúrate
            de tener un backup antes de continuar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default SettingsPage;
