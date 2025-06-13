import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'es' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const flagSrc = currentLang === 'en' ? '/es.svg' : '/gb.svg';
  const altText = currentLang === 'en' ? 'es' : 'eng';

  return (
    <button className="language-button" onClick={toggleLanguage}>
      <img src={flagSrc} alt={altText} className="language-img" />
    </button>
  );
};

export default LanguageSwitcher;
