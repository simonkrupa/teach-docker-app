import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import bridgeImage from 'assets/imgs/transuserbridge.png';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function BridgeOverview() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/bridge/task');
  };
  return (
    <div className="all-pages">
      <h1>{t('bridge_overview_title')}</h1>
      <p>{t('bridge_overview_p1')}</p>
      <p>{t('bridge_overview_p2')}</p>
      <p>{t('bridge_overview_p3')}</p>
      <p>{t('bridge_overview_p4')}</p>
      <img
        src={bridgeImage}
        alt=""
        style={{
          width: '561px',
          height: '411px',
          display: 'block',
          margin: '0 auto',
        }}
      />

      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
        style={{ marginTop: '3%' }}
      >
        {t('next')}
      </Button>
      <DropdownWithHint />
    </div>
  );
}
