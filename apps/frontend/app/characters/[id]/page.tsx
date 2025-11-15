import CharacterDetail from "./components/CharacterDetail";

interface CharacterDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  return <CharacterDetail id={params.id} />;
}
