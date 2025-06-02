import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import ipvlanImage from 'assets/imgs/ipvlantask.jpg';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function IpvlanTask() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/ipvlan/seventh-diagram');
  };
  return (
    <div className="all-pages">
      <h1>{t('ipvlan_task_title')}</h1>
      <ol>
        <li>{t('ipvlan_task_step_1')}</li>
        <li>{t('ipvlan_task_step_2')}</li>
        <li>{t('ipvlan_task_step_3')}</li>
      </ol>
      <p>{t('ipvlan_task_description')}</p>
      <img
        src={ipvlanImage}
        alt=""
        style={{
          width: '500px',
          height: '601px',
          display: 'block',
          margin: '0 auto',
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
