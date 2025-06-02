import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function NoneOverview() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/none/task');
  };
  return (
    <div className="all-pages">
      <h1>{t('none_overview_title')}</h1>
      <p>{t('none_overview_description')}</p>
      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        {t('next')}
      </Button>
      <DropdownWithHint />
    </div>
  );
}
