import LangToggle from '@ui/components/LangToggle';
import ToggleTheme from '@ui/components/ToggleTheme';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className='flex h-full flex-col'>
      <div className='flex flex-1 flex-col items-center justify-center gap-2'>
        <span>
          <h1 className='font-mono text-4xl font-bold'>{t('appName')}</h1>
          <p
            className='text-end text-sm uppercase text-muted-foreground'
            data-testid='pageTitle'
          >
            {t('titleHomePage')}
          </p>
        </span>
        <LangToggle />
        <ToggleTheme />
      </div>
    </div>
  );
}
