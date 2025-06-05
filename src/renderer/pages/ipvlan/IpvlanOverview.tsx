import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import ipvlanImage from 'assets/imgs/ipvlan.drawio.png';
import ipvlanImageEN from 'assets/imgs/en/ipvlan.drawio.png';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function IpvlanOverview() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const selectedImage = i18n.language === 'en' ? ipvlanImageEN : ipvlanImage;

  const handleProceedNavigation = () => {
    navigate('/ipvlan/task');
  };
  return (
    <div className="all-pages">
      <h1>{t('ipvlan_overview_title')}</h1>
      <p>{t('ipvlan_overview_paragraph_1')}</p>

      <img
        src={selectedImage}
        alt=""
        style={{
          width: '411px',
          height: '451px',
          display: 'block',
          margin: '0 auto',
          marginTop: '20px',
        }}
      />
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
