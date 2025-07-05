import { setAppLanguage } from '@helpers/language_helpers';
import { useTranslation } from 'react-i18next';
import { ToggleGroup, ToggleGroupItem } from '../primitives/toggle-group';

export default function LangToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  function onValueChange(value: string) {
    setAppLanguage(value, i18n);
  }

  const langs = i18n.languages.map((lang) => {
    const langData = i18n.getResourceBundle(lang, 'translation');
    return {
      key: lang,
      prefix: langData?.langPrefix || '',
      nativeName: langData?.langNativeName || lang,
    };
  });

  return (
    <ToggleGroup
      type='single'
      onValueChange={onValueChange}
      value={currentLang}
    >
      {langs.map((lang) => (
        <ToggleGroupItem key={lang.key} value={lang.key}>
          {`${lang.prefix} ${lang.nativeName}`}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
