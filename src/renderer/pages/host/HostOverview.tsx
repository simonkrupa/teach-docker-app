import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import hostImage from 'assets/imgs/transhost.png';
import hostImageEN from 'assets/imgs/en/transhost.png';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function HostOverview() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const selectedImage = i18n.language === 'en' ? hostImageEN : hostImage;

  const handleProceedNavigation = () => {
    navigate('/host/task');
  };
  return (
    <div className="all-pages">
      <h1>{t('host_overview_title')}</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          // alignItems: 'center',
        }}
      >
        <p style={{ maxWidth: '50%' }}>{t('host_overview_description')}</p>
        <img
          src={selectedImage}
          alt=""
          className="images"
          style={{
            height: '331px',
            width: '451px',
            marginTop: '20px',
            marginLeft: '20px',
          }}
        />
      </div>
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
