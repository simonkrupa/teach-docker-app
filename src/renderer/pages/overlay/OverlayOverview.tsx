import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import overlayImage1 from 'assets/imgs/transpovelay1.png';
import overlayImage2 from 'assets/imgs/transpoverlay2.png';
import overlaySwarmImage from 'assets/imgs/transpoverlay3.png';
import overlayImage1EN from 'assets/imgs/en/transpoverlay1.png';
import overlayImage2EN from 'assets/imgs/en/transpoverlay2.png';
import overlaySwarmImageEN from 'assets/imgs/en/transpoverlay3.png';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function OverlayOverview() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const selectedImage1 =
    i18n.language === 'en' ? overlayImage1EN : overlayImage1;
  const selectedImage2 =
    i18n.language === 'en' ? overlayImage2EN : overlayImage2;
  const selectedImage3 =
    i18n.language === 'en' ? overlaySwarmImageEN : overlaySwarmImage;

  const handleProceedNavigation = () => {
    navigate('/overlay/task');
  };
  return (
    <div className="all-pages">
      <h1>{t('overlay_overview_title')}</h1>
      <p>{t('overlay_overview_intro_1')}</p>
      <img
        src={selectedImage1}
        alt=""
        className="images"
        style={{ height: '281px', width: '419px', marginTop: '20px' }}
      />
      <p>{t('overlay_overview_intro_2')}</p>

      <img
        src={selectedImage2}
        alt=""
        className="images"
        style={{ height: '421px', width: '451px', marginTop: '20px' }}
      />
      <p>{t('overlay_overview_intro_3')}</p>
      <p>{t('overlay_overview_intro_4')}</p>
      <p>{t('overlay_overview_intro_5')}</p>
      <img
        src={selectedImage3}
        alt=""
        className="images"
        style={{ height: '291px', width: '381px' }}
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
