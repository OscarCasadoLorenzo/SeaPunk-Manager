import Footer from '@/ui/templates/Footer';
import { useTranslation } from 'react-i18next';
import CharacterList from './characters/CharacterList';

export default function SecondPage() {
  const { t } = useTranslation();

  return (
    <div className='flex h-full flex-col'>
      <div className='flex flex-1 flex-col items-center justify-center gap-2'>
        <h1 className='text-4xl font-bold'>{t('titleSecondPage')}</h1>
      </div>
      <CharacterList />
      <Footer />
    </div>
  );
}
