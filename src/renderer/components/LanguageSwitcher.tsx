import { useTranslation } from 'react-i18next';
import { GB, SK } from 'country-flag-icons/react/3x2';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'sk' ? 'en' : 'sk';
    i18n.changeLanguage(newLang);
  };

  return i18n.language === 'en' ? (
    <SK className="controlBtn no-drag" onClick={toggleLanguage} />
  ) : (
    <GB className="controlBtn no-drag" onClick={toggleLanguage} />
  );
};

export default LanguageSwitcher;
