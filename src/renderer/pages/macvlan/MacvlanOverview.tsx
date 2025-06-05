import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import macvlanImage from 'assets/imgs/transpmacvlan.png';
import macvlanImageEN from 'assets/imgs/en/transpmacvlan.png';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function MacvlanOverview() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const selectedImage = i18n.language === 'en' ? macvlanImageEN : macvlanImage;

  const handleProceedNavigation = () => {
    navigate('/macvlan/task');
  };
  return (
    <div className="all-pages">
      <h1>{t('macvlan_overview_title')}</h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          // alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 400px', maxWidth: '100%' }}>
          <p>{t('macvlan_overview_paragraph_1')}</p>
          <p>{t('macvlan_overview_paragraph_2')}</p>
          <p>{t('macvlan_overview_paragraph_3')}</p>
        </div>
        <img
          src={selectedImage}
          alt=""
          className="images"
          style={{
            height: '476px',
            width: '441px',
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
