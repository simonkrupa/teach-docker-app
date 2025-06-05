import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import bridgeImage from 'assets/imgs/transdefaultbridge.drawio.png';
import bridgeImageEN from 'assets/imgs/en/transdefaultbridge.drawio.png';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function DefaultBridgeOverview() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const selectedImage = i18n.language === 'en' ? bridgeImageEN : bridgeImage;

  const handleProceedNavigation = () => {
    navigate('/default-bridge/task');
  };
  return (
    <div className="all-pages">
      <h1>{t('defaultBridge_title')}</h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          // alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 400px', maxWidth: '70%' }}>
          <p>{t('defaultBridge_p1')}</p>
          <p>{t('defaultBridge_p2')}</p>
          <p>{t('defaultBridge_p3')}</p>
          <p>{t('defaultBridge_p4')}</p>
        </div>
        <img
          src={selectedImage}
          alt=""
          className="images"
          style={{
            height: '481px',
            width: '491px',
            marginTop: '20px',
            marginLeft: '20px',
            // flexShrink: 0,
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
