import CharacterDetail from './components/CharacterDetail';

interface CharacterDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  return (
    <div className='container mx-auto py-4'>
      <CharacterDetail id={params.id} />
    </div>
  );
}
